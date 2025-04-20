const colorOne = document.getElementById("color-a");
const colorTwo = document.getElementById("color-b");
const colorOneText = document.getElementById("color-a-text");
const colorTwoText = document.getElementById("color-b-text");
const gradientPreview = document.getElementById("gradientPreview");
const swapBtn = document.getElementById("swap-colors");
const randomBtn = document.getElementById("random");
let currentDirection = 'to bottom';
let outputCode = document.getElementById("code");

// Initialize
function init() {
    generateCode();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    colorOne.addEventListener('input', () => {
        colorOneText.value = colorOne.value;
        generateCode();
    });
    
    colorTwo.addEventListener('input', () => {
        colorTwoText.value = colorTwo.value;
        generateCode();
    });
    
    colorOneText.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorOneText.value)) {
            colorOne.value = colorOneText.value;
            generateCode();
        }
    });
    
    colorTwoText.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorTwoText.value)) {
            colorTwo.value = colorTwoText.value;
            generateCode();
        }
    });
    
    swapBtn.addEventListener('click', swapColors);
    randomBtn.addEventListener('click', randomGradient);
}

// Set gradient direction
function setDirection(value, _this) {
    let directions = document.querySelectorAll(".buttons button");
    directions.forEach(btn => btn.classList.remove("active"));
    _this.classList.add("active");
    currentDirection = value;
    generateCode();
}

// Generate CSS code
function generateCode() {
    const gradient = `linear-gradient(${currentDirection}, ${colorOne.value}, ${colorTwo.value})`;
    outputCode.value = `background: ${gradient};`;
    document.body.style.background = gradient;
    gradientPreview.style.background = gradient;
}

// Copy text to clipboard
function copyText() {
    navigator.clipboard.writeText(outputCode.value)
        .then(() => {
            const copyMessage = document.getElementById("copy-message");
            copyMessage.classList.add("show");
            setTimeout(() => {
                copyMessage.classList.remove("show");
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please try again.');
        });
}

// Swap colors
function swapColors() {
    const tempColor = colorOne.value;
    colorOne.value = colorTwo.value;
    colorTwo.value = tempColor;
    
    const tempText = colorOneText.value;
    colorOneText.value = colorTwoText.value;
    colorTwoText.value = tempText;
    
    generateCode();
}

// Apply preset gradient
function applyPreset(color1, color2) {
    colorOne.value = color1;
    colorTwo.value = color2;
    colorOneText.value = color1;
    colorTwoText.value = color2;
    generateCode();
}

// Generate random gradient
function randomGradient() {
    const randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16);
    const randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    colorOne.value = randomColor1;
    colorTwo.value = randomColor2;
    colorOneText.value = randomColor1;
    colorTwoText.value = randomColor2;
    
    // Also randomize direction
    const directions = ['to top', 'to bottom', 'to right', 'to left', 
                        'to top right', 'to bottom left', 'to bottom right', 'to top left'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const directionButtons = document.querySelectorAll(".buttons button");
    directionButtons.forEach(btn => btn.classList.remove("active"));
    
    // Find and activate the matching direction button
    for (let btn of directionButtons) {
        if (btn.getAttribute('aria-label').includes(randomDirection.replace(/ /g, ''))) {
            btn.classList.add("active");
            currentDirection = randomDirection;
            break;
        }
    }
    
    generateCode();
}

// Initialize the app
init();









// const colorOne = document.getElementById("color-a");
// const colorTwo = document.getElementById("color-b");
// let currentDirection = 'to bottom';
// let outputCode = document.getElementById("code");

// function setDirection(value,_this){
//     let directions = document.querySelectorAll(".buttons button");
//     for(let i of directions){
//         i.classList.remove("active");
//     }

//     _this.classList.add("active");
//     currentDirection = value;
// }

// function generateCode(){
//     outputCode.value = `background: linear-gradient(${currentDirection},${colorOne.value},${colorTwo.value});`

//     document.getElementsByTagName("BODY")[0].style.background = `linear-gradient(${currentDirection},${colorOne.value},${colorTwo.value})`;

// }

// function copyText(){
//     navigator.clipboard.writeText(outputCode.value)
//         .then(()=>{
//             alert('Gradient Copied!');
//         });

// }

// generateCode();