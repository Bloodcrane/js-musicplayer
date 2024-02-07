document.addEventListener('DOMContentLoaded', function() {
    const jsmediatags = window.jsmediatags;

    document.querySelector("#input").addEventListener("change", (event) => {
        const audio = event.target.files[0];
        const song = new Audio();
        const songStatus = document.getElementById('songStatus');
        const playButton = document.querySelector('.playBtn');
        const stopButton = document.querySelector('.stopBtn');
        const loopButton = document.querySelector('.loopBtn');
    
        let isPlaying = false
    
        jsmediatags.read(audio, {
            onSuccess: function(tag) { 
        
            // Array buffer to base64
            const data = tag.tags.picture.data;
            const format = tag.tags.picture.format;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
                base64String += String.fromCharCode(data[i]);
            }
        
            // Output media tags
            document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
            
            document.querySelector("#title").textContent = tag.tags.title;
            document.querySelector("#artist").textContent = tag.tags.artist;
            document.querySelector("#album").textContent = tag.tags.album;
            document.querySelector("#genre").textContent = tag.tags.genre;
            song.src = URL.createObjectURL(audio);
            },
            onError: function(error) {
                console.log(error);
            }
        });  

        function playSong() {
            isPlaying = !isPlaying
            if (isPlaying){
                songStatus.textContent = "[Playing]"
                
                song.play();
            } else {
                songStatus.textContent = "[Paused]"
                song.pause();
            }
        }
    
        function stopSong() {
            songStatus.textContent = "No songs playing.";
            song.pause();
            song.currentTime = 0; // Reset audio to the beginning
        }
    
        function loopSong() {
            songStatus.textContent = "[Looping]";
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
});
