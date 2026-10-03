import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-full border border-black/5 bg-white text-primary shadow-sm">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate font-semibold leading-tight text-current">
                    Students Learning and Module Repository
                </span>
                <span className="truncate text-xs leading-tight text-current opacity-70">
                    Learning Repository
                </span>
            </div>
        </>
    );
}