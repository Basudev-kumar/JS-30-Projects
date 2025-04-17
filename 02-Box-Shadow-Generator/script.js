// const elem = document.getElementById("element");
// const code = document.getElementById("code");
// const sliders = document.querySelectorAll(".sliders input");

// sliders.forEach((slider) => slider.addEventListener("input",generateShadow));

// function generateShadow(){

//     const shadowParams = getShadowParams();
//     const boxShadow = createBoxShadow(...shadowParams);
//     applyShadow(elem,boxShadow);
//     upadateCode(boxShadow);
   
// }


// function getShadowParams(){

//     const hShadow = parseInt(document.getElementById("h-shadow").value);
//     const vShadow = parseInt(document.getElementById("v-shadow").value);
//     const blurRadius = parseInt(document.getElementById("blur-radius").value);
//     const spreadRadius = parseInt(document.getElementById("spread-radius").value);
//     const shadowColor = document.getElementById("shadow-color").value;
//     const shadowColorOpacity = parseFloat(document.getElementById("shadow-color-opacity").value).toFixed(1);

//     const shadowInset = document.getElementById("shadow-inset").checked;

//     return [hShadow,vShadow,blurRadius,spreadRadius,shadowColor,shadowColorOpacity,shadowInset]

// }

// function createBoxShadow(hShadow,vShadow,blurRadius,spreadRadius,color,opacity,inset){

//     const shadow = inset ? "inset" : "";
//     const rgbaColor = hexToRgba(color,opacity);

//     return `${shadow} ${hShadow}px ${vShadow}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;

// }

// function hexToRgba(color,opacity){   ///  #ffee22

//     const r = parseInt(color.substr(1,2), 16);
//     const g = parseInt(color.substr(3,2), 16);
//     const b = parseInt(color.substr(5,2), 16);

//     return `rgba(${r},${g},${b},${opacity})`;

// }

// function applyShadow(element,boxShadow){
//     element.style.boxShadow = boxShadow;
// }

// function upadateCode(text){
//     code.textContent = `box-Shadow: ${text}`;
// }

// function copyCode(){
//     const codeText = code.textContent;
//     navigator.clipboard.writeText(codeText)
//         .then(()=>{
//             alert("Code Copied to Clipboard");
//         });
// }



// window.onload = generateShadow;








document.addEventListener('DOMContentLoaded', function() {
    const elem = document.getElementById("element");
    const code = document.getElementById("code");
    const copyBtn = document.getElementById("copy-btn");
    const sliders = document.querySelectorAll(".sliders input");
    const colorInputs = document.querySelectorAll(".color-controls input");
    const presetButtons = document.querySelectorAll(".preset-buttons button");
    
    // Initialize display values
    updateDisplayValue('h-shadow');
    updateDisplayValue('v-shadow');
    updateDisplayValue('blur-radius');
    updateDisplayValue('spread-radius');
    updateDisplayValue('shadow-color-opacity');
    
    // Set up event listeners
    sliders.forEach(slider => slider.addEventListener("input", function() {
        updateDisplayValue(this.id);
        generateShadow();
    }));
    
    colorInputs.forEach(input => input.addEventListener("input", generateShadow));
    
    presetButtons.forEach(button => {
        button.addEventListener("click", function() {
            applyPreset(this.dataset.preset);
        });
    });
    
    copyBtn.addEventListener("click", copyCode);
    
    // Initial generation
    generateShadow();
    
    function updateDisplayValue(id) {
        const input = document.getElementById(id);
        const displayElement = document.getElementById(`${id}-value`);
        
        if (displayElement) {
            if (id === 'shadow-color-opacity') {
                displayElement.textContent = parseFloat(input.value).toFixed(1);
            } else {
                displayElement.textContent = `${input.value}px`;
            }
        }
    }
    
    function generateShadow() {
        const shadowParams = getShadowParams();
        const boxShadow = createBoxShadow(...shadowParams);
        applyShadow(elem, boxShadow);
        updateCode(boxShadow);
    }
    
    function getShadowParams() {
        const hShadow = parseInt(document.getElementById("h-shadow").value);
        const vShadow = parseInt(document.getElementById("v-shadow").value);
        const blurRadius = parseInt(document.getElementById("blur-radius").value);
        const spreadRadius = parseInt(document.getElementById("spread-radius").value);
        const shadowColor = document.getElementById("shadow-color").value;
        const shadowColorOpacity = parseFloat(document.getElementById("shadow-color-opacity").value).toFixed(1);
        const shadowInset = document.getElementById("shadow-inset").checked;
        
        return [hShadow, vShadow, blurRadius, spreadRadius, shadowColor, shadowColorOpacity, shadowInset];
    }
    
    function createBoxShadow(hShadow, vShadow, blurRadius, spreadRadius, color, opacity, inset) {
        const shadow = inset ? "inset" : "";
        const rgbaColor = hexToRgba(color, opacity);
        
        return `${shadow} ${hShadow}px ${vShadow}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;
    }
    
    function hexToRgba(color, opacity) {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        
        return `rgba(${r},${g},${b},${opacity})`;
    }
    
    function applyShadow(element, boxShadow) {
        element.style.boxShadow = boxShadow;
    }
    
    function updateCode(text) {
        code.value = `box-shadow: ${text};`;
    }
    
    function copyCode() {
        code.select();
        code.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(code.value)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
    
    function applyPreset(presetValue) {
        elem.style.boxShadow = presetValue;
        code.value = `box-shadow: ${presetValue};`;
        
        // Parse the preset value to update sliders (simplified)
        // Note: This is a basic implementation and might not work with all preset formats
        const parts = presetValue.split(/\s+/);
        
        if (parts.includes('inset')) {
            document.getElementById("shadow-inset").checked = true;
            parts.splice(parts.indexOf('inset'), 1);
        } else {
            document.getElementById("shadow-inset").checked = false;
        }
        
        if (parts.length >= 4) {
            document.getElementById("h-shadow").value = parseInt(parts[0]);
            document.getElementById("v-shadow").value = parseInt(parts[1]);
            document.getElementById("blur-radius").value = parseInt(parts[2]);
            document.getElementById("spread-radius").value = parseInt(parts[3]);
            
            updateDisplayValue('h-shadow');
            updateDisplayValue('v-shadow');
            updateDisplayValue('blur-radius');
            updateDisplayValue('spread-radius');
        }
    }
});