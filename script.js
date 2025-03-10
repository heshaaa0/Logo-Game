let score = 0;
let timeLeft = 20;
let interval;
let gameInterval;

const startButton = document.getElementById('startButton');
const backButton = document.getElementById('backButton');
const restartButton = document.getElementById('restartButton');
const gameScreen = document.getElementById('gameScreen');
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const sausageArea = document.getElementById('sausageArea');
const finalScore = document.getElementById('finalScore');
const giftMessage = document.getElementById('giftMessage'); // New element for the gift message


const images = [
    "url('PNG/Anti Dandruff Shampoo.png')",
    "url('PNG/Anti Frizz Hair Gloss Serum.png')",
    "url('PNG/Damaged Repair Conditioner.png')",
    "url('PNG/Damaged Repair Shampoo.png')",
    "url('PNG/Hair Mask.png')",
    "url('PNG/Hydro Boost Conditioner.png')",
    "url('PNG/Hydro Boost Shampoo.png')",
    "url('PNG/Moisture Plus Conditioner.png')",
    "url('PNG/Anti Frizz Hair Gloss Serum.png')",
    "url('PNG/Ultra Strong Hair Styling Gel.png')", // Replace with actual image paths
    "url('toxic1.png')",
    "url('toxic2.png')",
    "url('toxic1.png')",
];

function preloadImages(imageUrls) {
    imageUrls.forEach((imageUrl) => {
        const img = new Image();
        img.src = imageUrl.replace("url('", "").replace("')", ""); // Remove url('') wrapper
    });
}

// Call preloadImages on window load
window.onload = function () {
    preloadImages(images);
    enterFullscreen();
};


const sausagesPositions = [];

function startGame() {
    score = 0;
    timeLeft = 20;
    scoreDisplay.textContent = 'Score: 0';
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    giftMessage.style.display = 'none'; // Hide gift message at the start

    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    endScreen.style.display = 'none';

    sausagesPositions.length = 0; // Reset positions array

    interval = setInterval(updateTimer, 1000);
    gameInterval = setInterval(showSausages, 1000);
}

function endGame() {
    clearInterval(interval);
    clearInterval(gameInterval);
    finalScore.textContent = score;
    gameScreen.style.display = 'none';
    endScreen.style.display = 'flex';

    setTimeout(() => {
        startScreen.style.display = 'flex'; // Show the start screen
        endScreen.style.display = 'none'; // Hide the end screen
        finalScore.textContent = '0'; // Reset final score display
    }, 10000);
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
        endGame();
    }

    if (timeLeft <= 5) {
        clearInterval(gameInterval);
        gameInterval = setInterval(showSausages, 200); // Spawn sausages every 0.2 seconds
    }
}

function showSausages() {
    const numberOfSausages = 20;
    for (let i = 0; i < numberOfSausages; i++) {
        createSausage();
    }
}

function createSausage() {
    const sausageWidth = 40;
    const sausageHeight = 40;

    // Random X position
    const randomX = Math.random() * (sausageArea.clientWidth - sausageWidth);

    // Check for overlaps
    if (!isOverlapping(randomX, -40, sausageWidth, sausageHeight)) {
        const sausage = document.createElement('div');
        sausage.classList.add('sausage');
        sausage.style.left = randomX + 'px';
        sausage.style.top = '-40px'; // Start just above the visible area
        sausage.style.backgroundImage = setSausageBG();

        sausageArea.appendChild(sausage);
        sausagesPositions.push({ x: randomX, y: -40, width: sausageWidth, height: sausageHeight }); // Add position

        // Set drop speed based on image type
        let dropSpeed = sausage.style.backgroundImage.includes('dfccbook.png') ? 20 : 12; // Faster for dfccbook
        let dropInterval = setInterval(() => {
            let currentTop = parseFloat(sausage.style.top);
            if (currentTop < sausageArea.clientHeight) {
                sausage.style.top = (currentTop + dropSpeed) + 'px'; // Drop the sausage
                // Update position in the array
                updatePosition(sausage, currentTop + dropSpeed);
            } else {
                clearInterval(dropInterval);
                sausage.remove(); // Remove the sausage if it goes out of the visible area
                removePosition(randomX); // Remove from positions array
            }
        }, 20); // Adjust this value for smoother or more responsive drops

        let isSliced = false;

        sausage.addEventListener('mousedown', (event) => {
            if (!isSliced) {
                sliceSausage(sausage);
                isSliced = true;
                clearInterval(dropInterval); // Stop the drop animation when sliced
                removePosition(randomX); // Remove from positions array when sliced
            }
        });
    }
}


