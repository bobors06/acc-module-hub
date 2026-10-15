import { useEffect, useRef, useState } from 'react';

type OfficePreviewProps = {
    url: string;
    extension: string;
};

export default function ModuleOfficePreview({
    url,
    extension,
}: OfficePreviewProps) {
    const docxContainerRef = useRef<HTMLDivElement>(null);
    const pptxContainerRef = useRef<HTMLDivElement>(null);
    const [spreadsheetHtml, setSpreadsheetHtml] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadDocument() {
            setLoading(true);
            setError(null);
            setSpreadsheetHtml('');
            docxContainerRef.current?.replaceChildren();
            pptxContainerRef.current?.replaceChildren();

            try {
                const response = await fetch(url, {
                    credentials: 'same-origin',
                });

                if (!response.ok) {
                    throw new Error(`Preview request failed (${response.status}).`);
                }

                const buffer = await response.arrayBuffer();

                if (cancelled) return;

                if (extension === 'docx') {
                    const { renderAsync } = await import('docx-preview');
                    const container = docxContainerRef.current;

                    if (!container) {
                        throw new Error('The Word preview container is unavailable.');
                    }

                    await renderAsync(buffer, container, undefined, {
                        breakPages: true,
                        renderHeaders: true,
                        renderFooters: true,
                    });
                } else if (extension === 'pptx') {
                    const { init } = await import('pptx-preview');
                    const container = pptxContainerRef.current;

                    if (!container) {
                        throw new Error('The PowerPoint preview container is unavailable.');
                    }

                    const previewer = init(container, {
                        width: 960,
                        height: 540,
                    });

                    await previewer.preview(buffer);
                } else if (extension === 'xls' || extension === 'xlsx') {
                    const XLSX = await import('xlsx');
                    const workbook = XLSX.read(buffer, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

                    if (!firstSheet) {
                        throw new Error('The spreadsheet does not contain a worksheet.');
                    }

                    setSpreadsheetHtml(XLSX.utils.sheet_to_html(firstSheet));
                } else {
                    throw new Error(`Preview is not available for .${extension} files.`);
                }
            } catch (previewError) {
                if (!cancelled) {
                    setError(
                        previewError instanceof Error
                            ? previewError.message
                            : 'The file could not be previewed.',
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadDocument();

        return () => {
            cancelled = true;
            docxContainerRef.current?.replaceChildren();
            pptxContainerRef.current?.replaceChildren();
        };
    }, [extension, url]);

    return (
        <div className="relative min-h-[30vh]">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md border border-border bg-background text-sm text-muted-foreground">
                    Preparing preview…
                </div>
            )}

            {error && !loading && (
                <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-center">
                    <p className="font-medium">Preview could not be loaded</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            )}

            {extension === 'docx' && !error && (
                <div
                    ref={docxContainerRef}
                    className="module-docx-preview max-h-[65vh] overflow-y-auto rounded-md border border-border bg-slate-100 p-4"
                />
            )}

            {extension === 'pptx' && !error && (
                <div
                    ref={pptxContainerRef}
                    className="module-pptx-preview max-h-[65vh] overflow-auto rounded-md border border-border bg-slate-100 p-4"
                />
            )}

            {(extension === 'xls' || extension === 'xlsx') && spreadsheetHtml && !error && (
                <div
                    className="module-spreadsheet-preview max-h-[65vh] overflow-auto rounded-md border border-border bg-background p-4"
                    dangerouslySetInnerHTML={{ __html: spreadsheetHtml }}
                />
            )}
        </div>
    );
}
