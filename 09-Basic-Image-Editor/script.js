// DOM Elements
const filterA = document.getElementById("blur");
const filterB = document.getElementById("contrast");
const filterC = document.getElementById("hue-rotate");
const filterD = document.getElementById("sepia");
const filterE = document.getElementById("brightness");

const noFlipBtn = document.getElementById("no-flip");
const flipXBtn = document.getElementById("flip-x");
const flipYBtn = document.getElementById("flip-y");

const uploadButton = document.getElementById("upload-button");
const image = document.getElementById("chosen-image");
const imagePlaceholder = document.getElementById("image-placeholder");
const downloadButton = document.getElementById("download-button");
const resetButton = document.getElementById("reset-button");
const randomButton = document.getElementById("random-button");
const rotateLeftBtn = document.getElementById("rotate-left");
const rotateRightBtn = document.getElementById("rotate-right");
const rotationInput = document.getElementById("rotation");
const presetButtons = document.querySelectorAll(".preset-btn");

// State
let currentRotation = 0;

// Initialize the editor
function initEditor() {
    resetFilter();
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Range sliders
    const sliders = document.querySelectorAll(".filter input[type='range']");
    sliders.forEach(slider => {
        slider.addEventListener("input", addFilter);
        slider.addEventListener("input", showRangeValue);
    });

    // Flip buttons
    const radioBtns = document.querySelectorAll(".flip-option input[type='radio']");
    radioBtns.forEach(radioBtn => {
        radioBtn.addEventListener("change", flipImage);
    });

    // Upload button
    uploadButton.addEventListener("change", handleImageUpload);

    // Download button
    downloadButton.addEventListener("click", downloadImage);

    // Reset button
    resetButton.addEventListener("click", resetFilter);

    // Random button
    randomButton.addEventListener("click", randomizeFilters);

    // Rotation controls
    rotateLeftBtn.addEventListener("click", () => rotateImage(-90));
    rotateRightBtn.addEventListener("click", () => rotateImage(90));
    rotationInput.addEventListener("input", updateRotation);

    // Preset buttons
    presetButtons.forEach(button => {
        button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });
}

// Handle image upload
function handleImageUpload() {
    resetFilter();
    imagePlaceholder.style.display = "none";
    image.style.display = "block";
    
    const reader = new FileReader();
    reader.onloadstart = () => {
        // Show loading spinner if needed
    };
    reader.onload = () => {
        image.setAttribute("src", reader.result);
        downloadButton.disabled = false;
    };
    reader.readAsDataURL(uploadButton.files[0]);
}

// Apply all filters to the image
function addFilter() {
    image.style.filter = `
        blur(${filterA.value}px) 
        contrast(${filterB.value}%) 
        hue-rotate(${filterC.value}deg) 
        sepia(${filterD.value}%) 
        brightness(${filterE.value}%)
    `;
}

// Update range value displays
function showRangeValue() {
    document.getElementById("blur-value").textContent = `${filterA.value}px`;
    document.getElementById("contrast-value").textContent = `${filterB.value}%`;
    document.getElementById("hue-rotate-value").textContent = `${filterC.value}°`;
    document.getElementById("sepia-value").textContent = `${filterD.value}%`;
    document.getElementById("brightness-value").textContent = `${filterE.value}%`;
}

// Flip the image based on selected option
function flipImage() {
    let transform = `rotate(${currentRotation}deg)`;
    
    if (flipXBtn.checked) {
        transform += " scaleX(-1)";
    } else if (flipYBtn.checked) {
        transform += " scaleY(-1)";
    }
    
    image.style.transform = transform;
}

// Rotate the image
function rotateImage(degrees) {
    currentRotation += degrees;
    if (currentRotation >= 360) currentRotation -= 360;
    if (currentRotation < 0) currentRotation += 360;
    rotationInput.value = currentRotation;
    flipImage(); // This will apply the rotation with the current flip state
}

// Update rotation from input
function updateRotation() {
    currentRotation = parseInt(rotationInput.value) || 0;
    flipImage();
}

// Reset all filters to default
function resetFilter() {
    filterA.value = "0";
    filterB.value = "100";
    filterC.value = "0";
    filterD.value = "0";
    filterE.value = "100";
    
    noFlipBtn.checked = true;
    currentRotation = 0;
    rotationInput.value = "0";
    
    addFilter();
    flipImage();
    showRangeValue();
}

// Randomize all filters
function randomizeFilters() {
    filterA.value = Math.floor(Math.random() * 5);
    filterB.value = Math.floor(Math.random() * 150) + 50;
    filterC.value = Math.floor(Math.random() * 360);
    filterD.value = Math.floor(Math.random() * 100);
    filterE.value = Math.floor(Math.random() * 100) + 50;
    
    // Random flip
    const flipOptions = [noFlipBtn, flipXBtn, flipYBtn];
    const randomFlip = flipOptions[Math.floor(Math.random() * flipOptions.length)];
    randomFlip.checked = true;
    
    // Random rotation
    currentRotation = Math.floor(Math.random() * 360);
    rotationInput.value = currentRotation;
    
    addFilter();
    flipImage();
    showRangeValue();
}

