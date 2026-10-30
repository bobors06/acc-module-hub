import { Head } from '@inertiajs/react';
import { Download, FolderOpen } from 'lucide-react';

type DownloadedModule = {
    id: number;
    title: string;
    subject: string;
    year_level: string;
    file_type: string;
    file_size: number;
    created_at: string;
    uploader?: {
        name: string;
    };
};

type Props = {
    modules: DownloadedModule[];
};

export default function Downloads({ modules }: Props) {
    return (
        <>
            <Head title="My Downloads" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        My Downloads
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Modules you have downloaded.
                    </p>
                </div>

                {modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
                        <FolderOpen className="size-8 text-muted-foreground" />

                        <p className="text-sm font-medium">
                            No downloads yet
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Downloaded modules will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                        {module.subject}
                                    </span>

                                    <span className="text-xs uppercase text-muted-foreground">
                                        {module.file_type}
                                    </span>
                                </div>

                                <h2 className="text-sm font-semibold">
                                    {module.title}
                                </h2>

                                <p className="text-xs text-muted-foreground">
                                    {module.year_level}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Uploaded by{' '}
                                    {module.uploader?.name ?? 'Unknown'}
                                </p>

                                <a
                                    href={`/modules/${module.id}/download`}
                                    download
                                    className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    <Download className="size-3.5" />
                                    Download Again
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Downloads.layout = {
    breadcrumbs: [
        {
            title: 'My Downloads',
            href: '/downloads',
        },
    ],
};