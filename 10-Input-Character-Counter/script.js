document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const countEl = document.querySelector('.count');
    const textarea = document.querySelector('textarea');
    const clearBtn = document.querySelector('.clear-btn');
    const copyBtn = document.querySelector('.copy-btn');
    const themeBtn = document.querySelector('.theme-btn');
    const progressFill = document.querySelector('.progress-fill');
    const wordsCount = document.querySelector('.stat-value.words');
    const charsNoSpacesCount = document.querySelector('.stat-value.chars-no-spaces');
    const linesCount = document.querySelector('.stat-value.lines');
    
    // Max characters for progress bar (can be adjusted)
    const MAX_CHARS = 1000;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    // Event Listeners
    textarea.addEventListener('input', updateCounters);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);
    themeBtn.addEventListener('click', toggleTheme);
    
    // Initialize
    updateCounters();
    
    // Functions
    function updateCounters() {
        const text = textarea.value;
        const charCount = text.length;
        
        // Update character count
        countEl.textContent = charCount;
        
        // Update progress bar
        const progressPercent = Math.min((charCount / MAX_CHARS) * 100, 100);
        progressFill.style.width = `${progressPercent}%`;
        
        // Change color if approaching max
        if (progressPercent > 90) {
            progressFill.style.background = 'linear-gradient(90deg, var(--warning-color), #f72585)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, var(--primary-color), var(--accent-color))';
        }
        
        // Update word count (simple word count - splits by whitespace)
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        wordsCount.textContent = words;
        
        // Update character count without spaces
        const charsNoSpaces = text.replace(/\s+/g, '').length;
        charsNoSpacesCount.textContent = charsNoSpaces;
        
        // Update line count
        const lines = text === '' ? 0 : text.split('\n').length;
        linesCount.textContent = lines;
    }
    
    function clearText() {
        textarea.value = '';
        updateCounters();
        animateCountReset();
        
        // Focus back on textarea
        textarea.focus();
    }
    
    function copyText() {
        if (textarea.value.trim() === '') return;
        
        textarea.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    }
    
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }
    
    function animateCountReset() {
        countEl.style.transform = 'scale(1.2)';
        countEl.style.color = 'var(--warning-color)';
        
        setTimeout(() => {
            countEl.style.transform = 'scale(1)';
            countEl.style.color = 'var(--primary-color)';
        }, 300);
    }
    
    // Accessibility - make textarea focusable on card click
    document.querySelector('.counter-card').addEventListener('click', function(e) {
        if (e.target === this) {
            textarea.focus();
        }
    });
});

























// const count = document.querySelector("p");
// const input = document.querySelector("input");

// input.addEventListener('keyup',()=>{
//     count.innerHTML = input.value.length;
// });
