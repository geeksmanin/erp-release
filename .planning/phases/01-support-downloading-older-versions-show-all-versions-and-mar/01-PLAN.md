---
phase: 01
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/App.tsx
  - src/index.css
autonomous: true
must_haves:
  artifacts:
    - path: src/App.tsx
      min_lines: 50
      contains: 'https://api.github.com/repos/geeksmanin/erp-release/releases'
---

# Plan 01-01: Support Downloading Older Versions & Mark Latest as Stable

This plan modifies the landing page to fetch all GitHub releases instead of just the latest release, allows users to select or list older versions, displays download assets for each selected version, and tags the latest version explicitly as "stable".

## Tasks

<task>
<name>Update release data-fetching and version selector UI in App.tsx</name>
<files>
<file>src/App.tsx</file>
</files>
<action>
Modify `src/App.tsx` to:
- Fetch all releases from `https://api.github.com/repos/${repoOwner}/${repoName}/releases` instead of `/releases/latest`.
- Update state to store array of releases `ReleaseData[]`.
- Track currently selected release using a new state variable (defaulting to the first/latest release).
- Add a sidebar or selector dropdown/list of other available versions to let the user switch the active download release cards.
- Explicitly mark the first (latest) release tag with a "Stable" badge or label in the selection list.
</action>
<verify>
Make sure the app builds and that the fetch is pointed at the list of all releases:
`npx tsc --noEmit`
</verify>
<done>
`src/App.tsx` contains `fetch` call pointing to `https://api.github.com/repos/geeksmanin/erp-release/releases`.
</done>
</task>

<task>
<name>Add styling for version list and selection in index.css</name>
<files>
<file>src/index.css</file>
</files>
<action>
Add custom premium styling in `src/index.css` for the version selector. Use harmonized color scheme matching the existing palette (glow effects, grid card adjustments, or layout changes to accommodate the version history).
</action>
<verify>
Check if `src/index.css` contains custom classes.
</verify>
<done>
`src/index.css` contains selector-related CSS.
</done>
</task>

---

## Verification Plan

### Automated Tests
- Run TypeScript validation: `npx tsc --noEmit`
- Run production build check: `npm run build`

### Manual Verification
- Verify browser displays a list of versions.
- Verify latest version is tagged as "Stable".
- Verify switching to older versions updates download links and file sizes accordingly.
