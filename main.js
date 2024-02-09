document.addEventListener('DOMContentLoaded', function() {
    const jsmediatags = window.jsmediatags;
    let song = new Audio();
    const songStatus = document.getElementById('songStatus');
    const playButton = document.querySelector('.playBtn');
    const stopButton = document.querySelector('.stopBtn');
    const loopButton = document.querySelector('.loopBtn');
    const timer = document.getElementById('timer');
    const songSlider = document.getElementById('songSlider');
    let isPlaying = false;
    let animationFrameId;

    // Update timer and slider
    function updateTimer() {
        const currentTime = formatTime(song.currentTime);
        const duration = formatTime(song.duration);
        timer.textContent = `${currentTime} / ${duration}`;
        songSlider.value = song.currentTime;
        songSlider.max = song.duration;

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(updateTimer);
        }
    }

    // Format time in MM:SS format
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Change song time when slider is moved
    songSlider.addEventListener('input', function() {
        song.currentTime = this.value;
    });

    // Play the song
    function playSong() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playButton.style.backgroundColor='#1db954';
            song.play();
            animationFrameId = requestAnimationFrame(updateTimer);
            // Update current song
            document.title = `JSPlayer - ${document.querySelector("#title").textContent} by ${document.querySelector("#artist").textContent}`;
        } else {
            playButton.style.backgroundColor='#b47171';
            song.pause();
            cancelAnimationFrame(animationFrameId);
            // Reset title when paused
            document.title = "JSPlayer";
        }
    }

    // Stop the song
    function stopSong() {
        song.pause();
        song.currentTime = 0; // Reset audio to the beginning
        isPlaying = false;
        cancelAnimationFrame(animationFrameId);
    }

    // Loop the song
    function loopSong() {
        song.loop = !song.loop;
        if (song.loop) {
            loopButton.style.backgroundColor='#1db954';
        } else {
            loopButton.style.backgroundColor='#b47171';
        }
    }

    // Event listeners for buttons
    if (playButton) {
        playButton.addEventListener("click", playSong);
    }

    if (stopButton) {
        stopButton.addEventListener("click", stopSong);
    }

    if (loopButton) {
        loopButton.addEventListener("click", loopSong);
    }

    // File input change event
    document.querySelector("#input").addEventListener("change", (event) => {
        const audio = event.target.files[0];
        isPlaying = false; // Reset isPlaying when a new song is selected
        stopSong(); // Stop the old song

        // Reset output media tags
        document.querySelector("#cover").style.backgroundImage = 'none';
        document.querySelector("#title").textContent = '';
        document.querySelector("#artist").textContent = '';
        document.querySelector("#album").textContent = '';

        jsmediatags.read(audio, {
            onSuccess: function(tag) {
                if (tag && tag.tags) {
                    if (tag.tags.picture && tag.tags.picture.data && tag.tags.picture.format) {
                        // Array buffer to base64
                        const data = tag.tags.picture.data;
                        const format = tag.tags.picture.format;
                        let base64String = "";
                        for (let i = 0; i < data.length; i++) {
                            base64String += String.fromCharCode(data[i]);
                        }

                        // Output media tags
                        document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
                    }
                    if (tag.tags.title) {
                        document.querySelector("#title").textContent = tag.tags.title;
                    } else { document.querySelector("#title").textContent = audio.name; }
                    if (tag.tags.artist) {
                        document.querySelector("#artist").textContent = tag.tags.artist;
                    } else { document.querySelector("#artist").textContent = "Unknown Artist"; }
                    if (tag.tags.album) {
                        document.querySelector("#album").textContent = tag.tags.album;
                    } else { document.querySelector("#album").textContent = "Unknown Album"; }
                }
                song = new Audio(URL.createObjectURL(audio)); // Create a new audio object with the new song
            },
            onError: function(error) {
                document.querySelector("#cover").style.backgroundImage = './icons/nocover.png';
                document.querySelector("#title").textContent = audio.name;
                document.querySelector("#artist").textContent = "Unknown Artist";
                document.querySelector("#album").textContent = "Unknown Album";
                song = new Audio(URL.createObjectURL(audio));
            }
        });
    });
});
