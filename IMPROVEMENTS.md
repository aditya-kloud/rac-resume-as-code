Improvements and Open‑Source Readiness — RaC (Resume as Code)
============================================================

Purpose
-------
This document lists recommended improvements, implementation notes, and a prioritized checklist to prepare the project (especially the LaTeX renderer) for open-sourcing. It focuses on robustness, correctness, security, testing, and contributor onboarding.

High-level goals
----------------
- Make the LaTeX -> HTML preview robust and predictable for common resume templates.
- Avoid exposing unsafe HTML or enabling XSS from user input.
- Provide test fixtures, examples and documentation so contributors can reproduce and extend behavior.
- Ship a minimal set of CI checks and contribution docs to accept PRs confidently.

Current status (summary)
------------------------
- Full-document detection (\\documentclass ... \\begin{document} ... \\end{document>) is implemented.
- Basic parsing for sections, center environment, itemize/enumerate, most inline formatting (\textbf, \textit, \href, \url), \\ line breaks, vspace and hfill.
- KaTeX is used (if available) to render math.
- Many edge-cases still handled by ad-hoc regex replacements; nested constructs and more environments need stronger parsing.

Priority roadmap (what to tackle first)
--------------------------------------
Phase A — Core correctness & safety (high priority)
- Replace fragile regex-only environment extraction with a small stack-based environment parser to correctly extract nested \begin{...}/\end{...}.
- Implement recursive / multi-pass inline parsing to reliably handle nested constructs such as \textbf{Hello \textit{World}}.
- Improve handling of optional arguments:
  - \section[short]{long} — display the long form
  - \\[4pt] — treat as plain line break without leaving "[4pt]" behind
  - \begin{itemize}[leftmargin=*, noitemsep] — strip options and parse items
- Tabular support: parse simple tabular environments to HTML <table> (handle & and \\).
- Includegraphics support: map \includegraphics[opts]{path} → <img> with safe fallback and width approximation.
- Sanitize HTML output and escape user text to prevent XSS; allow only a small set of safe tags/attributes produced by the renderer.
- Better math delimiting (avoid greedy $...$ capture, respect escapes).

Phase B — Usability & fidelity (medium priority)
- Simple macro support: parse basic \newcommand definitions in Preamble and substitute.
- Add support for description lists and minipage environments common in resume templates.
- Improve whitespace/paragraph detection (single newline vs blank line handling).
- Improve performance of large documents: avoid many full-string regex passes; optimize hot paths.

Phase C — OSS readiness (lower priority but important)
- Add tests/fixtures: sample input LaTeX snippets and expected HTML output (snapshot tests).
- Add example templates and an examples/ directory with sample resumes and screenshots.
- Documentation: expand README with usage, limitations, examples, and known unsupported macros.
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, and simple PR template.
- CI: GitHub Actions workflow to run lint and tests on PRs.
- Release notes: CHANGELOG.md and a cut of v0.1.0 once stable.

Detailed items and implementation notes
---------------------------------------
1) Environment parser (stack-based)
   - Problem: nested environments or repeated same envs break regex matches.
   - Implementation note: write a tiny parser that scans the document, detects \begin{env} and \end{env}, tracks nesting counts and extracts each environment body reliably. Use this for itemize, enumerate, tabular, center, etc.
   - Tests: nested itemize, itemize inside minipage, multiple itemize blocks.

2) Inline parser improvements
   - Use iterative (or recursive) parsing rather than single-pass regex removal for formatting macros.
   - Avoid removing commands globally (e.g., stray \command removal at end of parseInline can strip intended content if not careful).
   - Apply escaping to any plain text before injecting into innerHTML.

3) Tabular -> HTML table
   - Parse tabular alignment spec (l/c/r) and map to text-align.
   - Split rows on unescaped \\\\ (handle optional bracketed spacing) and cells on &.
   - Render basic borders/styling consistent with preview.

4) Images
   - Allow \includegraphics[width=...]{path} mapping to <img>. For local files, show a filename placeholder if browser cannot load it.
   - Convert units (cm/mm) to px for preview only.

5) Optional args and bracketed tokens
   - Ensure constructs like \\[4pt] and \vspace[...]/\vspace{...} do not leave literal brackets.
   - Handle \section[short]{long} properly.

6) Macro support (limited)
   - Parse simple \newcommand{\foo}{...} and replace occurrences of \foo in the body. Document limitations (no param macros first).

7) Math delimiting
   - Implement stateful scanning for $...$ and $$...$$ that handles escaped \$ and non-greedy matching across the document.

8) Security — HTML sanitization
   - Recommended: escape all plain text via escapeHtml before allowing formatting replacements that intentionally insert tags.
   - After final HTML is produced, run it through a sanitizer whitelist (allowed tags: a, strong, em, u, br, ul, ol, li, table, tr, td, th, img; attributes: href, target, src, alt, style limited).
   - For initial release, prefer escaping and creating tags programmatically (not via raw string concatenation) where possible.

9) Tests & examples
   - Create tests/fixtures/*.tex and expected HTML snapshots in tests/expected/*.html
   - Add a small test runner script (node-based) that runs parser.parseToHTML on fixtures and diffs output.

10) Documentation
    - Explain renderer limitations, list supported LaTeX commands/environments and known unsupported ones.
    - Add contribution guidelines and coding standards for the parser.

Suggested files to add
----------------------
- IMPROVEMENTS.md (this file) — DONE
- docs/DEVELOPMENT.md — implementation notes and architecture decisions
- examples/ — sample LaTeX input files and screenshots
- tests/fixtures/ and tests/expected/ + a simple test script (node)
- .github/workflows/ci.yml — run npm test and lint
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, PULL_REQUEST_TEMPLATE.md

Open‑source release checklist (ready-to-use)
--------------------------------------------
- [x] Create improvements document listing priorities and plan (IMPROVEMENTS.md)
- [ ] Harden environment parsing (stack-based begin/end extractor)
- [ ] Robust nested inline parsing (recursive/multi-pass)
- [ ] Tabular environment parsing
- [ ] Includegraphics support with safe fallbacks
- [ ] Optional-argument handling (\section[short]{}, \\[4pt], itemize options)
- [ ] Add HTML escaping + sanitizer (prevent XSS)
- [ ] Add tests/fixtures covering header, lists, tabular, images, macros, and math
- [ ] Add examples/ with sample resumes and screenshots
- [ ] Add CONTRIBUTING.md and CODE_OF_CONDUCT.md
- [ ] Add CI (tests + lint) and a badge in README
- [ ] Improve README with features, limitations, and contribution steps
- [ ] Tag v0.1.0 and create release notes / changelog

How I can proceed (pick one)
----------------------------
- I can implement Phase A changes now (environment parser, nested inline parsing, tabular, includegraphics, optional-arg handling and sanitizer). This will require modifying js/latex-renderer.js and adding tests/fixtures.
- Or I can prepare a PR-ready plan and patches for each change so you can review them incrementally.

Notes and constraints
---------------------
- The browser preview is not a LaTeX engine—complex package-driven layout (TikZ, advanced packages) will not perfectly match a PDF compiled by LaTeX. Aim for structural fidelity (headings, lists, tables, images, basic formatting) rather than pixel-perfect layout.
- When implementing file-based images, loading local files in some browsers may be blocked unless served with a web server or embedded as base64.

If you want me to start implementing Phase A now, I will:
- Create a small test fixture covering your sample architectural resume and ensure it renders properly.
- Add the stack-based environment extractor and integrate tabular/includegraphics handling.
- Add a basic sanitizer and a test runner script.
Please confirm "Implement Phase A now" if you want me to begin making changes and tests.