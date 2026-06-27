// Main application logic for LaTeX Resume Editor

// Global variables
let editor;
let renderer;
let debounceTimer;
let isLiveUpdateEnabled = true; // Enabled for auto-compile
let compileStatusEl;

// Dynamic <style> element that lets user-chosen bg/font override dark-mode CSS
const _resumeCustomStyle = document.createElement('style');
document.head.appendChild(_resumeCustomStyle);

// Predefined colour schemes (bg + accent pairs)
const COLOR_SCHEMES = [
    { name: 'Classic',  bg: '#ffffff', accent: '#4a90e2' },
    { name: 'Dark',     bg: '#121212', accent: '#4a90e2' },
    { name: 'Warm',     bg: '#fdf8f0', accent: '#c8763a' },
    { name: 'Forest',   bg: '#f0f7f2', accent: '#2d6a4f' },
    { name: 'Slate',    bg: '#1e2a3a', accent: '#64b5f6' },
    { name: 'Minimal',  bg: '#ffffff', accent: '#555555' },
    { name: 'Rose',     bg: '#fff5f5', accent: '#c0392b' },
    { name: 'Violet',   bg: '#f7f0ff', accent: '#7f5af0' },
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    compileStatusEl = document.getElementById('compileStatus');
    initializeEditor();
    initializeThemeToggle();    // theme must come first (sets --resume-bg-color default)
    initializeColorPicker();    // accent color
    initializeBackgroundPicker();
    initializeFontSelector();
    initializeColorPresets();
    initializeStyleDropdown();
    initializeRenderer();
    attachEventListeners();
    setupAutoSave();
    loadDefaultTemplate();
});

/**
 * Initialize CodeMirror editor
 */
function initializeEditor() {
    const textarea = document.getElementById('latexEditor');
    
    editor = CodeMirror.fromTextArea(textarea, {
        mode: 'stex',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Cmd-S': () => false, // Prevent default save
            'Ctrl-S': () => false
        }
    });

    // Listen for changes (auto-compile with debounce)
    editor.on('change', () => {
        if (isLiveUpdateEnabled) {
            clearTimeout(debounceTimer);
            updateCompileStatus('compiling', '⏳ Compiling...');
            debounceTimer = setTimeout(() => {
                updatePreview();
            }, 600); // Debounce for 600ms
        }
    });
}

/**
 * Initialize LaTeX renderer
 */
function initializeRenderer() {
    renderer = new LaTeXRenderer();
}

/**
 * Initialize theme based on saved preference and setup button label
 */
function initializeThemeToggle() {
    const saved = localStorage.getItem('rac_theme') || 'light';
    applyTheme(saved);
}

/**
 * Toggle theme between light and dark
 */
function toggleTheme() {
    const current = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('rac_theme', next);
}

/**
 * Apply theme classes and update CodeMirror + button label
 */
function applyTheme(theme) {
    const body = document.body;
    const toggle = document.getElementById('themeToggleBtn');

    if (theme === 'dark') {
        body.classList.add('theme-dark');
        body.classList.remove('theme-light');
        if (toggle) toggle.checked = true;
    } else {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        if (toggle) toggle.checked = false;
    }

    // Keep CodeMirror editor appearance consistent (monokai) in both themes
    setEditorTheme('monokai');

    // Apply Classic preset as default on first visit
    if (!localStorage.getItem('rac_resume_bg')) {
        const classic = COLOR_SCHEMES[0]; // Classic: #ffffff / #4a90e2
        localStorage.setItem('rac_resume_bg', classic.bg);
        localStorage.setItem('rac_resume_color', classic.accent);
        document.documentElement.style.setProperty('--resume-bg-color', classic.bg);
        applyResumeColor(classic.accent);
        const bgPicker = document.getElementById('resumeBgPicker');
        if (bgPicker) bgPicker.value = classic.bg;
        const bgDot = document.getElementById('resumeBgDot');
        if (bgDot) bgDot.style.background = classic.bg;
    }
}

/**
 * Set CodeMirror editor theme if editor is initialized
 */
