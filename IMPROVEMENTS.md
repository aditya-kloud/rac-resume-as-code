# IMPROVEMENTS — RaC (Resume as Code)

A running log of bugs fixed and features added since the initial release.

---

## v1.2.2 — Tablet & PDF Layout Fixes

### Bug Fixes

**Preview pane controls overflowing on tablet**
- On tablet viewports (769px–1100px) the panes stay side-by-side, but each pane was too narrow to fit the compile-status chip and four buttons (Presets, Style, Reset, Recompile) on one row — the Recompile button was clipped.
- Fixed with a dedicated mid-range breakpoint: compile status takes its own full-width row, and all four buttons share the row below with `flex: 1`.

**Download PDF button wrapping to second row on mobile**
- On small screens, the 3-item header (← Home, title, Download PDF) didn't fit on one row, pushing the button below the title.
- Fixed by reordering with flexbox: ← Home and Download PDF share the top row, title drops to a full-width second row.

**White side margins in PDF on dark colour schemes**
- Dark-background resumes (Slate, Dark, Violet) showed white strips on the left and right in exported PDFs because Chrome does not reliably paint `background-color` on the body's padding area during print.
- Fixed by removing padding from `body` in the print stylesheet and moving it to `#pdf-wrap` (a regular `div`). Also added `print-color-adjust: exact !important` explicitly to `html` and `body`.

---

## v1.2.1 — PDF, Presets & Editor Controls

### Bug Fixes

**PDF printing editor UI on mobile**
- `iframe.contentWindow.print()` falls back to the parent window's print on some browsers, causing the editor UI (pane header, buttons) to appear in the exported PDF.
- Fixed by switching to a Blob URL approach — prints HTML is built as a `Blob`, opened via `window.open(blobUrl)`, and auto-triggers `window.print()` on load. Only the resume content is in the blob, so the PDF is clean.
- If `window.open` is blocked, falls back to `window.location.href` (same-tab navigation).

**Presets dropdown not opening on mobile**
- `position: fixed` + JS-calculated coordinates broke click event propagation on some mobile browsers.
- Reverted to `position: absolute` with left-anchored positioning on mobile so the dropdown stays within the viewport without breaking interactions.

**Reset not resetting the editor**
- The Reset button only reset colours and font, leaving the editor content unchanged.
- Fixed to also restore the default template and clear `latexContent` from localStorage (with confirmation prompt).

**Classic preset not applied on first load**
- On a brand-new visit (no `rac_resume_bg` in `localStorage`), the resume preview rendered with no background colour, appearing transparent/dark.
- Fixed by explicitly seeding `localStorage` with the Classic preset (`#ffffff` / `#4a90e2`) in `applyTheme()` when no stored value is found, so the first load always looks correct.

### New Features

**Clear button in editor pane**
- Added a Clear button to the LaTeX editor header.
- Clears editor content, localStorage, and the preview panel (with confirmation). Separate from Reset — clears content only, does not touch colours or font.

---

## v1.2.0 — Landing Page, Mobile Fixes & GitHub Actions

### Bug Fixes

**PDF download blocked on mobile**
- `window.open()` is treated as a popup by mobile browsers (iOS Safari, Android Chrome) and was silently blocked.
- Fixed by replacing `window.open` + `document.write` with a hidden `<iframe>` injected into the current page. Mobile browsers allow iframe printing without popup permissions.

**Landing page nav overflow on mobile**
- Nav links (How it works, Commands, Features) were overlapping the logo on small screens.
- Fixed by hiding text nav links on mobile — only the logo and "Launch Editor →" CTA remain visible.

**Prompt section and command grid not collapsing on mobile**
- The two-column `prompt-layout` and `cmd-grid` were not stacking on small screens, causing horizontal overflow.
- Fixed with responsive breakpoints at 860px (single-column stack) and 600px (smaller font sizes).

**Editor pane header wrapping awkwardly on mobile**
- Compile status chip and Presets/Style/Reset/Recompile buttons were splitting across two misaligned rows.
- Fixed to stack cleanly: compile status spans full width on the first row, buttons share the second row equally with `flex: 1`.

**Editor panes not scrollable on mobile**
- Stacked panes had no defined height, causing overflow issues.
- Fixed with `height: 50vh` per pane and `overflow-y: auto` on the main content area.

