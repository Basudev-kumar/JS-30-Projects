function validateInput(event) {
    // Prevent form submission for demo purposes
    if (event) event.preventDefault();
    
    const inputField = document.getElementById("inputField");
    const inputValue = inputField.value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const validIcon = document.querySelector(".valid-icon");
    const invalidIcon = document.querySelector(".invalid-icon");
    
    // Reset icons and styles
    validIcon.style.display = "none";
    invalidIcon.style.display = "none";
    inputField.classList.remove("shake", "success");
    errorMessage.classList.remove("active");
    
    if (inputValue === "") {
        // Invalid input
        inputField.classList.add("shake");
        errorMessage.classList.add("active");
        invalidIcon.style.display = "block";
        
        setTimeout(() => {
            inputField.classList.remove("shake");
        }, 500);
    } else {
        // Valid input
        inputField.classList.add("success");
        validIcon.style.display = "block";
        
        // Show success animation
        inputField.style.animation = "pulse 0.5s";
        setTimeout(() => {
            inputField.style.animation = "";
        }, 500);
        
        // Show success message (in a real app, you would submit the form here)
        setTimeout(() => {
            alert(`Success! You entered: "${inputValue}"`);
        }, 600);
    }
}

// Add real-time validation as user types
document.getElementById("inputField").addEventListener("input", function() {
    const inputValue = this.value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const validIcon = document.querySelector(".valid-icon");
    const invalidIcon = document.querySelector(".invalid-icon");
    
    if (inputValue.length > 0) {
        errorMessage.classList.remove("active");
        validIcon.style.display = "block";
        invalidIcon.style.display = "none";
        this.classList.remove("shake");
        this.classList.add("success");
    } else {
        validIcon.style.display = "none";
        invalidIcon.style.display = "none";
        this.classList.remove("success");
    }
});

// Form submission handler
document.getElementById("myForm").addEventListener("submit", validateInput);


