# RaC — Resume as Code

A browser-based LaTeX resume editor with live preview and one-click PDF export. Write your resume in LaTeX, see it render instantly, download a clean PDF — no installation, no server, no account.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## How It Works

1. **Generate LaTeX from AI** — Give a prompt to ChatGPT, Claude, or Gemini and get a ready-to-use LaTeX resume. Use the supported commands listed below for best results.
2. **Paste into Editor** — Copy the generated LaTeX into RaC. The live preview renders it instantly.
3. **Edit & Style** — Tweak content, switch colour presets, change the font, and use page boundary guides to fine-tune layout.
4. **Download PDF** — One click exports a pixel-perfect A4 PDF with full-bleed colours and proper margins.

---

## Features

- **Live preview** — renders as you type; Recompile button for manual refresh
- **PDF export** — full-bleed A4 PDF via the browser print API, correct margins on every page
- **Full-document LaTeX** — supports `\documentclass` + `\begin{document}` resume files
- **Page boundary guides** — dashed lines show exactly where PDF pages end, reset from `\newpage` / `\pagebreak`
- **Right-aligned dates** — `\hfill` pushes content to the right margin
- **Font size commands** — `\LARGE`, `\Large`, `\large` at appropriate sizes
- **8 colour presets** — Classic, Dark, Warm, Forest, Slate, Minimal, Rose, Violet
- **Style panel** — font family picker + custom accent and background colour pickers
- **Auto-save** — work is saved to `localStorage` automatically
- **Syntax highlighting** — CodeMirror editor with LaTeX mode
- **Math rendering** — KaTeX renders `$...$` and `$$...$$` expressions
- **Three built-in templates** — Professional, Simple, and Feature Showcase
- **Landing page** — marketing page with aurora background, 3D card, and step-by-step guide

---

## Supported LaTeX Commands

| Command | Output |
|---|---|
| `\section*{Title}` | Section heading with horizontal rule |
| `\textbf{text}` | **Bold** |
| `\textit{text}` | *Italic* |
| `\underline{text}` | Underlined |
| `\href{url}{label}` | Clickable hyperlink |
| `\hfill` | Right-align following content |
| `\begin{itemize} \item ... \end{itemize}` | Bullet list |
| `\begin{center} ... \end{center}` | Centered block |
| `\vspace{10pt}` | Vertical gap |
| `\newpage` / `\pagebreak` | Page break (dashed guide in preview) |
| `\LARGE`, `\Large`, `\large` | Font sizes |
| `$...$`, `$$...$$` | Inline / display math (KaTeX) |
| `\\` | Line break |
| `\%`, `\_`, `\&`, `\$` | Escaped special characters |
| `\textbackslash` | Literal backslash `\` |

---

## AI Prompt

Copy this prompt into any AI assistant with your own details:

> Write a professional LaTeX resume using `\documentclass[11pt,a4paper]{article}`. Use `\section*{}` for headings, `\textbf{}` for bold, `\textit{}` for italic, `\hfill` for right-aligned dates, `\begin{itemize}` for bullet points, and `\newpage` for page breaks. Include sections for Summary, Experience, Skills, and Education. My details: [paste your info here]

---

## Quick Start

No installation needed:

```bash
# Clone
git clone https://github.com/darksoul03/devops_resumeMaker.git
cd devops_resumeMaker

# Open in browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

Or serve locally for best compatibility:

```bash
python -m http.server 8000
# open http://localhost:8000
```

---

## GitHub Pages

Pure static site — no build step required.

1. Push to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to the `main` branch, root `/`
4. Landing page live at `https://<username>.github.io/<repo>/`
5. Editor at `https://<username>.github.io/<repo>/app.html`

---

## Project Structure

```
devops_resumeMaker/
├── index.html              # Landing page (entry point for GitHub Pages)
├── app.html                # LaTeX editor app
├── css/
│   ├── landing.css         # Landing page styles (aurora, 3D cards, sections)
│   └── styles.css          # Editor app styles (panes, preview, PDF, presets)
├── js/
│   ├── landing.js          # Landing page interactions (tilt, parallax, fade-in)
│   ├── app.js              # Editor logic, PDF export, page guides, presets
│   ├── latex-renderer.js   # LaTeX → HTML parser (LaTeXRenderer class)
│   └── templates.js        # Built-in resume templates
├── README.md
├── IMPROVEMENTS.md         # Changelog
├── .gitignore
└── LICENSE
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **CodeMirror 5** | Editor with LaTeX syntax highlighting |
| **KaTeX** | Math rendering (`$...$`) |
| **Vanilla JS / CSS** | No frameworks, no build step |
| **Browser Print API** | PDF generation via `window.print()` |
| **Google Fonts** | Inter, Garamond, Lato, Merriweather, Roboto |

---

## Known Limitations

- Simplified LaTeX parser — not a full TeX engine. Unsupported: `tabular`, `\includegraphics`, `\newcommand`, most packages.
- PDF output depends on the browser's print renderer. Chrome produces the most consistent results.
- Deeply nested environments may not parse correctly.

---

## License

MIT — see [LICENSE](LICENSE).

Made by [Aditya Kumar](https://github.com/darksoul03).
