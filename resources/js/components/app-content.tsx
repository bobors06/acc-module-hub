import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main
            className="relative isolate flex min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden"
            {...props}
        >
            {/* Background layer */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <img
                    src="/images/module-bg.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-background/[0.98]" />
            </div>

            {/* Foreground content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 p-4">
                {children}
            </div>
        </main>
    );
}
