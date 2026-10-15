import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

const years = ['All Students', '1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function ModuleCreate() {
    return (
        <>
            <Head title="Upload Module" />
            <div className="mx-auto w-full max-w-xl p-4">
                <h1 className="mb-1 text-xl font-bold">Upload a Module</h1>
                <p className="mb-6 text-sm text-muted-foreground">
                    Add a new learning resource for students to browse and download.
                </p>

                <div className="mb-6 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                    <div className="font-semibold">Supported files</div>
                    <p className="mt-1 text-muted-foreground">PDF, DOCX, PPTX, XLS/XLSX, images, and TXT files can be previewed in the browser. Legacy DOC and PPT files can still be downloaded but need conversion to a modern format for in-browser preview.</p>
                </div>

                <Form action="/modules" method="post" encType="multipart/form-data" className="flex flex-col gap-5">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" placeholder="Data Structures — Module 4: Trees" required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" name="subject" placeholder="Computer Science" required />
                                <InputError message={errors.subject} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="year_level">Year Level</Label>
                                <select
                                    id="year_level"
                                    name="year_level"
                                    required
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Select audience</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <InputError message={errors.year_level} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp" required />
                                <InputError message={errors.file} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Upload
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

ModuleCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Upload Module', href: '/modules/create' },
    ],
};
