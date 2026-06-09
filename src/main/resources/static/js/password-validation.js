document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-password');

    // ==========================================
    // 1. BLINKING VISIBILITY TOGGLE (EYE BUTTON)
    // ==========================================
    if (passwordInput && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const svgIcon = toggleBtn.querySelector('.eye-icon');
            if (!svgIcon) return;

            // Force add the animation class to run immediately
            svgIcon.classList.add('blink-active');

            // Switch the visibility settings halfway through the blink animation
            setTimeout(() => {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                
                // Toggle the state class to swap visual paths
                if (isPassword) {
                    toggleBtn.classList.add('show-password');
                } else {
                    toggleBtn.classList.remove('show-password');
                }
            }, 100);

            // Strip out the animation class right as it completes to reset
            setTimeout(() => {
                svgIcon.classList.remove('blink-active');
            }, 200);
        });
    }

    // ==========================================
    // 2. LIVE DATA VALIDATION & ERROR TRACKING
    // ==========================================
    if (!passwordInput) return;

    // Create container for real-time validation feedback dynamically
    const reqList = document.createElement('ul');
    reqList.style.listStyle = 'none';
    reqList.style.padding = '0';
    reqList.style.marginTop = '12px';
    reqList.style.fontSize = '11px';
    reqList.style.textAlign = 'left';

    // Validation definitions
    const rules = [
        { id: 'len', text: '• Must be at least 12 characters', check: val => val.length >= 12 },
        { id: 'cap', text: '• Must contain 1 capital letter', check: val => /[A-Z]/.test(val) },
        { id: 'num', text: '• Must contain 2 numbers', check: val => (val.match(/[0-9]/g) || []).length >= 2 },
        { id: 'spc', text: '• Must contain 3 special symbols', check: val => (val.match(/[^A-Za-z0-9]/g) || []).length >= 3 }
    ];

    // Append items programmatically
    const elements = {};
    rules.forEach(rule => {
        const item = document.createElement('li');
        item.innerText = rule.text;
        item.style.color = '#ff6b6b'; /* Default unmet color: Soft Red */
        item.style.transition = 'color 0.2s ease';
        reqList.appendChild(item);
        elements[rule.id] = item;
    });

    // SAFE SELECTION: Inject the checklist cleanly directly right after the password wrapper block
    const passwordWrapper = passwordInput.closest('.password-wrapper');
    if (passwordWrapper) {
        passwordWrapper.parentNode.insertBefore(reqList, passwordWrapper.nextSibling);
    }

    // Watch for typing events
    passwordInput.addEventListener('input', () => {
        const currentVal = passwordInput.value;

        rules.forEach(rule => {
            const targetEl = elements[rule.id];
            if (rule.check(currentVal)) {
                targetEl.style.color = '#51cf66'; /* Complete status color: Green */
            } else {
                targetEl.style.color = '#ff6b6b';
            }
        });
    });

    // Intercept form submissions if rules aren't met
    const form = passwordInput.closest('form');
    if (form) {
        form.addEventListener('submit', (event) => {
            const currentVal = passwordInput.value;
            const allMet = rules.every(rule => rule.check(currentVal));
            
            if (!allMet) {
                event.preventDefault();
                alert('Please resolve all red validation checklist items before logging in.');
            }
        });
    }
});