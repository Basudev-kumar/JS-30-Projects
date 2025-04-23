document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const billInput = document.getElementById('bill');
    const tipSlider = document.getElementById('tip');
    const peopleSlider = document.getElementById('no-of-people');
    const tipPercentDisplay = document.getElementById('tip-percent');
    const splitNumDisplay = document.getElementById('split-num');
    const tipAmountDisplay = document.getElementById('tip-amount');
    const totalAmountDisplay = document.getElementById('total-amount');
    const tipPerPersonDisplay = document.getElementById('tip-per-person');
    const totalPerPersonDisplay = document.getElementById('total-per-person');
    const tipButtons = document.querySelectorAll('.tip-btn');
    const resetButton = document.getElementById('reset-btn');
    const shareButton = document.getElementById('share-btn');
    const themeButton = document.getElementById('theme-btn');
    
    // Initialize calculator
    calculateTip();
    
    // Event Listeners
    billInput.addEventListener('input', calculateTip);
    tipSlider.addEventListener('input', updateTipSlider);
    peopleSlider.addEventListener('input', updatePeopleSlider);
    resetButton.addEventListener('click', resetCalculator);
    shareButton.addEventListener('click', shareResults);
    themeButton.addEventListener('click', toggleTheme);
    
    // Tip button event listeners
    tipButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tipValue = parseInt(this.getAttribute('data-tip'));
            tipSlider.value = tipValue;
            updateTipSlider();
            
            // Update active state
            tipButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            this.classList.add('bounce');
            
            // Remove animation class after animation ends
            this.addEventListener('animationend', () => {
                this.classList.remove('bounce');
            });
        });
    });
    
    // Functions
    function calculateTip() {
        let bill = parseFloat(billInput.value) || 0;
        let tipPercent = parseInt(tipSlider.value);
        let numOfPeople = parseInt(peopleSlider.value);
        
        // Format bill input
        billInput.value = bill.toFixed(2);
        
        // Calculate values
        let totalTip = parseFloat((bill * (tipPercent / 100)).toFixed(2));
        let totalAmount = (parseFloat(bill) + parseFloat(totalTip)).toFixed(2);
        let tipPerPerson = (totalTip / numOfPeople).toFixed(2);
        let totalPerPerson = (totalAmount / numOfPeople).toFixed(2);
        
        // Update displays
        tipAmountDisplay.textContent = `$${totalTip}`;
        totalAmountDisplay.textContent = `$${totalAmount}`;
        tipPerPersonDisplay.textContent = `$${tipPerPerson}`;
        totalPerPersonDisplay.textContent = `$${totalPerPerson}`;
        
        // Add pulse animation to results
        [tipAmountDisplay, totalAmountDisplay, tipPerPersonDisplay, totalPerPersonDisplay].forEach(el => {
            el.classList.add('pulse');
            el.addEventListener('animationend', () => {
                el.classList.remove('pulse');
            });
        });
    }
    
    function updateTipSlider() {
        tipPercentDisplay.textContent = tipSlider.value;
        
        // Update active tip button if it matches the slider value
        tipButtons.forEach(button => {
            const tipValue = parseInt(button.getAttribute('data-tip'));
            button.classList.toggle('active', tipValue === parseInt(tipSlider.value));
        });
        
        calculateTip();
    }
    
    function updatePeopleSlider() {
        splitNumDisplay.textContent = peopleSlider.value;
        calculateTip();
    }
    
    function resetCalculator() {
        billInput.value = '0.00';
        tipSlider.value = '15';
        peopleSlider.value = '1';
        
        // Reset active tip button
        tipButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Set default active button (15%)
        document.querySelector('.tip-btn[data-tip="15"]').classList.add('active');
        
        updateTipSlider();
        updatePeopleSlider();
        
        // Add animation to reset
        resetButton.classList.add('pulse');
        resetButton.addEventListener('animationend', () => {
            resetButton.classList.remove('pulse');
        });
    }
    
    function shareResults() {
        const bill = billInput.value;
        const tipPercent = tipSlider.value;
        const tipAmount = tipAmountDisplay.textContent;
        const totalAmount = totalAmountDisplay.textContent;
        const numPeople = peopleSlider.value;
        const tipPerPerson = tipPerPersonDisplay.textContent;
        const totalPerPerson = totalPerPersonDisplay.textContent;
        
        const shareText = `Tip Calculation:
Bill: $${bill}
Tip: ${tipPercent}% (${tipAmount})
Total: ${totalAmount}
Split between ${numPeople} people:
Tip per person: ${tipPerPerson}
Total per person: ${totalPerPerson}
        
Calculated with Tip Calculator`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Tip Calculation',
                text: shareText
            }).catch(err => {
                console.log('Error sharing:', err);
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
        
        // Add animation to share button
        shareButton.classList.add('pulse');
        shareButton.addEventListener('animationend', () => {
            shareButton.classList.remove('pulse');
        });
    }
    
    function fallbackShare(text) {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(text).then(() => {
            alert('Calculation copied to clipboard!');
        }).catch(err => {
            console.log('Could not copy text: ', err);
            prompt('Copy this calculation:', text);
        });
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon
        const icon = themeButton.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Add animation
        themeButton.classList.add('pulse');
        themeButton.addEventListener('animationend', () => {
            themeButton.classList.remove('pulse');
        });
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = themeButton.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
});






























// const sliders = document.querySelectorAll("input[type='range']");
// sliders.forEach(function(slider){
//     slider.addEventListener("input",calculateTip)
// });

// const billInput = document.getElementById("bill");
// billInput.addEventListener("change",calculateTip);


// function calculateTip(){

//     let bill = parseFloat(billInput.value);
//     let tipPercent = document.getElementById("tip").value;  // 15% 
//     let noOfPeople = document.getElementById("no-of-people").value;

//     billInput.value = bill.toFixed(2);

//     let totalTip = parseFloat((bill * (tipPercent/100)).toFixed(2));
//                                         // 15/100 -> 0.15 then
//                                         // 0.15 * $100 -> 15.00 ->15


//     let total = parseFloat((bill + totalTip).toFixed(2))

//     let tipPerPerson = (totalTip/noOfPeople).toFixed(2)

//     let totalPerPerson = (total/noOfPeople).toFixed(2)

//     document.getElementById("tip-amount").textContent = `$${totalTip}`;

//     document.getElementById("total-amount").textContent = `$${total}`;

//     document.getElementById("tip-percent").textContent = `${tipPercent}%`;

//     document.getElementById("split-num").textContent = `${noOfPeople}`;

//     document.getElementById("tip-per-person").textContent = `$${tipPerPerson}`;

//     document.getElementById("total-per-person").textContent = `$${totalPerPerson}`;

// }

// calculateTip();

