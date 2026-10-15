type Props = {
    className?: string;
    showInstitution?: boolean;
};

export function AccModuleHubLogo({ className = 'h-10 w-10', showInstitution = false }: Props) {
    return (
        <span className="inline-flex items-center gap-2">
            <img src="/images/acc-module-hub-logo.png" alt="ACC Module Hub" className={`${className} object-contain`} />
            {showInstitution && (
                <span className="grid text-left leading-tight">
                    <span className="font-semibold">ACC Module Hub</span>
                    <span className="text-xs opacity-70">Abuyog Community College</span>
                </span>
            )}
        </span>
    );
}
