import { AccModuleHubLogo } from '@/components/acc-module-hub-logo';

export default function AppLogo() {
    return (
        <>
            <AccModuleHubLogo className="size-9" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate font-semibold leading-tight text-current">
                    ACC Module Hub
                </span>
                <span className="truncate text-xs leading-tight text-current opacity-70">
                    Abuyog Community College
                </span>
            </div>
            <img src="/images/acc-logo.jpg" alt="Abuyog Community College" className="size-8 rounded-full object-cover" />
        </>
    );
}
