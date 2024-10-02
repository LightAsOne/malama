// JavaScript: script.js

// Set the target date and time (12:00 PM on November 1, 2024)
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

// Video Configuration
let videos = [
    "https://www.youtube.com/embed/jlXVFzqLQ0s", // Day 1 Video
    "https://www.youtube.com/embed/vx8yoBPKBs4",
	
    // Add more video links as days progress
];

// Current day index starts at the latest video
let currentIndex = videos.length - 1;

// Function to update video elements and navigation visibility
function updateVideoContent() {
    const leftVideo = document.querySelector('.left-video');
    const centerVideo = document.querySelector('.center-video');
    const rightVideo = document.querySelector('.right-video');
    const leftButton = document.getElementById('scroll-left');
    const rightButton = document.getElementById('scroll-right');
    const navLabels = document.querySelectorAll('.nav-label');

    // Update the visibility of buttons and labels based on available videos
    if (currentIndex === 0) {
        leftButton.style.display = 'none'; // Hide left button on first day
        navLabels[0].style.display = 'none'; // Hide "Previous Day" label
    } else {
        leftButton.style.display = 'inline-block';
        navLabels[0].style.display = 'inline-block';
    }

    if (currentIndex === videos.length - 1) {
        rightButton.style.display = 'none'; // Hide right button on latest day
        navLabels[1].style.display = 'none'; // Hide "Next Day" label
    } else {
        rightButton.style.display = 'inline-block';
        navLabels[1].style.display = 'inline-block';
    }

    // Set the video sources
    leftVideo.src = currentIndex > 0 ? videos[currentIndex - 1] : ''; // Previous day's video
    centerVideo.src = videos[currentIndex]; // Current day's video
    rightVideo.src = currentIndex < videos.length - 1 ? videos[currentIndex + 1] : ''; // Next day's video if available
}

// Initial video update
updateVideoContent();

// Scroll left functionality to view older videos
document.getElementById('scroll-left').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--; // Move to the previous day
        updateVideoContent();
    }
});

// Scroll right functionality to view newer videos
document.getElementById('scroll-right').addEventListener('click', () => {
    if (currentIndex < videos.length - 1) {
        currentIndex++; // Move to the next day
        updateVideoContent();
    }
});
