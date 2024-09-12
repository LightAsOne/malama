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
    document.getElementById("countdown-timer").innerHTML = 
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
}, 1000);
