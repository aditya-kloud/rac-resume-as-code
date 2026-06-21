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

\\usepackage[left=1.6cm,right=1.6cm,top=1.5cm,bottom=1.5cm]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}

\\definecolor{heading}{RGB}{0,0,0}
\\titleformat{\\section}{\\large\\bfseries\\color{heading}}{}{0em}{}[\\titlerule]

\\setlist[itemize]{noitemsep, topsep=3pt, leftmargin=*}
\\setlength{\\parindent}{0pt}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{YOUR NAME}}\\\\
    \\vspace{4pt}
    \\textbf{Senior DevOps / Platform Engineer | Cloud \\& SRE Specialist}\\\\
    \\vspace{6pt}
    \\href{mailto:your@email.com}{your@email.com} \\;|\\;
    +91-XXXXXXXXXX \\;|\\;
    \\href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile} \\;|\\;
    \\href{https://github.com/yourgithub}{github.com/yourgithub}
\\end{center}

\\vspace{6pt}

\\section*{Professional Summary}
Senior DevOps Engineer with \\textbf{7+ years of experience} building highly available, secure, and scalable cloud platforms. Strong background in \\textbf{AWS, Kubernetes, Infrastructure as Code, CI/CD, and SRE}. Proven ability to lead platform initiatives, optimize multi-crore cloud spend, and enable engineering teams to ship faster and safer at scale.

\\section*{Technical Expertise}
\\textbf{Cloud Platforms:} AWS (EKS, EC2, VPC, IAM, RDS, DynamoDB, S3, CloudFront, Route53) \\\\
\\textbf{Containers \\& Orchestration:} Docker, Kubernetes, Helm, Kustomize, EKS Blueprints \\\\
\\textbf{Infrastructure as Code:} Terraform, Terragrunt, CloudFormation \\\\
\\textbf{CI/CD \\& GitOps:} GitHub Actions, Jenkins, GitLab CI, ArgoCD, FluxCD \\\\
\\textbf{Observability \\& SRE:} Prometheus, Grafana, ELK, Loki, Datadog, Alertmanager \\\\
\\textbf{Security:} IAM, OIDC, Secrets Manager, Vault, Trivy, Snyk, CIS Benchmarks \\\\
\\textbf{Languages:} Python, Bash, Go (working knowledge)

\\section*{Professional Experience}

\\textbf{Senior DevOps Engineer / Platform Engineer} \\hfill \\textit{2021 -- Present}\\\\
\\textbf{Company Name – Product-Based Organization}
\\begin{itemize}
  \\item Architected and operated a \\textbf{production-grade Kubernetes platform (EKS)} serving \\textbf{50M+ requests/month} across multiple regions.
  \\item Led migration from monolithic EC2 workloads to \\textbf{microservices-based container architecture}, improving release frequency by \\textbf{4x}.
  \\item Designed GitOps-driven CI/CD using \\textbf{GitHub Actions + ArgoCD}, enabling fully automated, auditable deployments.
  \\item Implemented autoscaling (HPA, Cluster Autoscaler, Karpenter), reducing peak infra cost by \\textbf{35\\%}.
  \\item Established SRE best practices: SLIs, SLOs, error budgets, and on-call runbooks.
\\end{itemize}

\\textbf{DevOps Engineer} \\hfill \\textit{2018 -- 2021}\\\\
\\textbf{Company Name – SaaS / Services}
\\begin{itemize}
  \\item Automated provisioning of AWS infrastructure using Terraform and CloudFormation.
  \\item Built CI/CD pipelines for Java and Node.js services, reducing manual release effort by \\textbf{70\\%}.
  \\item Implemented centralized logging and monitoring using ELK and Prometheus.
\\end{itemize}

\\section*{Education}
\\textbf{B.Tech in Computer Science}\\\\
University Name \\hfill \\textit{Year}

\\section*{Certifications}
\\begin{itemize}
  \\item AWS Certified Solutions Architect – Professional
  \\item Certified Kubernetes Administrator (CKA)
\\end{itemize}

\\end{document}`
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TEMPLATES;
}