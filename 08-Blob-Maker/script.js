// DOM Elements
const outputCode = document.getElementById("css-code");
const sliders = document.querySelectorAll("input[type='range']");
const sliderValues = document.querySelectorAll(".slider-value");
const inputs = document.querySelectorAll("input[type='number']");
const colorInputs = document.querySelectorAll("input[type='color']");
const gradientDirection = document.getElementById("gradient-direction");
const presetButtons = document.querySelectorAll(".preset-btn");
const downloadBtn = document.getElementById("download");

// Initialize the blob
createBlob();

// Event Listeners
sliders.forEach((slider, index) => {
    slider.addEventListener("input", () => {
        sliderValues[index].textContent = `${slider.value}%`;
        createBlob();
    });
});

inputs.forEach(input => {
    input.addEventListener("change", createBlob);
});

colorInputs.forEach(colorInput => {
    colorInput.addEventListener("input", createBlob);
});

gradientDirection.addEventListener("change", createBlob);

document.getElementById("copy").addEventListener("click", function() {
    outputCode.select();
    document.execCommand("copy");
    
    // Visual feedback
    const copyBtn = this;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
        copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
    }, 2000);
});

downloadBtn.addEventListener("click", downloadBlob);

presetButtons.forEach(button => {
    button.addEventListener("click", () => {
        applyPreset(button.dataset.preset);
    });
});

// Functions
function createBlob() {
    const radiusOne = sliders[0].value;
    const radiusTwo = sliders[1].value;
    const radiusThree = sliders[2].value;
    const radiusFour = sliders[3].value;
    
    const blobHeight = inputs[0].value;
    const blobWidth = inputs[1].value;
    
    const color1 = colorInputs[0].value;
    const color2 = colorInputs[1].value;
    const direction = gradientDirection.value;
    
    let gradient;
    if (direction === "circle") {
        gradient = `radial-gradient(circle, ${color1}, ${color2})`;
    } else {
        gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
    }
    
    const borderRadius = `${radiusOne}% ${100 - radiusOne}% ${100 - radiusThree}% ${radiusThree}% / ${radiusFour}% ${radiusTwo}% ${100 - radiusTwo}% ${100 - radiusFour}%`;
    
    const blobStyle = `border-radius: ${borderRadius}; 
                      height: ${blobHeight}px; 
                      width: ${blobWidth}px; 
                      background: ${gradient};`;
    
    document.querySelector(".blob").style.cssText = blobStyle;
    outputCode.value = `.custom-blob {\n  ${blobStyle.replace(/;/g, ";\n  ")}\n}`;
}

function applyPreset(preset) {
    switch(preset) {
        case "circle":
            sliders[0].value = 50;
            sliders[1].value = 50;
            sliders[2].value = 50;
            sliders[3].value = 50;
            break;
        case "oval":
            sliders[0].value = 70;
            sliders[1].value = 70;
            sliders[2].value = 70;
            sliders[3].value = 70;
            inputs[0].value = 150;
            inputs[1].value = 250;
            break;
        case "teardrop":
            sliders[0].value = 70;
            sliders[1].value = 70;
            sliders[2].value = 30;
            sliders[3].value = 30;
            break;
        case "random":
            sliders[0].value = Math.floor(Math.random() * 100);
            sliders[1].value = Math.floor(Math.random() * 100);
            sliders[2].value = Math.floor(Math.random() * 100);
            sliders[3].value = Math.floor(Math.random() * 100);
            inputs[0].value = Math.floor(Math.random() * 200) + 100;
            inputs[1].value = Math.floor(Math.random() * 200) + 100;
            colorInputs[0].value = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            colorInputs[1].value = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            break;
    }
    
    // Update slider value displays
    sliders.forEach((slider, index) => {
        sliderValues[index].textContent = `${slider.value}%`;
    });
    
    createBlob();
}

