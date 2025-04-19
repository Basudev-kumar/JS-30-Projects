document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const slideIcons = document.querySelectorAll('.slide-icon');
    const numberOfSlides = slides.length;
    let slideNumber = 0;
    
    // Play video of active slide and pause others
    function playActiveVideo() {
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (index === slideNumber) {
                video.play().catch(e => console.log("Video play error:", e));
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
    
    // Next slide
    function nextSlide() {
        slides[slideNumber].classList.remove('active');
        slideIcons[slideNumber].classList.remove('active');
        
        slideNumber = (slideNumber + 1) % numberOfSlides;
        
        slides[slideNumber].classList.add('active');
        slideIcons[slideNumber].classList.add('active');
        slider.style.transform = `translateX(-${slideNumber * (100 / numberOfSlides)}%)`;
        
        playActiveVideo();
    }
    
    // Previous slide
    function prevSlide() {
        slides[slideNumber].classList.remove('active');
        slideIcons[slideNumber].classList.remove('active');
        
        slideNumber = (slideNumber - 1 + numberOfSlides) % numberOfSlides;
        
        slides[slideNumber].classList.add('active');
        slideIcons[slideNumber].classList.add('active');
        slider.style.transform = `translateX(-${slideNumber * (100 / numberOfSlides)}%)`;
        
        playActiveVideo();
    }
    
    // Click on slide icons
    slideIcons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            slides[slideNumber].classList.remove('active');
            slideIcons[slideNumber].classList.remove('active');
            
            slideNumber = index;
            
            slides[slideNumber].classList.add('active');
            slideIcons[slideNumber].classList.add('active');
            slider.style.transform = `translateX(-${slideNumber * (100 / numberOfSlides)}%)`;
            
            playActiveVideo();
        });
    });
    
    // Button events
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto slide
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    // Resume auto slide when mouse leaves
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Initialize by playing the first video
    playActiveVideo();
});