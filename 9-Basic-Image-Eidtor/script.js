const filterA = document.getElementById("blur");
const filterB = document.getElementById("contrast");
const filterC = document.getElementById("hue-rotate");
const filterD = document.getElementById("sepia");

const noFlipBtn = document.getElementById("no-flip");
const flipXBtn = document.getElementById("flip-x");
const flipYBtn = document.getElementById("flip-y");

const uploadButton = document.getElementById("upload-button");
const image = document.getElementById("chosen-image");
const downloadButton = document.getElementById("download-button");

function resetFilter(){

    filterA.value = "0";
    filterB.value = "100";
    filterC.value = "0";
    filterD.value = "0";
    noFlipBtn.checked = true;

    addFilter();
    flipImage();
}

uploadButton.onchange = ()=>{
    resetFilter();
    document.querySelector(".image-container").style.display = "block";
    const reader = new FileReader();
    reader.readAsDataURL(uploadButton.files[0]);
    reader.onload = ()=>{
        image.setAttribute("src",reader.result);
    }
}

const sliders = document.querySelectorAll(".filter input[type='range']");
sliders.forEach(slider=>{
    slider.addEventListener("input",addFilter);
    slider.addEventListener("input",showRangeValue);
});

function addFilter(){
    image.style.filter = `blur(${filterA.value}px) contrast(${filterB.value}%) hue-rotate(${filterC.value}deg) sepia(${filterD.value}%)`;
}

function showRangeValue(){
        const rangeValues = document.querySelectorAll(".range-value");
        sliders.forEach((slider,index)=>{
            rangeValues[index].textContent = `${slider.value}%`;
        });
}

const radioBtns = document.querySelectorAll(".flip-option input[type='radio']");
radioBtns.forEach(radioBtn =>{
    radioBtn.addEventListener("click",flipImage);
});


function flipImage(){
   if(flipXBtn.checked){
        image.style.transform = "scaleX(-1)"
   }else if(flipYBtn.checked){
        image.style.transform = "scaleY(-1)"
   }else{
         image.style.transform = "scale(1,1)"
   } 
}

downloadButton.onclick = ()=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image.src;
    img.onload = ()=>{
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = image.style.filter;
        ctx.translate(canvas.width/2,canvas.height/2);
        if(flipXBtn.checked){
            ctx.scale(-1,1);
        }else if(flipYBtn.checked){
            ctx.scale(1,-1);
        }
        ctx.drawImage(img,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = canvas.toDataURL();
        link.click();
    }
    
};

resetFilter();