import type { LucideIcon } from 'lucide-react';
export type * from './auth';
export type * from './navigation';
export type * from './ui';
export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    badge?: number;   // add this line
}