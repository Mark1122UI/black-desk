import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Role } from '../../common/roles';
import * as crypto from 'crypto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  // ============================
  // TEAM CRUD
  // ============================
  
  async createTeam(orgId: string, userId: string, data: any) {
    return this.prisma.team.create({
      data: {
        ...data,
        organizationId: orgId,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async findAllTeams(orgId: string) {
    return this.prisma.team.findMany({
      where: { organizationId: orgId, isDeleted: false },
      include: {
        leader: { select: { id: true, firstName: true, lastName: true, email: true } },
        department: { select: { id: true, name: true } },
        _count: { select: { members: true } },
      },
    });
  }

  async findOneTeam(orgId: string, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, organizationId: orgId, isDeleted: false },
      include: {
        leader: { select: { id: true, firstName: true, lastName: true, email: true } },
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
      },
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async updateTeam(orgId: string, teamId: string, userId: string, data: any) {
    const existing = await this.prisma.team.findFirst({
      where: { id: teamId, organizationId: orgId, isDeleted: false },
    });
    if (!existing) throw new NotFoundException('Team not found');

    return this.prisma.team.update({
      where: { id: teamId },
      data: { ...data, updatedBy: userId },
    });
  }

  async removeTeam(orgId: string, teamId: string, userId: string) {
    const existing = await this.prisma.team.findFirst({
      where: { id: teamId, organizationId: orgId, isDeleted: false },
    });
    if (!existing) throw new NotFoundException('Team not found');

    return this.prisma.team.update({
      where: { id: teamId },
      data: { isDeleted: true, updatedBy: userId },
    });
  }

  // ============================
  // INVITATIONS & ORG MEMBERS (Legacy from earlier step)
  // ============================

  async inviteMember(orgId: string, inviterId: string, data: { email: string; role: Role; workspaceId?: string }) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await this.prisma.invitation.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        organizationId: orgId,
        workspaceId: data.workspaceId,
        createdBy: inviterId,
        expiresAt,
      },
    });

    // TODO: Send email
    return invitation;
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { token } });
    if (!invitation || invitation.status !== 'PENDING' || invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired invitation');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.invitation.update({ where: { id: invitation.id }, data: { status: 'ACCEPTED' } });

      await tx.organizationMember.upsert({
        where: { userId_organizationId: { userId, organizationId: invitation.organizationId } },
        update: { role: invitation.role },
        create: { userId, organizationId: invitation.organizationId, role: invitation.role },
      });

      if (invitation.workspaceId) {
        await tx.workspaceMember.upsert({
          where: { userId_workspaceId: { userId, workspaceId: invitation.workspaceId } },
          update: { role: invitation.role },
          create: { userId, workspaceId: invitation.workspaceId, role: invitation.role },
        });
      }

      return { success: true };
    });
  }

  async getMembers(orgId: string, query: { search?: string, departmentId?: string, teamId?: string, page?: number, limit?: number } = {}) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.teamId) {
      where.user = { teamMembers: { some: { teamId: query.teamId } } };
    }
    if (query.search) {
      where.user = {
        ...where.user,
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ]
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.organizationMember.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, lastLogin: true, dateJoined: true, profilePictureUrl: true, teamMembers: { include: { team: { select: { id: true, name: true, color: true } } } } } },
          department: true,
          customRole: true,
        },
      }),
      this.prisma.organizationMember.count({ where })
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async removeMember(orgId: string, memberId: string) {
    return this.prisma.organizationMember.update({
      where: { id: memberId },
      data: { status: 'INACTIVE' }, // Soft delete logic
    });
  }

  async changeRole(orgId: string, memberId: string, newRole: Role) {
    return this.prisma.organizationMember.update({
      where: { id: memberId },
      data: { role: newRole },
    });
  }
}