function setEditorTheme(theme) {
    if (editor) {
        editor.setOption('theme', theme);
    }
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    // Save & Recompile button
    document.getElementById('saveRecompileBtn').addEventListener('click', saveAndRecompile);
    
    // Download PDF button
    document.getElementById('downloadPdf').addEventListener('click', downloadPDF);

    // Clear editor button
    const clearBtn = document.getElementById('clearEditorBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!confirm('Clear the editor? This cannot be undone.')) return;
            editor.setValue('');
            localStorage.removeItem('latexContent');
            document.getElementById('preview').innerHTML = '';
            document.getElementById('error').textContent = '';
        });
    }


    // Theme toggle checkbox (change event)
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('change', () => {
            const next = themeBtn.checked ? 'dark' : 'light';
            applyTheme(next);
            localStorage.setItem('rac_theme', next);
        });
    }
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to trigger Save & Recompile
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveAndRecompile();
        }
    });
}

/**
 * Load default template
 */
function loadDefaultTemplate() {
    if (TEMPLATES && TEMPLATES.devops) {
        editor.setValue(TEMPLATES.devops);
        updatePreview();
    }
}

/**
 * Save current state and recompile preview
 */
function saveAndRecompile() {
    // Update compile status
    updateCompileStatus('compiling', '⏳ Compiling...');
    
    // Update preview
    updatePreview();
}

/**
 * Update compile status indicator
 */
function updateCompileStatus(type, message) {
    if (!compileStatusEl) return;
    
    compileStatusEl.className = `compile-status ${type}`;
    compileStatusEl.textContent = message;
}

/**
 * Show template selection dialog
 */
