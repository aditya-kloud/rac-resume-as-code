// Main application logic for LaTeX Resume Editor

// Global variables
let editor;
let renderer;
let debounceTimer;
let isLiveUpdateEnabled = true; // Enabled for auto-compile
let compileStatusEl;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    compileStatusEl = document.getElementById('compileStatus');
    initializeEditor();
    initializeThemeToggle(); // setup theme based on preference
    initializeColorPicker(); // setup primary color picker
    initializeRenderer();
    attachEventListeners();
    setupAutoSave(); // Call after editor is initialized
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
 * Download resume as PDF
 */
async function downloadPDF() {
    const previewElement = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadPdf');
    
    // Check if there's content to download
    if (!previewElement.innerHTML.trim() || previewElement.innerHTML.includes('Unable to render')) {
        alert('Please create a valid resume before downloading.');
        return;
    }
    
    // Disable button and show loading state
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating PDF...';
    
        try {
        // Clone the preview content for PDF generation
        const element = previewElement.cloneNode(true);

        // Ensure width/box-sizing match A4 so html2canvas/jsPDF paginate consistently
        element.style.width = '210mm';
        element.style.boxSizing = 'border-box';
        element.style.maxWidth = '210mm';
        element.style.padding = '16mm';

            // Configure PDF options
            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: false,
                    logging: false
                },
                // Use legacy pagination mode to avoid html2pdf forcing page breaks per element.
                // Keep pagebreak minimal — legacy mode generally preserves normal flow better.
                pagebreak: {
                    mode: ['legacy']
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                }
            };

        // Generate PDF
        await html2pdf().set(opt).from(element).save();

        // Show success message
        showNotification('PDF downloaded successfully!', 'success');

    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Failed to generate PDF: ' + error.message, 'error');
    } finally {
        // Re-enable button
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download PDF';
    }
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
    picker.addEventListener('input', (e) => {
        const val = e.target.value;
        applyResumeColor(val);
        localStorage.setItem('rac_resume_color', val);
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
