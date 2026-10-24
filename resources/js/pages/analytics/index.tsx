import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, BookOpen, Download, Heart, MessageCircle } from 'lucide-react';
import { dashboard } from '@/routes';

type Summary = {
    total_modules: number;
    total_downloads: number;
    total_likes: number;
    total_feedback: number;
    total_engagement: number;
};

type TopModule = {
    id: number;
    title: string;
    subject: string;
    year_level: string;
    downloads_count: number;
    likes_count: number;
    feedback_count: number;
    engagement_count: number;
};

type YearBreakdown = {
    year_level: string;
    modules_count: number;
    downloads_count: number;
    likes_count: number;
};

type AnalyticsProps = {
    summary: Summary;
    topModules: TopModule[];
    yearBreakdown: YearBreakdown[];
};

const numberFormat = new Intl.NumberFormat('en-PH');

function MetricCard({
    label,
    value,
    icon: Icon,
    description,
}: {
    label: string;
    value: number;
    icon: typeof BookOpen;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="size-5 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-bold">
                {numberFormat.format(value)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
    );
}

export default function Analytics() {
    const { summary, topModules, yearBreakdown } = usePage().props as unknown as AnalyticsProps;
    const highestEngagement = Math.max(...topModules.map((module) => module.engagement_count), 1);

    return (
        <>
            <Head title="Admin Analytics" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-primary">Platform overview</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight">
                            Module analytics
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            See which learning materials students use and value most across all year levels.
                        </p>
                    </div>
                    <Link
                        href={dashboard()}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Back to dashboard
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <MetricCard label="Total modules" value={summary.total_modules} icon={BookOpen} description="Uploaded resources" />
                    <MetricCard label="Downloads" value={summary.total_downloads} icon={Download} description="Recorded downloads" />
                    <MetricCard label="Hearts" value={summary.total_likes} icon={Heart} description="Student likes" />
                    <MetricCard label="Feedback" value={summary.total_feedback} icon={MessageCircle} description="Student comments" />
                    <MetricCard label="Engagement" value={summary.total_engagement} icon={BarChart3} description="Downloads, hearts, and feedback" />
                </div>

                <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="font-semibold">Activity by year level</h2>
                        <p className="text-sm text-muted-foreground">Compare resource supply and student activity.</p>
                    </div>
                    {yearBreakdown.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No analytics data yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left text-sm">
                                <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-3">Year level</th>
                                        <th className="px-3 py-3">Modules</th>
                                        <th className="px-3 py-3">Downloads</th>
                                        <th className="px-3 py-3">Hearts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yearBreakdown.map((row) => (
                                        <tr key={row.year_level} className="border-b border-border last:border-0">
                                            <td className="px-3 py-3 font-medium">{row.year_level}</td>
                                            <td className="px-3 py-3">{numberFormat.format(row.modules_count)}</td>
                                            <td className="px-3 py-3">{numberFormat.format(row.downloads_count)}</td>
                                            <td className="px-3 py-3">{numberFormat.format(row.likes_count)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="font-semibold">Most engaged modules</h2>
                        <p className="text-sm text-muted-foreground">Ranked by downloads, hearts, and feedback.</p>
                    </div>
                    {topModules.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No modules available yet.</p>
                    ) : (
                        <div className="grid gap-3">
                            {topModules.map((module, index) => (
                                <div key={module.id} className="rounded-lg border border-border p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="truncate font-medium">{module.title}</h3>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {module.subject} · {module.year_level}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                            <span><Download className="mr-1 inline size-3.5" />{module.downloads_count}</span>
                                            <span><Heart className="mr-1 inline size-3.5" />{module.likes_count}</span>
                                            <span><MessageCircle className="mr-1 inline size-3.5" />{module.feedback_count}</span>
                                            <strong className="text-foreground">{module.engagement_count} total</strong>
                                        </div>
                                    </div>
                                    <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted" aria-label={`${module.engagement_count} engagement points`}>
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${module.engagement_count > 0 ? Math.max((module.engagement_count / highestEngagement) * 100, 4) : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

Analytics.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Analytics', href: '/analytics' },
    ],
};