function isOverlapping(x, y, width, height) {
    for (const pos of sausagesPositions) {
        if (x < pos.x + pos.width &&
            x + width > pos.x &&
            y < pos.y + pos.height &&
            y + height > pos.y) {
            return true; // There is an overlap
        }
    }
    return false; // No overlap
}

function updatePosition(sausage, newTop) {
    const randomX = parseFloat(sausage.style.left);
    const index = sausagesPositions.findIndex(pos => pos.x === randomX && pos.y < sausageArea.clientHeight);
    if (index !== -1) {
        sausagesPositions[index].y = newTop;
    }
}

function removePosition(randomX) {
    const index = sausagesPositions.findIndex(pos => pos.x === randomX);
    if (index !== -1) {
        sausagesPositions.splice(index, 1);
    }
}

function setSausageBG() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

function sliceSausage(sausage) {
    sausage.style.opacity = '0.7'; // Slightly dim the sausage for feedback

    setTimeout(() => {
        sausage.style.opacity = '1'; // Restore opacity after a brief moment
    }, 100);

    const sausageBackground = sausage.style.backgroundImage;

    // Check if the background image is one of the product images
    if (sausageBackground.includes('Anti Dandruff Shampoo.png') ||
        sausageBackground.includes('Anti Frizz Hair Gloss Serum.png') ||
        sausageBackground.includes('Damaged Repair Conditioner.png') ||
        sausageBackground.includes('Damaged Repair Shampoo.png') ||
        sausageBackground.includes('Hair Mask.png') ||
        sausageBackground.includes('Hydro Boost Conditioner.png') ||
        sausageBackground.includes('Hydro Boost Shampoo.png') ||
        sausageBackground.includes('Moisture Plus Conditioner.png') ||
        sausageBackground.includes('Ultra Strong Hair Styling Gel.png')) {

        score++; // Increment score for valid product images
        scoreDisplay.textContent = `Score: ${score}`;
    }

    sausage.classList.add('sliced'); // Add sliced class for animation

    setTimeout(() => {
        sausage.remove(); // Remove the sausage after the animation
    }, 500); // Match the timeout with the animation duration

    if (score === 20) {
        showGift();
    }
}

backButton.addEventListener('click', () => {
    window.location.href = 'https://miracle-kiosk-quiz.vercel.app/';  // Redirect to this URL
});

document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("background-video");
    const videoSource = "Video.mp4";

    // Preload video using fetch
    fetch(videoSource)
        .then(response => response.blob())
        .then(blob => {
            const videoURL = URL.createObjectURL(blob);
            video.src = videoURL;
            video.play();
            document.body.style.visibility = "visible";
        })
        .catch(error => console.error("Error preloading video:", error));
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

document.getElementById('homeButton').addEventListener('click', function () {
    endScreen.style.display = 'none';
    startScreen.style.display = 'block';
    finalScore.textContent = '0';
});

function showGift() {
    window.location.href = 'gift.html'; // Make sure this path is correct
}

sausage.addEventListener('click', (event) => {
    if (!isSliced) {
        sliceSausage(sausage);
        isSliced = true;
        clearInterval(dropInterval); // Stop the drop animation when sliced
        removePosition(randomX); // Remove from positions array when sliced
    }
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

window.onload = enterFullscreen;