function showTemplateDialog() {
    // Create custom dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 300px;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 1rem;">Choose a Template</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button class="template-btn" data-template="professional" style="padding: 0.75rem; border: 2px solid #4a90e2; background: white; color: #4a90e2; border-radius: 6px; cursor: pointer; font-size: 0.95rem;">
                Professional (Simplified LaTeX)
            </button>
            <button class="template-btn" data-template="simple" style="padding: 0.75rem; border: 2px solid #4a90e2; background: white; color: #4a90e2; border-radius: 6px; cursor: pointer; font-size: 0.95rem;">
                Simple (Simplified LaTeX)
            </button>
            <button class="template-btn" data-template="devops" style="padding: 0.75rem; border: 2px solid #27ae60; background: white; color: #27ae60; border-radius: 6px; cursor: pointer; font-size: 0.95rem;">
                DevOps Resume (Full LaTeX)
            </button>
            <button id="cancelTemplate" style="padding: 0.75rem; border: 2px solid #ddd; background: white; color: #666; border-radius: 6px; cursor: pointer; font-size: 0.95rem; margin-top: 0.5rem;">
                Cancel
            </button>
        </div>
    `;
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    
    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);
    
    // Handle template selection
    dialog.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const templateKey = btn.dataset.template;
            editor.setValue(TEMPLATES[templateKey]);
            updatePreview();
            backdrop.remove();
            dialog.remove();
        });
        
        // Hover effect
        btn.addEventListener('mouseenter', () => {
            const color = btn.dataset.template === 'devops' ? '#27ae60' : '#4a90e2';
            btn.style.background = color;
            btn.style.color = 'white';
        });
        btn.addEventListener('mouseleave', () => {
            const color = btn.dataset.template === 'devops' ? '#27ae60' : '#4a90e2';
            btn.style.background = 'white';
            btn.style.color = color;
        });
    });
    
    // Handle cancel
    document.getElementById('cancelTemplate').addEventListener('click', () => {
        backdrop.remove();
        dialog.remove();
    });
    
    backdrop.addEventListener('click', () => {
        backdrop.remove();
        dialog.remove();
    });
}

/**
 * Update preview pane
 */
function updatePreview() {
    const latexContent = editor.getValue();
    const previewElement = document.getElementById('preview');
    const errorElement = document.getElementById('error');
    
    // Clear previous errors
    errorElement.classList.remove('show');
    errorElement.textContent = '';
    
    // Validate LaTeX
    const validation = renderer.validate(latexContent);
    
    if (!validation.valid) {
        const errorMsg = validation.errors.join(', ');
        errorElement.textContent = 'Validation errors: ' + errorMsg;
        errorElement.classList.add('show');
        updateCompileStatus('error', '❌ Validation error');
        return;
    }
    
    try {
        // Parse and render
        const html = renderer.parseToHTML(latexContent);
        previewElement.innerHTML = html;
        
        // Save to localStorage for auto-recovery
        localStorage.setItem('latexResumeContent', latexContent);
        localStorage.setItem('latexResumeTimestamp', Date.now());
        
        // Update success status
        updateCompileStatus('success', '✅ Compiled successfully');
        
    } catch (error) {
        console.error('Preview error:', error);
        const errorMsg = error.message;
        errorElement.textContent = 'Error: ' + errorMsg;
        errorElement.classList.add('show');
        previewElement.innerHTML = '<div class="loading">Unable to render preview</div>';
        
        // Update error status
        updateCompileStatus('error', '❌ ' + errorMsg);
    }
}

/**
 * Download resume as PDF.
 * Opens a dedicated print window with clean print-optimised CSS so the browser's
 * own PDF renderer handles layout — avoids html2canvas clipping.
 * Respects the active theme: dark mode → dark PDF, light mode → white PDF.
 */
function downloadPDF() {
    const previewEl = document.getElementById('preview');

    if (!previewEl.innerHTML.trim() || previewEl.innerHTML.includes('Unable to render')) {
        alert('Please create a valid resume before downloading.');
        return;
    }

    const cs = getComputedStyle(document.documentElement);
    const resumeColor = cs.getPropertyValue('--resume-primary-color').trim() || '#4a90e2';
    const resumeFont  = cs.getPropertyValue('--resume-font-family').trim()
                     || "Georgia, 'Times New Roman', serif";

    // Effective background: user-saved override takes priority, else theme default
    const savedBg = localStorage.getItem('rac_resume_bg');
    const isDark  = document.body.classList.contains('theme-dark');
    const bg      = savedBg || (isDark ? '#121212' : '#ffffff');

    // Auto-pick readable text colours based on background luminance
    const dark = getLuminance(bg) < 0.45;
    const textMain  = dark ? '#e6e6e6' : '#111111';
    const textMuted = dark ? '#b0b0b0' : '#555555';
    const textEm    = dark ? '#c2c2c2' : '#444444';
    const linkColor = dark ? '#90caf9' : resumeColor;

    // Fix any relative hrefs that would resolve to file:// paths in the saved PDF.
    const resumeHtml = previewEl.innerHTML.replace(
        /href="(?!https?:|mailto:|tel:|ftp:|#|\/\/)([^"]+)"/g,
        'href="https://$1"'
    );

    const printContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Lato:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 0; }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  html, body { margin: 0; padding: 0; background: ${bg} !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important; }
  body { color: ${textMain}; font-family: ${resumeFont}; font-size: 10.5pt; line-height: 1.55; }
  /* Padding on the wrapper div (not body) ensures body background fills full page */
  #pdf-wrap { background: ${bg} !important; width: 100%; min-height: 100vh;
    padding: 18mm 20mm 15mm 20mm; }
  .resume { width: 100%; }
  h1 { font-size: 22pt; font-weight: 700; text-align: center; color: ${textMain} !important; margin-bottom: 4pt; }
  h2 {
    font-size: 13pt; font-weight: 700;
    color: ${resumeColor} !important;
    border-bottom: 2px solid ${resumeColor} !important;
    padding-bottom: 3pt; margin: 14pt 0 6pt;
    page-break-after: avoid; break-after: avoid;
  }
  h3 { font-size: 11pt; font-weight: 700; color: ${textMain} !important; margin: 8pt 0 4pt; page-break-after: avoid; }
  p  { margin-bottom: 5pt; color: ${textMain} !important; }
  ul { margin: 0 0 7pt 16pt; }
  li { margin-bottom: 3pt; color: ${textMain} !important; }
  a  { color: ${linkColor} !important; text-decoration: none; }
  strong { font-weight: 700; color: ${textMain} !important; }
  em { font-style: italic; color: ${textEm} !important; }
  u  { text-decoration: underline; }
  .contact-info { text-align: center; color: ${textMuted} !important; font-size: 9.5pt; margin-bottom: 10pt; }
  .resume div::after { content: ''; display: table; clear: both; }
  [style*="float: right"] { float: right; font-style: italic; color: ${textMuted} !important; }
  [style*="text-align: center"] { text-align: center; }
  [style*="font-size: 2rem"]   { font-size: 18pt !important; color: ${textMain} !important; }
  [style*="font-size: 1.5rem"] { font-size: 13pt !important; color: ${textMain} !important; }
  [style*="font-size: 1.2rem"] { font-size: 11pt !important; color: ${textMain} !important; }
  ul, li { page-break-inside: avoid; break-inside: avoid; }
  .page-break { page-break-after: always !important; break-after: always !important; height: 0; border: none; margin: 0; }
  .page-break + * { margin-top: 18mm !important; }
  .page-break::after { display: none !important; }
</style>
</head>
<body>
<div id="pdf-wrap">${resumeHtml}</div>
</body>
</html>`;

    // Inject auto-print script and build Blob URL
    // Blob URL avoids popup-blocking on mobile and document.write issues
    const printContentWithScript = printContent.replace('</body>', `<script>
  window.addEventListener('load', function () {
    setTimeout(function () { window.print(); }, 600);
  });
<\/script></body>`);

    const blob = new Blob([printContentWithScript], { type: 'text/html; charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    const printWin = window.open(blobUrl, '_blank');
    if (!printWin) {
        // Popup blocked — navigate current tab to the print page instead
        window.location.href = blobUrl;
    }

    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Auto-save functionality
 */
function setupAutoSave() {
    // Try to recover from localStorage on load
    const saved = localStorage.getItem('latexResumeContent');
    const timestamp = localStorage.getItem('latexResumeTimestamp');
    
    if (saved && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        const ageMinutes = Math.floor(age / 60000);
        
        if (ageMinutes < 60 && confirm(`Recover unsaved work from ${ageMinutes} minutes ago?`)) {
            editor.setValue(saved);
            updatePreview();
        }
    }
}

/**
 * Build and wire the colour-scheme presets dropdown.
 */
function initializeColorPresets() {
    const btn      = document.getElementById('presetsBtn');
    const dropdown = document.getElementById('presetsDropdown');
    const grid     = document.getElementById('presetsGrid');
    const resetBtn = document.getElementById('presetsReset');
    if (!btn || !dropdown || !grid) return;

    // Build one card per scheme
    COLOR_SCHEMES.forEach(scheme => {
        const item = document.createElement('div');
        item.className = 'preset-item';
        item.title = scheme.name;
        item.innerHTML = `
            <div class="preset-swatch">
                <div class="preset-swatch-half" style="background:${scheme.bg}"></div>
                <div class="preset-swatch-half" style="background:${scheme.accent}"></div>
            </div>
            <span class="preset-name">${scheme.name}</span>`;

        item.addEventListener('click', () => {
            // Apply background (set storage first so applyTheme won't override it)
            localStorage.setItem('rac_resume_bg', scheme.bg);
            document.documentElement.style.setProperty('--resume-bg-color', scheme.bg);
            const bgPicker = document.getElementById('resumeBgPicker');
            if (bgPicker) bgPicker.value = scheme.bg;
            const bgDot2 = document.getElementById('resumeBgDot');
            if (bgDot2) bgDot2.style.background = scheme.bg;

            // Apply accent
            localStorage.setItem('rac_resume_color', scheme.accent);
            applyResumeColor(scheme.accent);
            const accentPicker = document.getElementById('primaryColorPicker');
            if (accentPicker) accentPicker.value = scheme.accent;
            const accentDot2 = document.getElementById('primaryColorDot');
            if (accentDot2) accentDot2.style.background = scheme.accent;

            // Auto-switch app theme to match the scheme's background brightness
            const autoTheme = getLuminance(scheme.bg) < 0.45 ? 'dark' : 'light';
            applyTheme(autoTheme);
            localStorage.setItem('rac_theme', autoTheme);

            flushResumeCustomStyle();
            markActivePreset(scheme);
            dropdown.classList.remove('open');
        });
        grid.appendChild(item);
    });

    // Highlight the currently active scheme on open
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) markActivePreset(null);
        const styleDropdown = document.getElementById('styleDropdown');
        if (styleDropdown) styleDropdown.classList.remove('open');
    });

    // Close when clicking outside
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Reset everything to defaults
    resetBtn.addEventListener('click', () => {
        if (!confirm('Reset everything? This will restore the default template and colour scheme.')) return;

        // Reset colours & font
        const defaultBg     = '#ffffff';
        const defaultAccent = '#4a90e2';
        const defaultFont   = "Georgia, 'Times New Roman', serif";

        localStorage.removeItem('rac_resume_bg');
        localStorage.removeItem('rac_resume_color');
        localStorage.removeItem('rac_resume_font');
        localStorage.removeItem('latexContent');

        document.documentElement.style.setProperty('--resume-bg-color', defaultBg);
        document.documentElement.style.setProperty('--resume-font-family', defaultFont);
        applyResumeColor(defaultAccent);
        flushResumeCustomStyle();

        const bgPicker     = document.getElementById('resumeBgPicker');
        const accentPicker = document.getElementById('primaryColorPicker');
        const fontSelect   = document.getElementById('resumeFontSelect');
        if (bgPicker)     bgPicker.value     = defaultBg;
        if (accentPicker) accentPicker.value = defaultAccent;
        if (fontSelect)   fontSelect.value   = defaultFont;
        const bgDotR     = document.getElementById('resumeBgDot');
        const accentDotR = document.getElementById('primaryColorDot');
        if (bgDotR)     bgDotR.style.background     = defaultBg;
        if (accentDotR) accentDotR.style.background = defaultAccent;

        // Reset editor to default template
        if (TEMPLATES && TEMPLATES.devops) {
            editor.setValue(TEMPLATES.devops);
            updatePreview();
        }

        dropdown.classList.remove('open');
    });
}

