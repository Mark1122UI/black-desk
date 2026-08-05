'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Briefcase, Folders, CheckSquare,
  Video, Calendar, BookOpen, FileText, Bot, Network,
  Workflow, PieChart, CreditCard, Bell, Shield, Settings, FileCode, Sparkles, Brain, Wrench, Database, UserCheck, Cpu,
  ChevronLeft, ChevronRight, Activity, Building2, UserCircle, Zap, Target, CalendarCheck, FileSignature, ScrollText, FolderKanban, Clock, UsersRound, Layers
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '', icon: LayoutDashboard },
  { name: 'Executive AI Dashboard', href: '/executive', icon: Activity },
  { name: 'Enterprise Analytics', href: '/analytics', icon: PieChart },
  { name: 'Enterprise CRM Hub', href: '/crm', icon: Layers },
  { name: 'Companies', href: '/crm?tab=companies', icon: Building2 },
  { name: 'Contacts', href: '/crm?tab=contacts', icon: UserCircle },
  { name: 'Leads', href: '/crm?tab=leads', icon: Target },
  { name: 'Opportunities', href: '/crm?tab=opportunities', icon: Zap },
  { name: 'Meetings', href: '/crm?tab=meetings', icon: CalendarCheck },
  { name: 'Proposals', href: '/crm?tab=proposals', icon: FileSignature },
  { name: 'Contracts', href: '/crm?tab=contracts', icon: ScrollText },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/projects/tasks', icon: CheckSquare },
  { name: 'Time Tracking', href: '/projects/time-tracking', icon: Clock },
  { name: 'Resources', href: '/projects/resources', icon: UsersRound },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Departments', href: '/departments', icon: Briefcase },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Roles', href: '/roles', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Communications', href: '/settings/communications', icon: Bell },
  { name: 'AI Assistant', href: '/ai/assistant', icon: Bot },
  { name: 'AI Agents', href: '/ai/agents', icon: UserCheck },
  { name: 'AI Orchestrator', href: '/ai/orchestrator', icon: Network },
  { name: 'AI Tools', href: '/ai/tools', icon: Wrench },
  { name: 'RAG Engine', href: '/ai/rag', icon: Database },
  { name: 'AI Settings', href: '/settings/ai', icon: Settings },
  { name: 'Prompt Library', href: '/settings/prompts', icon: FileCode },
  { name: 'AI Chat', href: '/ai/chat', icon: Sparkles },
  { name: 'AI Memory', href: '/ai/memory', icon: Brain },
  { name: 'Business Processes', href: '/ai/business-processes', icon: Cpu },
];

export function Sidebar({ orgSlug, workspaceId }: { orgSlug: string, workspaceId?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const basePath = `/${orgSlug}`;

  return (
    <aside className={cn(
      "flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-zinc-800">
        {!collapsed && <span className="font-semibold text-sm truncate">{workspaceId || orgSlug}</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {navigation.map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive = pathname === href || (item.href !== '' && pathname.startsWith(href));
          
          return (
            <Link
              key={item.name}
              href={href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary dark:bg-primary/20" 
                  : "text-gray-700 dark:text-zinc-300 hover:bg-gray-200/50 dark:hover:bg-zinc-800",
                collapsed ? "justify-center" : ""
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", collapsed ? "" : "mr-3", isActive ? "text-primary" : "text-gray-500 dark:text-zinc-400")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
