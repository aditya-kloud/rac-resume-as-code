// Resume templates for the LaTeX editor

const TEMPLATES = {
    professional: `% Professional Resume Template

\\section{Your Name}
\\textit{Software Engineer | Full Stack Developer}

\\contactinfo{
    Email: your.email@example.com \\\\
    Phone: +1 (555) 123-4567 \\\\
    LinkedIn: linkedin.com/in/yourprofile \\\\
    GitHub: github.com/yourusername
}

\\section{Summary}
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in JavaScript, Python, and cloud technologies. Proven track record of delivering scalable applications and leading development teams.

\\section{Experience}

\\subsection{Senior Software Engineer}
\\textit{Tech Company Inc. | January 2021 - Present}
\\begin{itemize}
    \\item Led development of microservices architecture, improving system scalability by 300\\%
    \\item Mentored team of 5 junior developers, improving code quality and deployment frequency
    \\item Implemented CI/CD pipelines using Jenkins and Docker, reducing deployment time by 50\\%
    \\item Technologies: React, Node.js, AWS, PostgreSQL, Docker, Kubernetes
\\end{itemize}

\\subsection{Software Engineer}
\\textit{StartUp Solutions | June 2018 - December 2020}
\\begin{itemize}
    \\item Developed full-stack web applications using React and Express.js
    \\item Built RESTful APIs serving 100K+ daily requests
    \\item Optimized database queries, reducing response time by 40\\%
    \\item Collaborated with cross-functional teams in Agile environment
\\end{itemize}

\\section{Education}

\\subsection{Bachelor of Science in Computer Science}
\\textit{University Name | 2014 - 2018}
\\begin{itemize}
    \\item GPA: 3.8/4.0
    \\item Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development
\\end{itemize}

\\section{Skills}

\\textbf{Languages:} JavaScript, Python, Java, TypeScript, SQL

\\textbf{Frameworks:} React, Node.js, Express, Django, Spring Boot

\\textbf{Tools \\& Technologies:} Git, Docker, Kubernetes, AWS, CI/CD, MongoDB, PostgreSQL

\\textbf{Soft Skills:} Team Leadership, Agile/Scrum, Problem Solving, Communication

\\section{Projects}

\\subsection{E-Commerce Platform}
Built a full-featured e-commerce platform with payment integration, user authentication, and admin dashboard. Handled 10K+ concurrent users during testing.

\\subsection{Real-Time Chat Application}
Developed a scalable chat application using WebSockets, Redis, and React. Implemented features like group chats, file sharing, and message encryption.

\\section{Certifications}
\\begin{itemize}
    \\item AWS Certified Solutions Architect - Associate
    \\item MongoDB Certified Developer
    \\item Certified Scrum Master (CSM)
\\end{itemize}`,

    simple: `% Simple Resume Template

\\section{John Doe}
\\textit{Web Developer}

\\contactinfo{
    Email: john.doe@email.com \\\\
    Phone: (123) 456-7890 \\\\
    Location: San Francisco, CA
}

\\section{Professional Summary}
Motivated web developer with 3 years of experience building responsive websites and web applications. Passionate about creating user-friendly interfaces and writing clean, maintainable code.

\\section{Work Experience}

\\subsection{Web Developer}
\\textit{ABC Company | 2021 - Present}
\\begin{itemize}
    \\item Developed and maintained company website using HTML, CSS, and JavaScript
    \\item Collaborated with designers to implement responsive designs
    \\item Improved website performance by 30\\%
\\end{itemize}

\\subsection{Junior Developer}
\\textit{XYZ Agency | 2020 - 2021}
\\begin{itemize}
    \\item Built client websites using WordPress and custom themes
    \\item Provided technical support and maintenance
\\end{itemize}

\\section{Education}

\\subsection{Bachelor of Science in Information Technology}
\\textit{State University | 2016 - 2020}

\\section{Skills}
HTML, CSS, JavaScript, React, Git, WordPress, Responsive Design, SEO

\\section{Projects}
\\subsection{Portfolio Website}
Personal portfolio showcasing web development projects with modern design and smooth animations.`,

    devops: `\\documentclass[11pt,a4paper]{article}

% ═══════════════════════════════════════════════════════════════
%  RaC — Resume as Code  |  Feature Showcase Template
%  This file demonstrates every command this tool understands.
%  Replace placeholder text with your own content.
% ═══════════════════════════════════════════════════════════════

\\usepackage[left=1.6cm,right=1.6cm,top=1.5cm,bottom=1.5cm]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\setlist[itemize]{noitemsep, topsep=3pt, leftmargin=*}
\\setlength{\\parindent}{0pt}

\\begin{document}

% ── 1. HEADER — centered name, title, contact links ─────────────
\\begin{center}
    {\\LARGE \\textbf{Your Name}}\\\\
    \\vspace{4pt}
    {\\large Job Title | Specialisation}\\\\
    \\vspace{6pt}
    \\href{mailto:you@email.com}{you@email.com} \\;|\\;
    +00-0000000000 \\;|\\;
    \\href{https://linkedin.com/in/you}{linkedin.com/in/you} \\;|\\;
    \\href{https://github.com/you}{github.com/you}
\\end{center}

\\vspace{6pt}

% ── 2. TEXT FORMATTING ──────────────────────────────────────────
\\section*{Text Formatting}
\\textbf{Bold} \\quad \\textit{Italic} \\quad \\underline{Underline} \\quad
\\href{https://example.com}{Hyperlink} \\quad Normal text

% ── 3. BULLET LIST ─────────────────────────────────────────────
\\section*{Bullet List}
\\begin{itemize}
  \\item Plain item
  \\item Item with \\textbf{bold} and \\textit{italic} inline
  \\item Item with a \\href{https://example.com}{clickable link}
\\end{itemize}

% ── 4. RIGHT-ALIGNED DATES (\\hfill) ────────────────────────────
\\section*{Right-Aligned Dates  (\\textbackslash hfill)}
\\textbf{Job Title} \\hfill \\textit{2022 -- Present}\\\\
Company Name \\hfill \\textit{City, Country}
\\begin{itemize}
  \\item \\textbackslash hfill pushes the date to the right margin automatically.
\\end{itemize}

% ── 5. FONT SIZES ───────────────────────────────────────────────
\\section*{Font Sizes}
{\\LARGE LARGE} \\quad {\\Large Large} \\quad {\\large large} \\quad Normal

% ── 6. VERTICAL SPACING (\\vspace) ──────────────────────────────
\\section*{Vertical Spacing  (\\textbackslash vspace)}
Line one.
\\vspace{10pt}
Line two — 10 pt gap above via \\textbackslash vspace{10pt}.

% ── 7. PAGE BREAK ───────────────────────────────────────────────
% \\newpage (or \\pagebreak) forces everything below onto a new page.
% A dashed "Page Break" bar appears in the preview; it is invisible in the PDF.
% Move this line up or down to control exactly where the page splits.
\\newpage

% ── PAGE 2 ──────────────────────────────────────────────────────
\\section*{Page 2 — After \\textbackslash newpage}
Content here prints on the second page of the PDF.\\\\
Move the \\textbf{\\textbackslash newpage} line anywhere to change the split point.

\\vspace{10pt}

\\section*{Numbered List  (enumerate)}
\\begin{itemize}
  \\item Bullet lists use \\textbf{itemize}
  \\item Numbered lists use \\textbf{enumerate}
  \\item Both support inline \\textit{formatting} and \\href{https://example.com}{links}
\\end{itemize}

\\vspace{6pt}

\\section*{Quick Reference}
\\begin{itemize}
  \\item \\textbf{\\textbackslash textbf} — bold text
  \\item \\textbf{\\textbackslash textit} — italic text
  \\item \\textbf{\\textbackslash underline} — underline text
  \\item \\textbf{\\textbackslash href} — hyperlink (url and label as arguments)
  \\item \\textbf{\\textbackslash hfill} — push following text to right margin
  \\item \\textbf{\\textbackslash vspace} — add vertical gap
  \\item \\textbf{\\textbackslash newpage} — page break (dashed line in preview)
  \\item \\textbf{\\textbackslash section*} — section heading with rule
  \\item \\textbf{\\textbackslash begin itemize} — bullet list
\\end{itemize}

\\end{document}`
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TEMPLATES;
}