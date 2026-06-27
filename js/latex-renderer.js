// LaTeX to HTML renderer for resume preview

class LaTeXRenderer {
    constructor() {
        this.mathDelimiters = [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
        ];
    }

    /**
     * Parse LaTeX resume content to HTML
     */
    parseToHTML(latexContent) {
        try {
            // Remove comments (ignore escaped percent signs like \%)
            // Matches % that is not preceded by a backslash
            let content = latexContent.replace(/(^|[^\\])%.*$/gm, '$1');
            
            // Check if this is a full LaTeX document
            if (content.includes('\\documentclass')) {
                return this.parseFullLatexDocument(content);
            }
            
            // Create resume container for simplified syntax
            let html = '<div class="resume">';
            
            // Parse sections
            html += this.parseSections(content);
            
            html += '</div>';
            
            // Render any math expressions using KaTeX
            return this.renderMath(html);
        } catch (error) {
            console.error('LaTeX parsing error:', error);
            throw new Error('Failed to parse LaTeX content: ' + error.message);
        }
    }

    /**
     * Parse full LaTeX document with documentclass
     */
    parseFullLatexDocument(content) {
        // Extract content between \begin{document} and \end{document}
        const docMatch = content.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (!docMatch) {
            throw new Error('Could not find \\begin{document} and \\end{document}');
        }
        
        let bodyContent = docMatch[1];
        
        // Create resume container
        let html = '<div class="resume">';
        
        // Parse LARGE text with nested braces first (before other parsing)
        // Handle both braced forms like {\LARGE \textbf{...}} and inline forms like \LARGE\textbf{...}
        bodyContent = bodyContent.replace(/\{\\LARGE\s+\\textbf\{([^}]+)\}\}/g, '<span style="font-size: 2rem; font-weight: bold;">$1</span>');
        bodyContent = bodyContent.replace(/\\LARGE\s+\\textbf\{([^}]+)\}/g, '<span style="font-size: 2rem; font-weight: bold;">$1</span>');
        bodyContent = bodyContent.replace(/\{\\LARGE\s+([^}]+)\}/g, '<span style="font-size: 2rem;">$1</span>');
        bodyContent = bodyContent.replace(/\\LARGE\s+([^\\{\n]+)/g, '<span style="font-size: 2rem;">$1</span>');
        bodyContent = bodyContent.replace(/\{\\Large\s+\\textbf\{([^}]+)\}\}/g, '<span style="font-size: 1.5rem; font-weight: bold;">$1</span>');
        bodyContent = bodyContent.replace(/\\Large\s+\\textbf\{([^}]+)\}/g, '<span style="font-size: 1.5rem; font-weight: bold;">$1</span>');
        bodyContent = bodyContent.replace(/\{\\Large\s+([^}]+)\}/g, '<span style="font-size: 1.5rem;">$1</span>');
        bodyContent = bodyContent.replace(/\\Large\s+([^\\{\n]+)/g, '<span style="font-size: 1.5rem;">$1</span>');
        bodyContent = bodyContent.replace(/\{\\large\s+\\textbf\{([^}]+)\}\}/g, '<span style="font-size: 1.2rem; font-weight: bold;">$1</span>');
        bodyContent = bodyContent.replace(/\\large\s+\\textbf\{([^}]+)\}/g, '<span style="font-size: 1.2rem; font-weight: bold;">$1</span>');
        bodyContent = bodyContent.replace(/\{\\large\s+([^}]+)\}/g, '<span style="font-size: 1.2rem;">$1</span>');
        bodyContent = bodyContent.replace(/\\large\s+([^\\{\n]+)/g, '<span style="font-size: 1.2rem;">$1</span>');
        
        // Parse center environment (for header)
        bodyContent = bodyContent.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, (match, centerContent) => {
            return '<div style="text-align: center;">' + this.parseInline(centerContent) + '</div>';
        });
        
        // Parse sections with * (unnumbered)
        // Avoid injecting stray closing divs — output only the heading and an opening container
        bodyContent = bodyContent.replace(/\\section\*\{([^}]+)\}/g, (match, title) => {
            return `<h2>${this.parseInline(title)}</h2><div>`;
        });
        
        // Parse regular sections
        bodyContent = bodyContent.replace(/\\section\{([^}]+)\}/g, (match, title) => {
            return `<h2>${this.parseInline(title)}</h2><div>`;
        });
        
        // Parse vspace BEFORE parsing sections (important!)
        bodyContent = bodyContent.replace(/\\vspace\{[^}]+\}/g, '<div style="margin-top: 0.5rem;"></div>');
        
        // Parse newpage / pagebreak → semantic class handled by CSS
        bodyContent = bodyContent.replace(/\\newpage|\\pagebreak/g, '<div class="page-break"></div>');
        
        // Parse itemize environments - handle \textbf with special chars BEFORE splitting
        // Accept optional arguments to itemize e.g. \begin{itemize}[leftmargin=*, noitemsep]
        bodyContent = bodyContent.replace(/\\begin\{itemize\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
            // First convert special characters in the items content
            let processedItems = items.replace(/\\%/g, '%');
            processedItems = processedItems.replace(/\\&/g, '&');
            processedItems = processedItems.replace(/\\_/g, '_');
            processedItems = processedItems.replace(/\\\$/g, '&#36;');
            
            const itemList = processedItems.split(/\\item\s*/)
                .filter(item => item.trim())
                .map(item => {
                    // Now parse the item with special chars already converted
                    let parsed = item.trim();
                    // Parse formatting commands
                    parsed = parsed.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
                    parsed = parsed.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
                    parsed = parsed.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" target="_blank">$2</a>');
                    parsed = parsed.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
                    parsed = parsed.replace(/\\textbackslash\s*([a-zA-Z*]*)/g, (m, cmd) => '&#92;' + cmd);
                    parsed = parsed.replace(/\\[a-zA-Z]+\s*/g, '');
                    parsed = parsed.replace(/\{([^}]*)\}/g, '$1');
                    return `<li>${parsed}</li>`;
                })
                .join('');
            return `<ul>${itemList}</ul>`;
        });
        
        // Lines containing \hfill → flex row so right-hand content aligns to the margin
        bodyContent = bodyContent.replace(/^([^\n]*?)\\hfill\s*(.*)$/gm, (match, left, right) => {
            left = left.trim();
            right = right.replace(/\\\\$/, '').trim(); // strip trailing LaTeX line-break if present
            if (!right) return left;
            return `<div style="display:flex;justify-content:space-between;align-items:baseline;">${left}<span>${right}</span></div>`;
        });
        // Remaining bare \hfill (inside already-processed environments)
        bodyContent = bodyContent.replace(/\\hfill\s*/g, '&nbsp;&nbsp;&nbsp;');
        
        // Wrap the content
        html += '<div>' + this.parseInline(bodyContent) + '</div>';
        html += '</div>';
        
        return this.renderMath(html);
    }

    /**
     * Parse LaTeX sections
     */
    parseSections(content) {
        let html = '';
        
        // Split by sections
        const sectionRegex = /\\section\{([^}]+)\}/g;
        const parts = content.split(sectionRegex);
        
        for (let i = 1; i < parts.length; i += 2) {
            const title = parts[i];
            const sectionContent = parts[i + 1] || '';
            
            // Check if this is the name section (typically first)
            if (i === 1 && !sectionContent.includes('\\subsection')) {
                html += `<h1>${this.parseInline(title)}</h1>`;
                html += this.parseContent(sectionContent, true);
            } else {
                html += `<h2>${this.parseInline(title)}</h2>`;
                html += this.parseContent(sectionContent, false);
            }
        }
        
        // Handle content before first section
        if (parts[0].trim()) {
            html = this.parseContent(parts[0], true) + html;
        }
        
        return html;
    }

    /**
     * Parse section content
     */
    parseContent(content, isHeader = false) {
        let html = '';
        
        // Parse subsections
        const subsectionRegex = /\\subsection\{([^}]+)\}/g;
        const subsectionParts = content.split(subsectionRegex);
        
        if (subsectionParts.length > 1) {
            // Has subsections
            if (subsectionParts[0].trim()) {
                html += this.parseBlock(subsectionParts[0]);
            }
            
            for (let i = 1; i < subsectionParts.length; i += 2) {
                const subsectionTitle = subsectionParts[i];
                const subsectionContent = subsectionParts[i + 1] || '';
                
                html += `<h3>${this.parseInline(subsectionTitle)}</h3>`;
                html += this.parseBlock(subsectionContent);
            }
        } else {
            // No subsections
            html += this.parseBlock(content);
        }
        
        return html;
    }

    /**
     * Parse content blocks
     */
    parseBlock(content) {
        let html = '';

        // Page breaks
        content = content.replace(/\\newpage|\\pagebreak/g, '<div class="page-break"></div>');

        // Parse contact info
        content = content.replace(/\\contactinfo\{([^}]+)\}/gs, (match, info) => {
            return `<div class="contact-info">${this.parseInline(info)}</div>`;
        });
        
        // Parse itemize (bullet lists) - accept optional args like [leftmargin=*, noitemsep]
        content = content.replace(/\\begin\{itemize\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{itemize\}/gs, (match, items) => {
            const itemList = items.split('\\item')
                .filter(item => item.trim())
                .map(item => `<li>${this.parseInline(item.trim())}</li>`)
                .join('');
            return `<ul>${itemList}</ul>`;
        });
        
        // Parse enumerate (numbered lists)
        content = content.replace(/\\begin\{enumerate\}(.*?)\\end\{enumerate\}/gs, (match, items) => {
            const itemList = items.split('\\item')
                .filter(item => item.trim())
                .map(item => `<li>${this.parseInline(item.trim())}</li>`)
                .join('');
            return `<ol>${itemList}</ol>`;
        });
        
        // Split into paragraphs
        const paragraphs = content.split('\n\n').filter(p => p.trim());
        
        paragraphs.forEach(para => {
            const trimmed = para.trim();
            if (trimmed && !trimmed.startsWith('<')) {
                html += `<p>${this.parseInline(trimmed)}</p>`;
            } else if (trimmed) {
                html += trimmed;
            }
        });
        
        return html;
    }

    /**
     * Parse inline LaTeX commands
     */
    parseInline(text) {
        // Parse vspace first (before it gets stripped)
        text = text.replace(/\\vspace\{[^}]+\}/g, '<div style="margin-top: 0.5rem;"></div>');
        
        // Handle special characters FIRST (before parsing formatting commands)
        text = text.replace(/\\&/g, '&');
        text = text.replace(/\\_/g, '_');
        text = text.replace(/\\%/g, '%');
        text = text.replace(/\\#/g, '#');
        text = text.replace(/\\\$/g, '&#36;');
        
        // Replace line breaks (handle optional bracketed spacing like \\[4pt] so [4pt] is not left behind)
        text = text.replace(/\\\\\s*(?:\[[^\]]*\])?/g, '<br>');

        // \textbackslash → literal backslash. Use HTML entities so the generic
        // command stripper below does not re-interpret the resulting \cmd text.
        // Also preserve any immediately-following command name and brace group
        // (e.g. \textbackslash vspace{10pt} → \vspace{10pt} as visible text).
        text = text.replace(/\\textbackslash\s*([a-zA-Z*]*)\s*(\{[^}]*\})?/g, (match, cmd, braces) => {
            const lb = braces ? braces.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;') : '';
            return '&#92;' + cmd + lb;
        });

        // Parse textit (italic)
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        
        // Parse textbf (bold) - use a function to handle nested content properly
        text = text.replace(/\\textbf\{([^}]+)\}/g, (match, content) => {
            return '<strong>' + content + '</strong>';
        });
        
        // Parse emph (emphasis)
        text = text.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');
        
        // Parse underline
        text = text.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
        
        // Parse href (links)
        text = text.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" target="_blank">$2</a>');
        
        // Parse url
        text = text.replace(/\\url\{([^}]+)\}/g, '<a href="$1" target="_blank">$1</a>');
        
        // Handle special spacing commands
        text = text.replace(/\\;/g, ' ');
        text = text.replace(/\\,/g, ' ');
        text = text.replace(/\\quad/g, '&nbsp;&nbsp;');
        text = text.replace(/\\qquad/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
        
        // Remove leftover curly braces that are not part of commands
        text = text.replace(/\{([^}]*)\}/g, '$1');
        
        // Remove remaining simple commands (but not their content)
        text = text.replace(/\\[a-zA-Z]+\s*/g, '');
        
        return text;
    }

    /**
     * Render math expressions using KaTeX
     */
    renderMath(html) {
        if (typeof katex === 'undefined') {
            return html;
        }

        const temp = document.createElement('div');
        temp.innerHTML = html;

        try {
            // [^$<>] prevents the pattern from spanning HTML tag boundaries.
            // (?!\d) skips dollar signs used as currency (e.g. $500, $1.2M).

            // Display math $$...$$ first
            temp.innerHTML = temp.innerHTML.replace(/\$\$([^$<>]+)\$\$/g, (match, math) => {
                try { return katex.renderToString(math, { displayMode: true, throwOnError: false }); }
                catch (e) { return match; }
            });

            // Inline math $...$ — never matches currency amounts or cross-tag content
            temp.innerHTML = temp.innerHTML.replace(/\$(?!\d)([^$<>\n]{1,200})\$/g, (match, math) => {
                try { return katex.renderToString(math, { throwOnError: false }); }
                catch (e) { return match; }
            });
        } catch (error) {
            console.error('Math rendering error:', error);
        }

        return temp.innerHTML;
    }

    /**
     * Validate LaTeX content
     */
    validate(latexContent) {
        const errors = [];

        // Strip comments before counting (same regex used in parseToHTML)
        const content = latexContent.replace(/(^|[^\\])%.*$/gm, '$1');

        // Check for unmatched braces
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('Unmatched braces detected');
        }

        // Check for unmatched begin/end
        const begins = (content.match(/\\begin\{/g) || []).length;
        const ends = (content.match(/\\end\{/g) || []).length;
        if (begins !== ends) {
            errors.push('Unmatched \\begin and \\end statements');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LaTeXRenderer;
}