document.addEventListener("DOMContentLoaded", function() {
    // Initialize elements
    const investmentInput = document.getElementById("investment");
    const interestRateInput = document.getElementById("interest-rate");
    const timePeriodInput = document.getElementById("time-period");
    const compoundingFrequency = document.getElementById("compounding-frequency");
    const calculateBtn = document.getElementById("calculate-btn");

    // Add event listeners
    investmentInput.addEventListener("input", function() {
        updateInvestmentValue(this.value);
    });

    interestRateInput.addEventListener("input", function() {
        updateInterestRateValue(this.value);
    });

    timePeriodInput.addEventListener("input", function() {
        updateTimePeriodValue(this.value);
    });

    // Initialize values
    updateInvestmentValue(investmentInput.value);
    updateInterestRateValue(interestRateInput.value);
    updateTimePeriodValue(timePeriodInput.value);

    // Add animation to calculate button
    calculateBtn.addEventListener("click", function() {
        this.classList.add("button-click");
        setTimeout(() => {
            this.classList.remove("button-click");
        }, 300);
    });
});

function updateInvestmentValue(value) {
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
    document.getElementById("investment-value").innerText = formattedValue;
}

function updateInterestRateValue(value) {
    document.getElementById("interest-rate-value").innerText = `${parseFloat(value).toFixed(1)}%`;
}

function updateTimePeriodValue(value) {
    document.getElementById("time-period-value").innerText = `${value} Year${value != 1 ? 's' : ''}`;
}

function calculateFD() {
    const principal = parseFloat(document.getElementById("investment").value);
    const rateOfInterest = parseFloat(document.getElementById("interest-rate").value);
    const timePeriod = parseFloat(document.getElementById("time-period").value);
    const n = parseInt(document.getElementById("compounding-frequency").value);

    // Calculate compound interest
    const totalAmount = principal * Math.pow((1 + (rateOfInterest / 100) / n), n * timePeriod);
    const interestEarned = totalAmount - principal;

    // Format numbers with Indian locale
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    // Update UI with formatted values
    document.getElementById("invested-amount").innerText = formatter.format(principal);
    document.getElementById("estimated-returns").innerText = formatter.format(Math.round(interestEarned));
    document.getElementById("total-value").innerText = formatter.format(Math.round(totalAmount));

    // Add animation to results
    const results = document.querySelectorAll(".result-card");
    results.forEach((result, index) => {
        setTimeout(() => {
            result.classList.add("result-animation");
            setTimeout(() => {
                result.classList.remove("result-animation");
            }, 500);
        }, index * 100);
    });

    // Scroll to results for better mobile experience
    document.querySelector(".output-section").scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// Add service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}


































// document.addEventListener("DOMContentLoaded",function(){

//     const investmentInput = document.getElementById("investment");

//     const interestRateInput = document.getElementById("interest-rate");

//     const timePeriodInput = document.getElementById("time-period");

//     investmentInput.addEventListener("input",function(){
//         updateInvestmentValue(this.value);
//     });

//     interestRateInput.addEventListener("input",function(){
//         updateInterestRateValue(this.value);
//     });

//     timePeriodInput.addEventListener("input",function(){
//         updateTimePeriodValue(this.value);
//     });

//     updateInvestmentValue(investmentInput.value);
//     updateInterestRateValue(interestRateInput.value);
//     updateTimePeriodValue(timePeriodInput.value);
// });

// function updateInvestmentValue(value){
//     document.getElementById("investment-value").innerText = `${parseFloat(value).toLocaleString('en-IN')}`;
// }

// function updateInterestRateValue(value){
//     document.getElementById("interest-rate-value").innerText = `${parseFloat(value).toFixed(1)}%`;
// }

// function updateTimePeriodValue(value){
//     document.getElementById("time-period-value").innerText = value;
// }

// function calculateFD(){

//     const principal = parseFloat( document.getElementById("investment").value);

//     const rateOfInterest = parseFloat( document.getElementById("interest-rate").value);

//     const timePeriod = parseFloat( document.getElementById("time-period").value);

//     const n = 4;
//     const totalAmount = principal * Math.pow((1 + (rateOfInterest / 100) /n), n * timePeriod);
//     const interestEarned = totalAmount - principal;

//     document.getElementById("invested-amount").innerText =  `₹${principal.toLocaleString('en-IN')}`;

//     document.getElementById("estimated-returns").innerText = ` ₹${Math.round(interestEarned).toLocaleString('en-IN')}`;

//     document.getElementById("total-value").innerText = ` ₹${Math.round(totalAmount).toLocaleString('en-IN')}`;

// }