### New Features

**Landing page (`index.html`)**
- Full marketing landing page with hero, How it Works, Prompt + Commands, Features, and CTA sections.
- Aurora gradient animation (fixed, full-page) + subtle dot-grid background — consistent across landing page and editor.
- 3D floating resume card mockup in the hero with CSS `rotateX/Y` animation and mouse parallax.
- Feature cards with per-card hover accent colours and 3D tilt on mouse move.
- 8-colour preset swatches displayed as split circles in a 3-3-2 grid.
- Prompt section with one-click copy button for the AI prompt.
- Supported LaTeX commands reference table.
- Smooth-scroll anchor links, section fade-in via IntersectionObserver, feature card stagger animation.

**Editor aligned to landing page aesthetic**
- Editor (`app.html`) background now matches the landing page — same aurora glow and dot-grid, fixed behind semi-transparent frosted-glass panes (`backdrop-filter: blur`).
- Header, pane headers, and footer are consistently dark across both pages.
- Removed dark mode toggle — UI is always dark, matching the landing page.

**"← Home" link in editor**
- Header of `app.html` now links back to the landing page.

**Footer credit**
- "Made by Aditya Kumar" added to both page footers.

**GitHub Actions release workflow**
- Auto-creates a GitHub Release on every PR merge to `main`.
- Bump type (`major`, `minor`, `hotfix`) is read from the PR label.
- Automatically updates the version badge in `README.md` and commits it back with `[skip ci]`.

---

## v1.1.0 — Rendering & PDF Fixes

### Bug Fixes

**PDF hyperlinks — `file://` paths**
- Links in the exported PDF were rendered as `file://` relative paths instead of `https://` URLs.
- Fixed by pre-processing `href` values in `downloadPDF()` to prepend `https://` when no protocol is present.

**KaTeX consuming resume sections as math**
- Content between two `$` currency figures (e.g. `$500`…`$999`) was being parsed as a math expression by KaTeX, garbling bullet points and headings.
- Fixed in `renderMath()` using `[^$<>]` to stop at HTML tag boundaries and `(?!\d)` negative lookahead to skip currency amounts.

**`\hfill` not right-aligning dates**
- `\hfill` was replaced with non-breaking spaces, which had no layout effect.
- Fixed by converting `\hfill` lines to `display: flex; justify-content: space-between` divs.

**`\textbackslash` not rendering**
- `\textbackslash` was stripped entirely, leaving blank items in Quick Reference sections.
- Fixed to output `&#92;` (HTML backslash entity) before the generic command stripper runs.

**PDF page 2+ missing top margin**
- Second and subsequent pages had no top padding in exported PDFs.
- Fixed with `@page { margin: 0 }` + `body { padding: 18mm 20mm 15mm 20mm }` in the print stylesheet, and `.page-break + * { margin-top: 18mm }` to restore page 2+ top spacing.

**PDF white margin on dark backgrounds**
- Dark-themed resumes showed a white margin strip in the PDF because `@page` margin area ignores `background-color`.
- Fixed by setting `@page { margin: 0 }` and moving spacing to body padding, with `html { background: <color> !important }` so the full bleed is applied.

### New Features

**Page boundary guides in preview**
- Dashed horizontal lines show exactly where each PDF page ends, with a "Page N" label.
- Guides reset from `\newpage` / `\pagebreak` positions.
- Hidden from PDF output via `@media print`.

**Colour presets panel**
- 8 named colour schemes (Classic, Dark, Warm, Forest, Slate, Minimal, Rose, Violet) accessible via a "Presets" dropdown.

**Style panel**
- Font family selector and colour pickers for background and accent colour, persisted to `localStorage`.

**Feature Showcase template**
- Third built-in template demonstrates every supported command: `\hfill`, font sizes, `\vspace`, `\newpage`, `\textbackslash`, bullet lists, and hyperlinks.

---

## Known Remaining Limitations

- No support for `tabular` environments.
- No `\includegraphics` support.
- No `\newcommand` / macro expansion.
- Nested environments (e.g. `itemize` inside `minipage`) may not parse correctly.
- PDF rendering differs between browsers; Chrome produces the most consistent output.
