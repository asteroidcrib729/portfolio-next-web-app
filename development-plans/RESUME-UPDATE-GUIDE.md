# Updating the Published Resume

## How the resume is stored

The resume is a versioned project file, not a Prisma database record. The Editorial Studio currently manages articles and does not provide resume uploads. Replacing the existing PDF at its stable path updates the embedded viewer, direct view, and download after deployment without application-code changes.

- Project file: `public/resume/faraz-hussain-resume.pdf`
- Resume page: `/resume`
- Direct PDF URL: `/resume/faraz-hussain-resume.pdf`
- Download filename: `Faraz-Hussain-Resume.pdf`

## 1. Prepare the branch

Run these commands from the project root:

```powershell
git status --short --branch
git switch pre-production
git pull --ff-only origin pre-production
```

Start with a clean working tree. If unrelated changes are present, preserve them before switching branches; do not discard them to perform the resume update. If the pull reports a conflict or divergent history, resolve it before continuing rather than forcing the update.

## 2. Replace the PDF

1. Export the updated resume as a PDF that opens without a password.
2. Review its content and confirm that any contact details or other personal information are intended to be public.
3. Use File Explorer to copy the new PDF into the project's `public/resume/` directory.
4. Rename it to exactly `faraz-hussain-resume.pdf` and replace the existing file. Check that Windows has not added a second `.pdf` extension.

Keep the directory and filename unchanged. No Prisma migration, environment-variable change, or `siteConfig.ts` update is needed. Do not modify the applied database migrations or framing/security headers for a normal PDF replacement.

If the source document's name or provenance changes, update the resume entry in [ASSET-PROVENANCE.md](ASSET-PROVENANCE.md) as well.

## 3. Check the replacement locally

Start the development server:

```powershell
npm run dev
```

Open `http://localhost:3000/resume` and verify:

- The embedded preview shows the updated document, if the browser supports native PDF viewing.
- **Open PDF** opens the updated PDF in a new tab.
- **Download PDF** downloads the updated document as `Faraz-Hussain-Resume.pdf`.
- The PDF's pages, text, links, and layout are correct.

If the embedded viewer is unsupported, use the direct-PDF fallback or download action. A missing native viewer does not by itself mean that the PDF is broken. Stop the development server with `Ctrl+C` when finished.

## 4. Commit and push to pre-production

Review and stage only the resume replacement:

```powershell
git status --short
git add -- public/resume/faraz-hussain-resume.pdf
git diff --cached --stat
git commit -m "docs: update published resume PDF"
git push origin pre-production
```

If you intentionally updated `ASSET-PROVENANCE.md`, stage that file before committing too. Avoid staging unrelated changes.

## 5. Release through a pull request

1. Open a pull request in [the GitHub repository](https://github.com/asteroidcrib729/portfolio-next-web-app/pulls), using `main` as the base and `pre-production` as the comparison branch.
2. Wait for the pre-production push checks, pull-request checks, and Vercel Preview deployment to pass.
3. Merge the pull request into `main`.
4. Wait for the main-branch CI checks, Vercel Production deployment, and public-release verification to succeed.

The existing Git integration deploys the merged `main` branch. Replacing the local file or pushing only to `pre-production` does not update the public Production site.

## 6. Verify Production

Open [the Production resume page](https://faraz-hussain-portfolio.vercel.app/resume) and repeat the preview, direct-view, and download checks. Confirm that the downloaded document contains the new content, not just the expected filename.

Run the public verification command from the project root:

```powershell
npm run verify:public -- https://faraz-hussain-portfolio.vercel.app/
```

This checks public route availability and PDF response validity. It does not confirm that the document's content is current, so the visual and download checks remain necessary.

The public URLs and download filename stay the same. If the old PDF still appears after the new Production deployment is ready, try a private browser window or clear the browser's cached copy.
