# Browser-based Office preview

The dashboard now previews modern Office files in the browser:

- `.docx` through `docx-preview`
- `.pptx` through `pptx-preview`
- `.xls` and `.xlsx` through SheetJS (`xlsx`)
- PDF, images, and TXT through the existing inline browser preview

From the project directory, install the frontend packages:

```powershell
npm install docx-preview pptx-preview xlsx
```

Then clear Laravel's cache and restart the development servers:

```powershell
php artisan optimize:clear
composer run dev
```

The Preview button fetches the protected `/modules/{module}/preview` endpoint. It does not use the download endpoint and does not record a download. The Download button remains the only action that downloads the original file.

Legacy `.doc` and `.ppt` files are not modern Open XML files and cannot be reliably parsed by these browser renderers. Uploaders should save them as `.docx` or `.pptx` before uploading when students need an in-browser preview.
