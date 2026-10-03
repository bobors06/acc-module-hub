import { Link, usePage } from '@inertiajs/react';
import { Download, LayoutGrid, Upload } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
    { title: 'My Downloads', href: '/downloads', icon: Download },
];

const adminNavItems: NavItem[] = [
    { title: 'Upload Module', href: '/modules/create', icon: Upload },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Platform" />
                {['admin', 'teacher'].includes(auth.user?.role) && (
    <NavMain items={adminNavItems} label="Upload" />
)}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}