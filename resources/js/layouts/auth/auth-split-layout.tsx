import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative isolate flex h-dvh w-screen items-center justify-center overflow-hidden p-6">

            {/* SLMR background image */}
<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <img
        src="/images/module-bg.jpg"
        alt=""
        className="h-full w-full scale-105 object-cover"
    />

    <div className="absolute inset-0 bg-[#1D284C]/65" />
    <div className="absolute inset-0 bg-black/40" />
</div>


            {/* Card, sits above the background */}
            <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-black/20 bg-background shadow-2xl lg:h-[90dvh] lg:grid-cols-2">


                <div className="relative hidden flex-col p-10 text-white lg:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1D284C] to-[#141B33]" />

                    <Link
                        href={home()}
                        className="relative z-20 flex items-center gap-2 text-lg font-medium"
                    >
                        <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                            <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
                        </svg>
                    </Link>

                    <div className="relative z-20 mt-6 max-w-[260px]">
                        <h2 className="text-xl font-bold leading-snug">
                            Student Learning and Module Repository System
                        </h2>
                        <p className="mt-2.5 text-sm leading-relaxed text-white/65">
                            Access your learning materials, modules, and resources anytime, anywhere.
                        </p>
                    </div>

                    <svg
                        className="relative z-10 mt-auto w-[80%] self-center opacity-90"
                        viewBox="0 0 240 160"
                        fill="none"
                    >
                        <rect x="18" y="120" width="70" height="10" rx="2" fill="#fff" opacity="0.18" />
                        <rect x="24" y="106" width="58" height="12" rx="2" fill="#fff" opacity="0.28" />
                        <rect x="30" y="90" width="46" height="14" rx="2" fill="#fff" opacity="0.4" />
                        <rect x="95" y="60" width="120" height="80" rx="6" fill="#fff" opacity="0.12" />
                        <rect x="105" y="70" width="100" height="55" rx="3" fill="#fff" opacity="0.2" />
                        <path d="M95 140h120l8 10H87l8-10Z" fill="#fff" opacity="0.3" />
                        <circle cx="205" cy="35" r="16" fill="#fff" opacity="0.1" />
                        <path
                            d="M140 82h60M140 94h60M140 106h40"
                            stroke="#fff"
                            strokeOpacity="0.35"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="absolute -bottom-24 -right-24 z-0 h-80 w-80 rounded-full bg-white/[0.06] blur-2xl" />
                </div>

                <div className="overflow-y-auto p-8 sm:p-10">
                    <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center gap-6">
                        <Link
                            href={home()}
                            className="relative z-20 flex items-center justify-center lg:hidden"
                        >
                            <AppLogoIcon className="h-10 fill-current text-foreground sm:h-12" />
                        </Link>
                        <div className="flex flex-col items-start gap-2 text-left">
                            <h1 className="text-xl font-medium text-foreground">{title}</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}