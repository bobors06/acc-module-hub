import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import Chatbox from '@/components/chatbox';
import { FolderOpen, Eye, Download, Power, FileText, X } from 'lucide-react';

const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

const subjectColor: Record<string, string> = {
    'Computer Science': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    Mathematics: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    English: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

type ModuleType = {
    id: number;
    title: string;
    subject: string;
    file_type: string;
    file_size: number;
    file_path: string;
    created_at: string;
    is_active: boolean;
    uploader: { name: string };
};

const formatDateTime = (date: string) =>
    new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Manila',
    }).format(new Date(date));


export default function Dashboard() {
    const { auth, modules, filters } = usePage().props as any;
        const canManageModules = ['admin', 'teacher'].includes(
        auth.user?.role,
    );
    

    const [previewModule, setPreviewModule] = useState<any>(null);

    const list: ModuleType[] = modules ?? [];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
    Welcome back, {auth.user?.name}
</div>

                        <h1 className="text-2xl font-bold">
                            Pick up where you left off{auth.user?.year_level ? ` in your ${auth.user.year_level} modules` : ''}.
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{list.length}</div>
                        <div className="text-xs text-muted-foreground">modules available to you</div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
    {years.map((year) => {
        const isAll = year === 'All';
        const isActive = isAll ? !filters?.year_level : filters?.year_level === year;

        return (
            <Link
                key={year}
                href={isAll ? dashboard.url() : dashboard.url({ query: { year_level: year } })}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                    isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground'
                }`}
            >
                {year}
            </Link>
        );
    })}
</div>

                {list.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
                        <FolderOpen className="size-8 text-muted-foreground" />
                        <div className="text-sm font-medium">No modules uploaded yet</div>
                        <div className="max-w-xs text-xs text-muted-foreground">
                            Once an admin uploads learning materials, they'll show up here.
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                        {list.map((m) => (  
                            <div key={m.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${subjectColor[m.subject] ?? 'bg-muted text-muted-foreground'}`}>
                                        {m.subject}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                                        <FileText className="size-3.5" />
                                        {m.file_type}
                                    </span>
                                </div>
                                <h3 className="text-sm font-semibold leading-snug">{m.title}</h3>
                                {canManageModules && (
    <div className="flex items-center gap-2">
        <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                m.is_active
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-red-500/10 text-red-600'
            }`}
        >
            {m.is_active ? 'Active' : 'Disabled'}
        </span>

        <button
            type="button"
            onClick={() => {
                const action = m.is_active ? 'disable' : 'enable';
                const message = m.is_active
                    ? 'Disable this module for students?'
                    : 'Enable this module for students again?';

                if (!window.confirm(message)) {
                    return;
                }

                router.patch(`/modules/${m.id}/${action}`, {}, {
                    preserveScroll: true,
                });
            }}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                m.is_active
                    ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
            }`}
        >
            <Power className="size-3.5" />
            {m.is_active ? 'Disable' : 'Enable'}
        </button>
    </div>
)}

                                <div className="text-xs text-muted-foreground">
    Uploaded by {m.uploader?.name} · {formatDateTime(m.created_at)}
</div>  
                            <div className="flex items-center justify-between border-t border-border pt-2">
    <span className="text-xs text-muted-foreground">
        {(m.file_size / 1024 / 1024).toFixed(1)} MB
    </span>

    <div className="flex items-center gap-2">
        <button
    type="button"
    onClick={() => setPreviewModule(m)}
    className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
>
    <Eye className="size-3.5" />
    Preview
</button>


        <a
            href={`/modules/${m.id}/download`}
            download
            className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20"
        >
            <Download className="size-3.5" />
            Download
        </a>
    </div>
</div>


                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Chatbox /> 
            {previewModule && (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onClick={() => setPreviewModule(null)}
    >
        <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
        >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                    <h2 className="font-semibold text-foreground">
                        {previewModule.title}
                    </h2>

                    <p className="text-xs text-muted-foreground">
                        {previewModule.subject} · {previewModule.file_type}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setPreviewModule(null)}
                    className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Close preview"
                >
                    <X className="size-5" />
                </button>
            </div>

            {/* Modal content */}
            {/* Modal content */}
<div className="min-h-[400px] flex-1 bg-muted/30 p-4">
    {previewModule.file_type?.toLowerCase() === 'docx' ? (
        <div className="flex h-[65vh] flex-col items-center justify-center gap-3 rounded-md border border-border bg-background text-center">
            <FileText className="size-12 text-muted-foreground" />

            <h3 className="font-semibold text-foreground">
                Word document preview is not available yet
            </h3>

            <p className="max-w-md text-sm text-muted-foreground">
                Download this Word document to open it in Microsoft Word or another compatible application.
            </p>
        </div>
    ) : (
        <iframe
            src={`/modules/${previewModule.id}/preview`}
            title={`Preview of ${previewModule.title}`}
            className="h-[65vh] w-full rounded-md border border-border bg-white"
        />
    )}
</div>


            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                <button
                    type="button"
                    onClick={() => setPreviewModule(null)}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                    Close
                </button>

                <a
                    href={`/modules/${previewModule.id}/download`}
                    download
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    <Download className="size-4" />
                    Download
                </a>
            </div>
        </div>
    </div>
)}

        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};