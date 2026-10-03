import { Head, router, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Download, FileText, FolderOpen, Trash2 } from 'lucide-react';

type ModuleType = {
    id: number;
    title: string;
    subject: string;
    file_type: string;
    file_size: number;
    pivot: { updated_at: string };
    uploader: { name: string };
};

export default function MyDownloads() {
    const { modules } = usePage().props as any;
    const list: ModuleType[] = modules ?? [];

    function removeFromHistory(id: number, title: string) {
        if (!confirm(`Remove "${title}" from your download history?`)) return;
        router.delete(`/downloads/${id}`, { preserveScroll: true });
    }

    return (
        <>
            <Head title="My Downloads" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">My Downloads</h1>
                    <p className="text-sm text-muted-foreground">Modules you've downloaded, most recent first.</p>
                </div>

                {list.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
                        <FolderOpen className="size-8 text-muted-foreground" />
                        <div className="text-sm font-medium">No downloads yet</div>
                        <div className="max-w-xs text-xs text-muted-foreground">
                            Modules you download from the dashboard will show up here.
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                        {list.map((m) => (
                            <div key={m.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                                        {m.subject}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                                            <FileText className="size-3.5" />
                                            {m.file_type}
                                        </span>
                                        <button
                                            onClick={() => removeFromHistory(m.id, m.title)}
                                            className="text-muted-foreground hover:text-destructive"
                                            aria-label="Remove from history"
                                            title="Remove from history"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold leading-snug">{m.title}</h3>
                                <div className="text-xs text-muted-foreground">
                                    Downloaded {new Date(m.pivot.updated_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center justify-between border-t border-border pt-2">
                                    <span className="text-xs text-muted-foreground">
                                        {(m.file_size / 1024 / 1024).toFixed(1)} MB
                                    </span>
                                    <a
                                        href={`/modules/${m.id}/download`}
                                        download
                                        className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                                    >
                                        <Download className="size-3.5" />
                                        Download again
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

MyDownloads.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Downloads', href: '/downloads' },
    ],
};