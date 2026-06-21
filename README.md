# 📝 LaTeX Resume Editor

A modern, browser-based LaTeX resume editor with live preview and PDF export functionality. Create professional resumes using LaTeX syntax with instant visual feedback.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🎨 **Live Preview**: See your resume render in real-time as you type
- 📄 **PDF Export**: Download your resume as a high-quality PDF with one click
- 🎯 **LaTeX Syntax**: Full support for common LaTeX resume commands
- 💾 **Auto-Save**: Automatically saves your work to browser localStorage
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎭 **Multiple Templates**: Pre-built professional and simple resume templates
- 🔍 **Syntax Highlighting**: CodeMirror editor with LaTeX syntax support
- ⚡ **Fast & Lightweight**: No server required, runs entirely in your browser

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or server setup required!

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/latex-resume-editor.git
cd latex-resume-editor
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

That's it! The editor will load with a sample template ready to customize.

### Alternative: Use a Local Server

For the best experience, you can serve the files using a local HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## 📖 Usage

### Basic Workflow

1. **Edit LaTeX Code**: Type or paste your LaTeX resume code in the left editor pane
2. **Preview**: Watch the live preview update automatically on the right
3. **Download**: Click "Download PDF" to export your resume as a PDF file

### LaTeX Commands Supported

The editor supports common LaTeX resume commands:

#### Sections
```latex
\section{Section Title}       % Main section (e.g., Education, Experience)
\subsection{Subsection Title} % Job title, degree, etc.
```

#### Text Formatting
```latex
\textbf{bold text}           % Bold
\textit{italic text}         % Italic
\underline{underlined text}  % Underline
```

#### Contact Information
```latex
\contactinfo{
    Email: your.email@example.com \\
    Phone: +1 (555) 123-4567 \\
    LinkedIn: linkedin.com/in/yourprofile
}
```

#### Lists
```latex
\begin{itemize}
    \item First bullet point
    \item Second bullet point
\end{itemize}
```

#### Math Expressions
```latex
$x^2 + y^2 = z^2$           % Inline math
$$E = mc^2$$                 % Display math
```

### Templates

The editor includes two built-in templates:

- **Professional**: Comprehensive template with multiple sections
- **Simple**: Clean, minimalist template for quick resumes

Click "Load Template" to switch between templates.

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Download PDF
- `Ctrl + Space`: Autocomplete (in editor)

## 🏗️ Project Structure

```
latex-resume-editor/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Application styles
├── js/
│   ├── app.js            # Main application logic
│   ├── latex-renderer.js # LaTeX to HTML parser
│   └── templates.js      # Resume templates
├── README.md             # This file
└── LICENSE               # MIT License
```

## 🛠️ Technical Details

### Technologies Used

- **CodeMirror**: Code editor with syntax highlighting
- **KaTeX**: Fast math rendering library
- **html2pdf.js**: Client-side PDF generation
- **Vanilla JavaScript**: No heavy frameworks needed

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

### Storage

The editor uses browser `localStorage` to automatically save your work. Your resume data is stored locally and never sent to any server.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Ideas

- [ ] More resume templates (academic, creative, etc.)
- [ ] Dark mode support
- [ ] Export to multiple formats (HTML, Markdown, DOCX)
- [ ] Cloud sync with GitHub Gist
- [ ] Collaborative editing
- [ ] Resume builder with drag-and-drop sections
- [ ] Import existing resume (PDF/DOCX)
- [ ] Template marketplace

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- CodeMirror for the excellent code editor
- KaTeX for fast math rendering
- html2pdf.js for PDF generation
- The open-source community

## 📧 Contact

Project Link: [https://github.com/yourusername/latex-resume-editor](https://github.com/yourusername/latex-resume-editor)

## 🐛 Known Issues

- PDF generation may take a few seconds for complex resumes
- Some advanced LaTeX commands are not supported (this is a simplified parser)
- Very long resumes may require scrolling in preview pane

## 🔮 Future Plans

- Server-side LaTeX compilation option for full LaTeX support
- User accounts and cloud storage
- Resume analytics and ATS optimization tips
- Integration with job boards
- Mobile app version

---

**Made with ❤️ for the developer community**

Star ⭐ this repository if you find it useful!