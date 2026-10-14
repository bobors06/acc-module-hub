export function AccFooter({ className = '' }: { className?: string }) {
    return (
        <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-white/15 bg-primary px-4 py-3 text-xs text-primary-foreground">
            <img src="/images/acc-module-hub-logo.png" alt="ACC Module Hub" className="h-8 w-8 object-contain" />
            <img src="/images/acc-logo.jpg" alt="Abuyog Community College" className="size-6 rounded-full object-cover" />
            <span>© {new Date().getFullYear()} ACC Module Hub</span>
            <span aria-hidden="true">·</span>
            <span>Abuyog Community College</span>
        </footer>
    );
}
