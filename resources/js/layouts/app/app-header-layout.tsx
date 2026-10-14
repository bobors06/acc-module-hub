import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AccFooter } from '@/components/acc-footer';
import { AppShell } from '@/components/app-shell';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
            <AccFooter />
        </AppShell>
    );
}
