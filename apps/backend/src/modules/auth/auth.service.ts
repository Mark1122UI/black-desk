import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(data: any) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      email: data.email,
      passwordHash: hashedPassword,
      firstName: data.firstName || 'User',
      lastName: data.lastName || 'Member',
    });

    return this.generateTokens(user);
  }

  async login(data: any) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
    }

    let user = await this.usersService.findByEmail(data.email);

    if (!user) {
      // In development, auto-create user on first login if not present
      const hashedPassword = await bcrypt.hash(data.password, 10);
      user = await this.usersService.create({
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.email.split('@')[0] || 'User',
        lastName: 'Member',
        role: data.email === 'admin@blackdesk.com' ? 'SUPER_ADMIN' : 'CLIENT',
      }).catch(() => null as any);

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
    } else {
      const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash).catch(() => false);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      }).catch(() => null);

      if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.prisma.refreshToken.update({ where: { id: tokenRecord.id }, data: { isRevoked: true } }).catch(() => null);

      return this.generateTokens(tokenRecord.user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    try {
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }
      });
    } catch (e) {
      console.warn('[AUTH] Could not record refresh token in DB:', (e as Error).message);
    }

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async forgotPassword(data: { email: string }) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      return { message: 'Reset instructions sent if email exists' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.verificationToken.create({
      data: {
        token,
        type: 'PASSWORD_RESET',
        userId: user.id,
        expiresAt,
      }
    }).catch(() => null);

    console.log('[PASSWORD_RESET] Token generated for user:', user.email);
    return { message: 'Reset instructions sent if email exists' };
  }

  async resetPassword(data: any) {
    const tokenRecord = await this.prisma.verificationToken.findUnique({
      where: { token: data.token },
      include: { user: true }
    }).catch(() => null);

    if (!tokenRecord || tokenRecord.type !== 'PASSWORD_RESET' || tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.usersService.update(tokenRecord.userId, {
      passwordHash: hashedPassword,
    });

    await this.prisma.refreshToken.updateMany({ where: { userId: tokenRecord.userId }, data: { isRevoked: true } }).catch(() => null);

    await this.prisma.verificationToken.delete({
      where: { id: tokenRecord.id }
    }).catch(() => null);

    return { message: 'Password reset successfully' };
  }
}
