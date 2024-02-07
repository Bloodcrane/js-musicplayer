document.addEventListener('DOMContentLoaded', function() {
    const jsmediatags = window.jsmediatags;
    let song = new Audio();
    const songStatus = document.getElementById('songStatus');
    const playButton = document.querySelector('.playBtn');
    const stopButton = document.querySelector('.stopBtn');
    const loopButton = document.querySelector('.loopBtn');
    let isPlaying = false;

    document.querySelector("#input").addEventListener("change", (event) => {
        const audio = event.target.files[0];
        isPlaying = false; // Reset isPlaying when a new song is selected
        stopSong(); // Stop the old song

        // Reset output media tags
        document.querySelector("#cover").style.backgroundImage = 'none';
        document.querySelector("#title").textContent = '';
        document.querySelector("#artist").textContent = '';
        document.querySelector("#album").textContent = '';
        document.querySelector("#genre").textContent = '';

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
                    }
                    if (tag.tags.artist) {
                        document.querySelector("#artist").textContent = tag.tags.artist;
                    }
                    if (tag.tags.album) {
                        document.querySelector("#album").textContent = tag.tags.album;
                    }
                    if (tag.tags.genre) {
                        document.querySelector("#genre").textContent = tag.tags.genre;
                    }
                }
                song = new Audio(URL.createObjectURL(audio)); // Create a new audio object with the new song
            },
            onError: function(error) {
                console.log(error);
            }
        });
    });

    function playSong() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            songStatus.textContent = "[Playing]";
            song.play();
        } else {
            songStatus.textContent = "[Paused]";
            song.pause();
        }
    }

    function stopSong() {
        songStatus.textContent = "No songs playing.";
        song.pause();
        song.currentTime = 0; // Reset audio to the beginning
    }

    function loopSong() {
        if (isPlaying) {
            songStatus.textContent = "[Playing] & [Looping]";
        } else {
            songStatus.textContent = "[Paused] & [Looping enabled]";
        }
        song.loop = true;
        song.play();
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
