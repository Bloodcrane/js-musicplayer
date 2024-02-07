document.addEventListener('DOMContentLoaded', function() {

    const audio = new Audio('Lotus Flower.mp3');
    const songStatus = document.getElementById('songStatus');
    const playButton = document.querySelector('.playBtn');
    const stopButton = document.querySelector('.stopBtn');
    const loopButton = document.querySelector('.loopBtn');

    function playSong() {
        songStatus.textContent = "[Playing]"
        audio.play();
    }

    function stopSong() {
        songStatus.textContent = "No songs playing.";
        audio.pause();
        audio.currentTime = 0; // Reset audio to the beginning
    }

    function loopSong() {
        songStatus.textContent = "[Looping]";
        audio.loop = true;
        audio.play();
    }

    if (playButton) {
        playButton.addEventListener("click", playSong);
    }

    if (stopButton) {
        stopButton.addEventListener("click", stopSong);
    }

    if (loopButton) {
        loopButton.addEventListener("click", loopSong);
    }
});