/**
 * Wire up the Style dropdown toggle (font + colours).
 */
function initializeStyleDropdown() {
    const btn      = document.getElementById('styleBtn');
    const dropdown = document.getElementById('styleDropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        // Close presets if open
        const presetsDropdown = document.getElementById('presetsDropdown');
        if (presetsDropdown) presetsDropdown.classList.remove('open');
    });

    document.addEventListener('click', () => dropdown.classList.remove('open'));
    dropdown.addEventListener('click', (e) => e.stopPropagation());
}

/** Mark the card whose colours match current stored values */
function markActivePreset(active) {
    const grid = document.getElementById('presetsGrid');
    if (!grid) return;
    const currentBg     = localStorage.getItem('rac_resume_bg')    || '#ffffff';
    const currentAccent = localStorage.getItem('rac_resume_color') || '#4a90e2';
    Array.from(grid.children).forEach((card, i) => {
        const s = COLOR_SCHEMES[i];
        const match = active
            ? s === active
            : s.bg === currentBg && s.accent === currentAccent;
        card.classList.toggle('active', match);
    });
}

/**
 * Return perceived luminance of a hex colour (0 = black, 1 = white).
 * Used to auto-pick readable text colours in the PDF based on background.
 */
function getLuminance(hex) {
    hex = (hex || '#ffffff').replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Write a dynamic <style> rule so user-chosen bg/font beat the dark-mode CSS rule.
 */
function flushResumeCustomStyle() {
    const bg   = localStorage.getItem('rac_resume_bg');
    const font = localStorage.getItem('rac_resume_font');

    if (!bg && !font) {
        _resumeCustomStyle.textContent = '';
        return;
    }

    const rules = [];
    if (bg)   rules.push(`background: ${bg} !important;`);
    if (font) rules.push(`font-family: ${font} !important;`);

    // When the user has explicitly set a resume background, pin text colours to
    // match that background regardless of the app's light/dark chrome theme.
    // Without this, switching app theme removes the dark-mode CSS overrides and
    // leaves unreadable text on a dark resume background (or vice-versa).
    let textRules = '';
    if (bg) {
        const onDark    = getLuminance(bg) < 0.45;
        const textMain  = onDark ? '#e6e6e6' : '#111111';
        const textMuted = onDark ? '#b0b0b0' : '#555555';
        const accent    = localStorage.getItem('rac_resume_color') || '#4a90e2';
        const linkColor = onDark ? lightenHex(accent, 25) : accent;
        textRules = `
            .resume, .resume p, .resume li { color: ${textMain} !important; }
            .resume h1, .resume h3, .resume strong { color: ${textMain} !important; }
            .resume em { color: ${textMuted} !important; }
            .resume a { color: ${linkColor} !important; }
        `;
    }

    _resumeCustomStyle.textContent =
        `.resume { ${rules.join(' ')} }` +
        `.resume .page-break::after { background: ${bg || 'var(--resume-bg-color)'}; }` +
        textRules;
}

/**
 * Initialize background colour picker
 */
function initializeBackgroundPicker() {
    const picker = document.getElementById('resumeBgPicker');
    if (!picker) return;

    const saved = localStorage.getItem('rac_resume_bg');
    const isDark = document.body.classList.contains('theme-dark');
    const initial = saved || (isDark ? '#121212' : '#ffffff');

    picker.value = initial;
    document.documentElement.style.setProperty('--resume-bg-color', initial);
    const bgDot = document.getElementById('resumeBgDot');
    if (bgDot) bgDot.style.background = initial;
    if (saved) flushResumeCustomStyle();

    picker.addEventListener('input', (e) => {
        const val = e.target.value;
        document.documentElement.style.setProperty('--resume-bg-color', val);
        localStorage.setItem('rac_resume_bg', val);
        if (bgDot) bgDot.style.background = val;
        flushResumeCustomStyle();
    });
}

/**
 * Initialize font-family selector
 */
function initializeFontSelector() {
    const select = document.getElementById('resumeFontSelect');
    if (!select) return;

    const saved = localStorage.getItem('rac_resume_font');
    if (saved) {
        select.value = saved;
        document.documentElement.style.setProperty('--resume-font-family', saved);
        flushResumeCustomStyle();
    }

    select.addEventListener('change', (e) => {
        const val = e.target.value;
        document.documentElement.style.setProperty('--resume-font-family', val);
        localStorage.setItem('rac_resume_font', val);
        flushResumeCustomStyle();
    });
}

/**
 * Initialize resume color picker input and load saved resume color.
 * This ensures changing the resume accent does NOT affect app chrome/buttons.
 * Also clears a legacy global color key if present so older stored values
 * don't continue to change app chrome (buttons).
 */
function initializeColorPicker() {
    const picker = document.getElementById('primaryColorPicker');
    if (!picker) return;

    // Remove legacy global primary color key if present to avoid unintentionally
    // changing app chrome (some users may have a leftover 'rac_primary_color').
    if (localStorage.getItem('rac_primary_color')) {
        localStorage.removeItem('rac_primary_color');
    }

    const saved = localStorage.getItem('rac_resume_color');
    // Read resume-specific variable fallback to the original blue
    let current = saved || getComputedStyle(document.documentElement).getPropertyValue('--resume-primary-color').trim();
    if (!current) current = '#4a90e2';
    picker.value = current;
    picker.title = 'Resume accent color';
    applyResumeColor(current);
    const accentDot = document.getElementById('primaryColorDot');
    if (accentDot) accentDot.style.background = current;
    picker.addEventListener('input', (e) => {
        const val = e.target.value;
        applyResumeColor(val);
        localStorage.setItem('rac_resume_color', val);
        if (accentDot) accentDot.style.background = val;
    });
}

/**
 * Apply resume color and compute a lighter resume-secondary color
 */
function applyResumeColor(hex) {
    if (!hex) return;
    document.documentElement.style.setProperty('--resume-primary-color', hex);
    const secondary = lightenHex(hex, 22);
    document.documentElement.style.setProperty('--resume-secondary-color', secondary);
}

/**
 * Lighten a hex color by percent (0-100) by mixing with white
 */
function lightenHex(hex, percent) {
    hex = (hex || '').replace('#', '').trim();
    if (!hex) return '#ffffff';
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
