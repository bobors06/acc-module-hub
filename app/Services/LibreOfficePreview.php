<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;
use RuntimeException;

class LibreOfficePreview
{
    /**
     * Convert an office document to a temporary PDF.
     *
     * @return array{path: string, directory: string}
     */
    public function convert(string $sourcePath): array
    {
        if (! File::exists($sourcePath)) {
            throw new RuntimeException(
                'The source document does not exist.'
            );
        }

        $binary = $this->findLibreOfficeBinary();

        if (! $binary) {
            throw new RuntimeException(
                'LibreOffice executable was not found.'
            );
        }

        /*
         * Laravel/Symfony Process has a 120-second timeout, but PHP itself
         * may still stop the request at 30 seconds. Extend the PHP limit.
         */
        @set_time_limit(180);
        @ini_set('max_execution_time', '180');

        $directory = storage_path(
            'app/private/module-previews/' . Str::uuid()
        );

        $profileDirectory = $directory .
            DIRECTORY_SEPARATOR . 'profile';

        File::ensureDirectoryExists($directory);
        File::ensureDirectoryExists($profileDirectory);

        $extension = strtolower(
            pathinfo($sourcePath, PATHINFO_EXTENSION)
        );

        $temporaryInput = $directory .
            DIRECTORY_SEPARATOR . 'source.' . $extension;

        File::copy($sourcePath, $temporaryInput);

        $conversion = Process::timeout(150)->run([
            $binary,
            '--headless',
            '--nologo',
            '--nodefault',
            '--nofirststartwizard',
            '--nolockcheck',
            '--norestore',
            '-env:UserInstallation=' .
                $this->fileUri($profileDirectory),
            '--convert-to',
            'pdf',
            '--outdir',
            $directory,
            $temporaryInput,
        ]);

        $pdfPath = $directory .
            DIRECTORY_SEPARATOR . 'source.pdf';

        if (
            $conversion->failed() ||
            ! File::exists($pdfPath)
        ) {
            $error = trim($conversion->errorOutput());
            $output = trim($conversion->output());

            File::deleteDirectory($directory);

            throw new RuntimeException(
                'LibreOffice conversion failed. ' .
                ($error ?: $output ?: 'No conversion output was returned.')
            );
        }

        return [
            'path' => $pdfPath,
            'directory' => $directory,
        ];
    }

    private function findLibreOfficeBinary(): ?string
    {
        $configuredPath = env('LIBREOFFICE_BINARY');

        $paths = array_filter([
            $configuredPath,

            'C:\\Program Files\\LibreOffice\\program\\soffice.exe',

            'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',

            env('LOCALAPPDATA') .
                '\\Programs\\LibreOffice\\program\\soffice.exe',
        ]);

        foreach ($paths as $path) {
            if (File::exists($path)) {
                return $path;
            }
        }

        return null;
    }

    private function fileUri(string $path): string
    {
        $normalized = str_replace('\\', '/', $path);

        return 'file:///' . ltrim($normalized, '/');
    }
}