// Apply preset filters
function applyPreset(presetName) {
    switch(presetName) {
        case "vintage":
            filterA.value = "0.5";
            filterB.value = "90";
            filterC.value = "30";
            filterD.value = "60";
            filterE.value = "110";
            break;
        case "blackwhite":
            filterA.value = "0";
            filterB.value = "120";
            filterC.value = "0";
            filterD.value = "100";
            filterE.value = "90";
            break;
        case "warm":
            filterA.value = "0";
            filterB.value = "110";
            filterC.value = "30";
            filterD.value = "30";
            filterE.value = "110";
            break;
        case "cool":
            filterA.value = "0.3";
            filterB.value = "110";
            filterC.value = "200";
            filterD.value = "0";
            filterE.value = "110";
            break;
    }
    
    noFlipBtn.checked = true;
    currentRotation = 0;
    rotationInput.value = "0";
    
    addFilter();
    flipImage();
    showRangeValue();
}

// Download the edited image
function downloadImage() {
    if (!image.src) return;
    
    // Show loading state
    downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    downloadButton.disabled = true;
    
    setTimeout(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        img.onload = () => {
            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply transformations
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentRotation * Math.PI / 180);
            
            // Apply flip
            let scaleX = 1, scaleY = 1;
            if (flipXBtn.checked) scaleX = -1;
            if (flipYBtn.checked) scaleY = -1;
            ctx.scale(scaleX, scaleY);
            
            // Draw image
            ctx.filter = image.style.filter;
            ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            ctx.restore();
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'pixelperfect-edited-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Reset button state
            downloadButton.innerHTML = '<i class="fas fa-download"></i> Download Image';
            downloadButton.disabled = false;
        };
        
        img.src = image.src;
    }, 100);
}

// Initialize the editor when the page loads
window.addEventListener('DOMContentLoaded', initEditor);































// const filterA = document.getElementById("blur");
// const filterB = document.getElementById("contrast");
// const filterC = document.getElementById("hue-rotate");
// const filterD = document.getElementById("sepia");

// const noFlipBtn = document.getElementById("no-flip");
// const flipXBtn = document.getElementById("flip-x");
// const flipYBtn = document.getElementById("flip-y");

// const uploadButton = document.getElementById("upload-button");
// const image = document.getElementById("chosen-image");
// const downloadButton = document.getElementById("download-button");

// function resetFilter(){

//     filterA.value = "0";
//     filterB.value = "100";
//     filterC.value = "0";
//     filterD.value = "0";
//     noFlipBtn.checked = true;

//     addFilter();
//     flipImage();
// }

// uploadButton.onchange = ()=>{
//     resetFilter();
//     document.querySelector(".image-container").style.display = "block";
//     const reader = new FileReader();
//     reader.readAsDataURL(uploadButton.files[0]);
//     reader.onload = ()=>{
//         image.setAttribute("src",reader.result);
//     }
// }

// const sliders = document.querySelectorAll(".filter input[type='range']");
// sliders.forEach(slider=>{
//     slider.addEventListener("input",addFilter);
//     slider.addEventListener("input",showRangeValue);
// });

// function addFilter(){
//     image.style.filter = `blur(${filterA.value}px) contrast(${filterB.value}%) hue-rotate(${filterC.value}deg) sepia(${filterD.value}%)`;
// }

// function showRangeValue(){
//         const rangeValues = document.querySelectorAll(".range-value");
//         sliders.forEach((slider,index)=>{
//             rangeValues[index].textContent = `${slider.value}%`;
//         });
// }

// const radioBtns = document.querySelectorAll(".flip-option input[type='radio']");
// radioBtns.forEach(radioBtn =>{
//     radioBtn.addEventListener("click",flipImage);
// });


// function flipImage(){
//    if(flipXBtn.checked){
//         image.style.transform = "scaleX(-1)"
//    }else if(flipYBtn.checked){
//         image.style.transform = "scaleY(-1)"
//    }else{
//          image.style.transform = "scale(1,1)"
//    } 
// }

// downloadButton.onclick = ()=>{
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext("2d");
//     const img = new Image();
//     img.src = image.src;
//     img.onload = ()=>{
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.filter = image.style.filter;
//         ctx.translate(canvas.width/2,canvas.height/2);
//         if(flipXBtn.checked){
//             ctx.scale(-1,1);
//         }else if(flipYBtn.checked){
//             ctx.scale(1,-1);
//         }
//         ctx.drawImage(img,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
//         const link = document.createElement('a');
//         link.download = 'edited-image.png';
//         link.href = canvas.toDataURL();
//         link.click();
//     }
    
// };

// resetFilter();