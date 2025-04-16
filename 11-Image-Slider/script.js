let currentSlide = 0;
const totalSlides = 4;

const dots = document.querySelectorAll(".dot-container button");
const images = document.querySelectorAll(".image-container img");

function updateSlide(newIndex){

    images[currentSlide].classList.remove("active");
    currentSlide = newIndex;
    images[currentSlide].classList.add("active");

    updateIndicator(currentSlide);

}

function updateIndicator(index){
    dots.forEach(dot=>{
        dot.style.backgroundColor = "transparent";
    });

    dots[index].style.backgroundColor = "#8052ec";
}

function next(){
    const newIndex = (currentSlide + 1) % totalSlides;
    updateSlide(newIndex);
}

function prev(){
    const newIndex = (currentSlide -1 + totalSlides) % totalSlides;
    updateSlide(newIndex);
}


updateSlide(0);