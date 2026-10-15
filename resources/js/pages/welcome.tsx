import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Library,
    LogIn,
    ShieldCheck,
    Sparkles,
    Upload,
} from 'lucide-react';
import { login, register } from '@/routes';
import { AccFooter } from '@/components/acc-footer';
import { AccModuleHubLogo } from '@/components/acc-module-hub-logo';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome to ACC Module Hub  " />

            <main className="relative min-h-screen overflow-hidden bg-slate-950">
                {/* Background image */}
                <div className="absolute inset-0">
                    <div className="h-full w-full bg-gradient-to-br from-[#1d284c] via-[#263b72] to-slate-950" />
                    <div className="absolute inset-0 bg-slate-950/90" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#18234b]/90 via-[#18234b]/75 to-slate-950/95" />
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
                        <Link href="/" className="flex items-center gap-3">
                            <AccModuleHubLogo className="h-12 w-12" />
                            <img src="/images/acc-logo.jpg" alt="Abuyog Community College" className="h-10 w-10 rounded-full object-cover ring-2 ring-white/60" />

                            <div>
                                <div className="text-sm font-bold tracking-wide text-white">
                                    ACC Module Hub  
                                </div>
                                <div className="text-xs text-slate-300">
                                    Abuyog Community College
                                </div>
                            </div>
                        </Link>

                        <nav className="flex items-center gap-3">
                            <Link
                                href={login()}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Log in
                            </Link>

                            <Link
                                href={register()}
                                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#1d284c] shadow-lg transition hover:bg-slate-100"
                            >
                                Register
                            </Link>
                        </nav>
                    </header>

                    {/* Hero */}
                    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-32 lg:pt-24">
                        <div className="max-w-3xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 text-amber-300" />
                                A smarter way to access learning materials
                            </div>

                            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Learn, explore, and grow with .{' '}
                                <span className="text-blue-200">ACC Module Hub.</span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                                The Abuyog Community College Module Hub
                                connects learners with organized, accessible,
                                and reliable academic materials in one place.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-[#1d284c] shadow-xl transition hover:bg-slate-100"
                                >
                                    Create an account
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Sign in
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-blue-200" />
                                    Organized modules
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-blue-200" />
                                    Role-based access
                                </div>
                                <div className="flex items-center gap-2">
                                    <Library className="h-4 w-4 text-blue-200" />
                                    One learning hub
                                </div>
                            </div>
                        </div>

                        {/* Hero feature panel */}
                        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-200">
                                        Your learning space
                                    </p>
                                    <h2 className="mt-1 text-2xl font-bold text-white">
                                        Everything in one place
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1d284c]">
                                    <Library className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-200 text-[#1d284c]">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Browse modules
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            Find materials by year level and subject.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-200 text-[#1d284c]">
                                        <Upload className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Share knowledge
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            Teachers can upload helpful resources.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-200 text-[#1d284c]">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Support student success
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            Access the resources you need to learn.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Role cards */}
                    <section className="bg-white/95 px-6 py-20 text-slate-900 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-bold uppercase tracking-widest text-[#59688f]">
                                    Built for your academic community
                                </p>
                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1d284c] sm:text-4xl">
                                    One platform, three important roles
                                </h2>
                                <p className="mt-4 text-slate-600">
                                    ACC Module Hub gives every member of your learning
                                    community the tools they need.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                <RoleCard
                                    icon={<GraduationCap className="h-6 w-6" />}
                                    title="Students"
                                    description="Browse modules, filter materials by year level, and download resources for your studies."
                                    color="bg-blue-100 text-blue-700"
                                />

                                <RoleCard
                                    icon={<Upload className="h-6 w-6" />}
                                    title="Teachers"
                                    description="Upload learning modules and make quality academic resources available to students."
                                    color="bg-amber-100 text-amber-700"
                                />

                                <RoleCard
                                    icon={<ShieldCheck className="h-6 w-6" />}
                                    title="Administrators"
                                    description="Help manage the repository and keep the learning platform organized and reliable."
                                    color="bg-indigo-100 text-indigo-700"
                                />
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="bg-slate-50 px-6 py-20 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            <div className="text-center">
                                <p className="text-sm font-bold uppercase tracking-widest text-[#59688f]">
                                    Simple to use
                                </p>
                                <h2 className="mt-3 text-3xl font-bold text-[#1d284c]">
                                    How ACC Module Hub works
                                </h2>
                            </div>

                            <div className="mt-12 grid gap-8 md:grid-cols-3">
                                <Step
                                    number="01"
                                    title="Create your account"
                                    description="Register as a student or teacher and access the features designed for your role."
                                />
                                <Step
                                    number="02"
                                    title="Find what you need"
                                    description="Browse the repository or filter modules by year level to quickly find useful materials."
                                />
                                <Step
                                    number="03"
                                    title="Learn and share"
                                    description="Download resources for your studies or upload modules to support other learners."
                                />
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-[#1d284c] px-6 py-20 text-center lg:px-10">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                Start your learning journey today.
                            </h2>
                            <p className="mt-4 text-slate-300">
                                Join ACC Module Hub and keep your learning materials
                                organized, accessible, and ready when you need them.
                            </p>
                            <Link
                                href={register()}
                                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-[#1d284c] transition hover:bg-slate-100"
                            >
                                Register now
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    {/* Footer */}
                    <AccFooter className="border-slate-800 bg-slate-950 text-slate-400" />
                </div>
            </main>
        </>
    );
}

function RoleCard({
    icon,
    title,
    description,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-[#1d284c]">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
            </p>
        </div>
    );
}

function Step({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="relative text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1d284c] text-sm font-bold text-white">
                {number}
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#1d284c]">{title}</h3>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
                {description}
            </p>
        </div>
    );
}