function downloadBlob() {
    const blob = document.querySelector(".blob");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Set canvas dimensions
    canvas.width = blob.offsetWidth * 2;
    canvas.height = blob.offsetHeight * 2;
    
    // Get computed style
    const style = window.getComputedStyle(blob);
    const borderRadius = style.borderRadius;
    const background = style.background;
    
    // Draw blob on canvas
    ctx.scale(2, 2);
    
    // Create path with the same border radius
    const radii = borderRadius.split(" ");
    ctx.beginPath();
    
    // Draw custom shape based on border-radius
    const width = blob.offsetWidth;
    const height = blob.offsetHeight;
    
    // This is a simplified version - for perfect results you'd need to parse the border-radius properly
    ctx.moveTo(radii[0], 0);
    ctx.lineTo(width - radii[1], 0);
    ctx.quadraticCurveTo(width, 0, width, radii[1]);
    ctx.lineTo(width, height - radii[2]);
    ctx.quadraticCurveTo(width, height, width - radii[2], height);
    ctx.lineTo(radii[3], height);
    ctx.quadraticCurveTo(0, height, 0, height - radii[3]);
    ctx.lineTo(0, radii[0]);
    ctx.quadraticCurveTo(0, 0, radii[0], 0);
    
    ctx.closePath();
    
    // Create gradient
    const gradient = background.includes("linear-gradient") 
        ? createLinearGradient(ctx, background, width, height)
        : createRadialGradient(ctx, background, width, height);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Convert to PNG and download
    const link = document.createElement("a");
    link.download = "blob.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function createLinearGradient(ctx, background, width, height) {
    const matches = background.match(/linear-gradient\((.+)\)/);
    if (!matches) return background;
    
    const direction = matches[1].split(",")[0].trim();
    const colors = matches[1].split(",").slice(1).map(c => c.trim());
    
    let gradient;
    switch(direction) {
        case "to right":
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            break;
        case "to bottom":
            gradient = ctx.createLinearGradient(0, 0, 0, height);
            break;
        case "to bottom right":
            gradient = ctx.createLinearGradient(0, 0, width, height);
            break;
        case "to bottom left":
            gradient = ctx.createLinearGradient(width, 0, 0, height);
            break;
        default:
            return background;
    }
    
    colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
    });
    
    return gradient;
}

function createRadialGradient(ctx, background, width, height) {
    const matches = background.match(/radial-gradient\((.+)\)/);
    if (!matches) return background;
    
    const colors = matches[1].split(",").slice(1).map(c => c.trim());
    const radius = Math.max(width, height) / 2;
    
    const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        radius
    );
    
    colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
    });
    
    return gradient;
}
















// let outputCode = document.getElementById("css-code");

// let sliders = document.querySelectorAll("input[type='range']");
// sliders.forEach(function(slider){
//     slider.addEventListener("input",createBlob);
// });

// let inputs = document.querySelectorAll("input[type='number']");
// inputs.forEach(function(inp){
//     inp.addEventListener("change",createBlob);
// });


// function createBlob(){

//     let radiusOne = sliders[0].value;
//     let radiusTwo = sliders[1].value;
//     let radiusThree = sliders[2].value;
//     let radiusFour= sliders[3].value;

//     let blobHeight = inputs[0].value;
//     let blobWidth = inputs[1].value;

//      /*
//     border-radius: horizontal-top-left horizontal-top-right horizontal-bottom-right horizontal-bottom-left / vertical-top-left vertical-top-right vertical-bottom-right vertical-bottom-left;

//     */

//     let borderRadius = `${radiusOne}% ${100 - radiusOne}% ${100-radiusThree}% ${radiusThree}% / ${radiusFour}% ${radiusTwo}% ${100 - radiusTwo}% ${100 - radiusFour}%`;

//     let blobStyle = `border-radius: ${borderRadius}; height:${blobHeight}px; width:${blobWidth}px;`;

//     document.querySelector(".blob").style.cssText = blobStyle;

//     outputCode.value = blobStyle;

// }

// document.getElementById("copy").addEventListener("click",function(){
 
//     navigator.clipboard.writeText(outputCode.value).then(function(){
//         alert("Code is Copied");
//     });
// });

// createBlob();