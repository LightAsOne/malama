// Set the target date and time (12:00 PM on November 1st, 2024)
const targetDate = new Date("November 1, 2024 12:00:00").getTime();

const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown-timer").innerHTML = "The light is revealed!";
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Display the countdown
    document.getElementById("days").innerHTML = String(days).padStart(2, '0');
    document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerHTML = String(seconds).padStart(2, '0');
}, 1000);
let currentIndex = 1; // Start with the middle video

const videos = [
    "https://www.youtube.com/embed/jlXVFzqLQ0",// Cancel after first upload
	"https://www.youtube.com/embed/jlXVFzqLQ0s",
	
	
    
];

const videoElements = document.querySelectorAll('.carousel-window iframe');

// Function to update the carousel videos
function updateCarousel() {
    videoElements[0].src = videos[currentIndex - 1] || "";
    videoElements[1].src = videos[currentIndex] || "";
    videoElements[2].src = videos[currentIndex + 1] || "";
}

// Scroll up functionality
document.getElementById('scroll-up').addEventListener('click', function() {
    if (currentIndex > 1) {
        currentIndex--;
        updateCarousel();
    }
});

// Scroll down functionality
document.getElementById('scroll-down').addEventListener('click', function() {
    if (currentIndex < videos.length - 2) {
        currentIndex++;
        updateCarousel();
    }
});

// Initial update for the carousel
updateCarousel();
