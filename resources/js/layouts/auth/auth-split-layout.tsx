import { Link } from '@inertiajs/react';
import { AccModuleHubLogo } from '@/components/acc-module-hub-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative isolate flex h-dvh w-screen items-center justify-center overflow-hidden p-6">
            {/* Full-screen module background behind the card */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/images/module-bg.jpg"
                    alt=""
                    className="h-full w-full scale-105 object-cover"
                />
                <div className="absolute inset-0 bg-[#1D284C]/95" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Raised split authentication card */}
            <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-black/20 bg-background shadow-2xl lg:h-[90dvh] lg:grid-cols-2">
                {/* Branded panel with the ACC watermark inside the card */}
                <div className="relative hidden flex-col overflow-hidden p-10 text-white lg:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1D284C] to-[#141B33]" />
                    <div className="absolute -left-24 -top-24 size-72 rounded-full border border-white/10" />
                    <div className="absolute -left-12 -top-12 size-48 rounded-full border border-white/10" />
                    <div className="absolute bottom-[-8rem] right-[-6rem] size-80 rounded-full bg-blue-300/10 blur-3xl" />
                    <img
                        src="/images/acc-logo.jpg"
                        alt=""
                        className="pointer-events-none absolute right-[-7rem] top-1/2 z-10 size-[26rem] -translate-y-1/2 rounded-full opacity-8 grayscale"
                    />

                    <Link
                        href={home()}
                        className="relative z-20 flex items-center gap-2 text-lg font-medium"
                    >
                        <AccModuleHubLogo className="size-10" />
                        <span className="text-sm font-semibold">ACC Module Hub</span>
                    </Link>

                    <div className="relative z-20 mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-sm">
                        <span className="size-1.5 rounded-full bg-amber-300" />
                        Abuyog Community College
                    </div>

                    <div className="relative z-20 mt-6 max-w-[260px]">
                        <h2 className="text-xl font-bold leading-snug">
                            Student Learning and Module Repository System
                        </h2>
                        <p className="mt-2.5 text-sm leading-relaxed text-white/65">
                            Access your learning materials, modules, and resources anytime, anywhere.
                        </p>
                    </div>

                    <div className="relative z-20 mt-8 grid max-w-[280px] grid-cols-2 gap-2 text-xs text-white/70">
                        <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                            <div className="mb-1 text-lg font-bold text-white">01</div>
                            Browse modules
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                            <div className="mb-1 text-lg font-bold text-white">02</div>
                            Learn and share
                        </div>
                    </div>

                    <svg
                        className="relative z-20 mt-auto w-[80%] self-center opacity-90"
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

                    <div className="relative z-20 mt-auto flex items-center gap-2 text-xs text-white/55">
                        <img src="/images/acc-logo.jpg" alt="" className="size-7 rounded-full object-cover opacity-80" />
                        <span>Institutional learning resource hub</span>
                    </div>
                </div>

                {/* Clean form panel */}
                <div className="relative overflow-y-auto bg-background p-8 sm:p-10">
                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/5" />
                    <div className="relative z-10 mx-auto flex w-full max-w-[350px] flex-col justify-center gap-6">
                        <Link
                            href={home()}
                            className="relative z-20 flex items-center justify-center lg:hidden"
                        >
                            <div className="flex items-center gap-2">
                                <AccModuleHubLogo className="size-10" />
                                <img
                                    src="/images/acc-logo.jpg"
                                    alt="Abuyog Community College"
                                    className="size-8 rounded-full object-cover"
                                />
                            </div>
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
