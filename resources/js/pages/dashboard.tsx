import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import ModuleOfficePreview from '@/components/module-office-preview';
import { Download, Eye, FileText, FolderOpen, Heart, LockKeyhole, MessageCircle, Power, X } from 'lucide-react';

const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

const subjectColor: Record<string, string> = {
    'Computer Science': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    Mathematics: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    English: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

type AccessRequest = {
    id: number;
    student_id: number;
    student_name: string;
    status: 'pending' | 'approved';
    access_code?: string | null;
};

type Feedback = {
    id: number;
    comment: string;
    user_name: string;
    reply?: string | null;
    reply_by_name?: string | null;
};

type ModuleType = {
    id: number;
    title: string;
    subject: string;
    year_level: string;
    file_type: string;
    file_size: number;
    created_at: string;
    is_active: boolean;
    uploader: { name: string };
    access_status?: 'not_requested' | 'pending' | 'approved' | 'verified';
    access_requests?: AccessRequest[];
    likes_count?: number;
    user_has_liked?: boolean;
    feedbacks?: Feedback[];
};

const formatDateTime = (date: string) =>
    new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Manila',
    }).format(new Date(date));

export default function Dashboard() {
    const { auth, modules, filters } = usePage().props as any;
    const user = auth.user;
    const isStudent = user?.role === 'student';
    const canManageModules = ['admin', 'teacher'].includes(user?.role);
    const list: ModuleType[] = modules ?? [];

    const [previewModule, setPreviewModule] = useState<ModuleType | null>(null);
    const [accessModule, setAccessModule] = useState<ModuleType | null>(null);
    const [requestsModule, setRequestsModule] = useState<ModuleType | null>(null);
    const [accessCode, setAccessCode] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

    const needsAccess = (module: ModuleType) =>
        isStudent && module.access_status !== 'verified';

    const openPreview = (module: ModuleType) => {
        if (needsAccess(module)) {
            setAccessModule(module);
            setAccessCode('');
            return;
        }

        setPreviewModule(module);
    };

    const getFileExtension = (module: ModuleType) =>
        module.file_type.toLowerCase().replace(/^\./, '').split('/').pop() ?? '';

    const isDirectPreviewable = (module: ModuleType) =>
        ['pdf', 'txt', 'text', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(getFileExtension(module));

    const isOfficePreviewable = (module: ModuleType) =>
        ['docx', 'pptx', 'xls', 'xlsx'].includes(getFileExtension(module));

    const submitAccessCode = () => {
        if (!accessModule || accessCode.length !== 6) return;

        router.post(`/modules/${accessModule.id}/access/verify`, {
            access_code: accessCode,
        });
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            Welcome back, {user?.name}
                        </div>
                        <h1 className="text-2xl font-bold">
                            Pick up where you left off{user?.year_level ? ` in your ${user.year_level} modules` : ''}.
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
                                href={isAll ? '/dashboard' : `/dashboard?year_level=${encodeURIComponent(year)}`}
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

                {isStudent && (
                    <div className="rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-200">
                        Modules are visible for browsing, but you must request and enter an access code from the uploader before previewing or downloading one.
                    </div>
                )}

                {list.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
                        <FolderOpen className="size-8 text-muted-foreground" />
                        <div className="text-sm font-medium">No modules uploaded yet</div>
                        <div className="max-w-xs text-xs text-muted-foreground">
                            Once an admin uploads learning materials, they&apos;ll show up here.
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                        {list.map((module) => {
                            const locked = needsAccess(module);

                            return (
                                <div key={module.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${subjectColor[module.subject] ?? 'bg-muted text-muted-foreground'}`}>
                                            {module.subject}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                                            <FileText className="size-3.5" />
                                            {module.file_type}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-semibold leading-snug">{module.title}</h3>
                                    <div className="text-xs text-muted-foreground">
                                        {module.year_level} · Uploaded by {module.uploader?.name} · {formatDateTime(module.created_at)}
                                    </div>

                                    {canManageModules && (
                                        <div className="flex flex-col gap-2 rounded-md bg-muted/50 p-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${module.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                                    {module.is_active ? 'Active' : 'Disabled'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const action = module.is_active ? 'disable' : 'enable';
                                                        if (window.confirm(module.is_active ? 'Disable this module for students?' : 'Enable this module again?')) {
                                                            router.patch(`/modules/${module.id}/${action}`, {});
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${module.is_active ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}
                                                >
                                                    <Power className="size-3.5" />
                                                    {module.is_active ? 'Disable' : 'Enable'}
                                                </button>
                                                {(module.access_requests ?? []).length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setRequestsModule(module)}
                                                        className="flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
                                                    >
                                                        Requests
                                                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary">{module.access_requests?.length}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">{(module.file_size / 1024 / 1024).toFixed(1)} MB</span>
                                            <button
                                                type="button"
                                                onClick={() => router.post(`/modules/${module.id}/like`, {})}
                                                className={`flex items-center gap-1 text-xs ${module.user_has_liked ? 'text-rose-600' : 'text-muted-foreground hover:text-rose-600'}`}
                                                aria-label="Like module"
                                            >
                                                <Heart className={`size-4 ${module.user_has_liked ? 'fill-current' : ''}`} />
                                                {module.likes_count ?? 0}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openPreview(module)}
                                                className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                                            >
                                                {locked ? <LockKeyhole className="size-3.5" /> : <Eye className="size-3.5" />}
                                                {locked ? (
                                                    module.access_status === 'pending'
                                                        ? 'Request sent'
                                                        : module.access_status === 'approved'
                                                            ? 'Request approved'
                                                            : 'Request access'
                                                ) : 'Preview'}
                                            </button>
                                            {locked ? (
                                                <button
                                                    type="button"
                                                    onClick={() => openPreview(module)}
                                                    className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                                                >
                                                    <LockKeyhole className="size-3.5" />
                                                    Locked
                                                </button>
                                            ) : (
                                                <a href={`/modules/${module.id}/download`} download className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20">
                                                    <Download className="size-3.5" />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {accessModule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setAccessModule(null)}>
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-semibold">Access code required</h2>
                                <p className="mt-1 text-sm text-muted-foreground">{accessModule.title}</p>
                            </div>
                            <button type="button" onClick={() => setAccessModule(null)} aria-label="Close access dialog"><X className="size-5" /></button>
                        </div>

                        {accessModule.access_status === 'not_requested' && (
                            <>
                                <p className="text-sm text-muted-foreground">Request access from the uploader. Wait for them to approve your request and send you the six-character code.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAccessModule({ ...accessModule, access_status: 'pending' });
                                        router.post(`/modules/${accessModule.id}/access-request`, {});
                                    }}
                                    className="mt-5 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                >
                                    Request access code
                                </button>
                            </>
                        )}

                        {accessModule.access_status === 'pending' && (
                            <>
                                <div className="rounded-md border border-amber-300/70 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-200">Your request is pending. Please wait for the uploader to approve it. The access code will appear in your notifications.</div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('Cancel this access request?')) {
                                            router.delete(`/modules/${accessModule.id}/access-request`, { onSuccess: () => setAccessModule(null) });
                                        }
                                    }}
                                    className="mt-4 w-full rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/30"
                                >
                                    Cancel request
                                </button>
                            </>
                        )}

                        {accessModule.access_status === 'approved' && (
                            <>
                                <p className="text-sm text-muted-foreground">The uploader approved your request. Enter the six-character code they gave you.</p>
                                <div className="mt-4 flex gap-2">
                                    <input value={accessCode} onChange={(event) => setAccessCode(event.target.value.toUpperCase().slice(0, 6))} placeholder="ABC123" maxLength={6} className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-center font-mono tracking-[0.3em]" />
                                    <button type="button" disabled={accessCode.length !== 6} onClick={submitAccessCode} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">Unlock</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {requestsModule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setRequestsModule(null)}>
                    <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-semibold">Access requests</h2>
                                <p className="mt-1 text-sm text-muted-foreground">{requestsModule.title}</p>
                            </div>
                            <button type="button" onClick={() => setRequestsModule(null)} aria-label="Close access requests"><X className="size-5" /></button>
                        </div>
                        <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto">
                            {(requestsModule.access_requests ?? []).map((accessRequest) => (
                                <div key={accessRequest.id} className="rounded-lg border border-border p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold">{accessRequest.student_name}</div>
                                            <div className="text-xs text-muted-foreground">{accessRequest.status === 'approved' ? 'Approved' : 'Waiting for approval'}</div>
                                        </div>
                                        {accessRequest.status === 'approved' && accessRequest.access_code && (
                                            <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-sm font-semibold tracking-widest text-emerald-700 dark:text-emerald-300">{accessRequest.access_code}</span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {accessRequest.status === 'pending' ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm(`Approve ${accessRequest.student_name}'s request and send the access code in their notifications?`)) {
                                                        router.patch(`/modules/${requestsModule.id}/access-requests/${accessRequest.id}/approve`, {}, { onSuccess: () => setRequestsModule(null) });
                                                    }
                                                }}
                                                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                                            >
                                                Approve and send code
                                            </button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Code sent through notifications</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`Deny access for ${accessRequest.student_name}?`)) {
                                                    router.delete(`/modules/${requestsModule.id}/access-requests/${accessRequest.id}`);
                                                }
                                            }}
                                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/30"
                                        >
                                            Deny request
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {previewModule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreviewModule(null)}>
                    <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div>
                                <h2 className="font-semibold">{previewModule.title}</h2>
                                <p className="text-xs text-muted-foreground">{previewModule.subject} · {previewModule.file_type}</p>
                            </div>
                            <button type="button" onClick={() => setPreviewModule(null)} aria-label="Close preview"><X className="size-5" /></button>
                        </div>
                        <div className="min-h-[400px] flex-1 overflow-y-auto bg-muted/30 p-4">
                            {isDirectPreviewable(previewModule) ? (
                                <iframe
                                    src={`/modules/${previewModule.id}/preview`}
                                    title={`Preview of ${previewModule.title}`}
                                    className="h-[65vh] w-full rounded-md border border-border bg-white"
                                />
                            ) : isOfficePreviewable(previewModule) ? (
                                <ModuleOfficePreview
                                    url={`/modules/${previewModule.id}/preview`}
                                    extension={getFileExtension(previewModule)}
                                />
                            ) : (
                                <div className="flex h-[30vh] flex-col items-center justify-center gap-2 rounded-md border border-border bg-background text-center">
                                    <FileText className="size-10 text-muted-foreground" />
                                    <p className="font-medium">In-app preview is not available for this file type.</p>
                                    <p className="text-sm text-muted-foreground">Use Download to open this file in a compatible application.</p>
                                </div>
                            )}

                            <section className="mt-4 rounded-lg border border-border bg-background p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <MessageCircle className="size-4" />
                                    <h3 className="font-semibold">Student feedback</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {(previewModule.feedbacks ?? []).length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No feedback yet.</p>
                                    ) : (previewModule.feedbacks ?? []).map((feedback) => (
                                        <div key={feedback.id} className="rounded-md border border-border p-3 text-sm">
                                            <div className="font-medium">{feedback.user_name}</div>
                                            <p className="mt-1 text-muted-foreground">{feedback.comment}</p>
                                            {feedback.reply && (
                                                <div className="mt-2 rounded-md bg-muted p-2 text-xs">
                                                    <span className="font-semibold">{feedback.reply_by_name ?? 'Uploader'} replied:</span>{' '}
                                                    {feedback.reply}
                                                </div>
                                            )}
                                            {canManageModules && !feedback.reply && (
                                                <div className="mt-2 flex gap-2">
                                                    <input
                                                        value={replyTexts[feedback.id] ?? ''}
                                                        onChange={(event) => setReplyTexts({ ...replyTexts, [feedback.id]: event.target.value })}
                                                        placeholder="Reply to this feedback"
                                                        className="min-w-0 flex-1 rounded-md border border-input px-2 py-1 text-xs"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => router.post(`/modules/${previewModule.id}/feedback/${feedback.id}/reply`, { reply: replyTexts[feedback.id] ?? '' })}
                                                        className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <textarea
                                        value={feedbackText}
                                        onChange={(event) => setFeedbackText(event.target.value)}
                                        placeholder="Share feedback about this module"
                                        rows={2}
                                        className="min-w-0 flex-1 resize-none rounded-md border border-input px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        disabled={!feedbackText.trim()}
                                        onClick={() => {
                                            router.post(`/modules/${previewModule.id}/feedback`, { comment: feedbackText }, { onSuccess: () => setFeedbackText('') });
                                        }}
                                        className="self-end rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </section>
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                            <button type="button" onClick={() => setPreviewModule(null)} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Close</button>
                            <a href={`/modules/${previewModule.id}/download`} download className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Download className="size-4" />Download</a>
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
