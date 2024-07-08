// JavaScript to handle the music previews

// Sample data for music previews
const musicPreviews = [
    { title: 'Song 1', file: 'song1.mp3' },
    { title: 'Song 2', file: 'song2.mp3' },
    { title: 'Song 3', file: 'song3.mp3' }
];

// Function to load music previews into the music list
function loadMusicPreviews() {
    const musicList = document.getElementById('music-list');
    musicPreviews.forEach(music => {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        
        const title = document.createElement('h3');
        title.textContent = music.title;
        
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = music.file;
        
        musicItem.appendChild(title);
        musicItem.appendChild(audio);
        musicList.appendChild(musicItem);
    });
}

// Event listener
document.addEventListener('DOMContentLoaded', loadMusicPreviews);
const previewAudios = document.querySelectorAll('.preview-audio');
previewAudios.forEach(audio => {
    audio.addEventListener('play', function() {
        const messageElement = audio.nextElementSibling;

        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.controls = false; // Disable audio controls
            if (messageElement && messageElement.classList.contains('preview-message')) {
                messageElement.style.display = 'block'; // Show the message
            }
        }, 30000); // Stop after 30,000 milliseconds (30 seconds)
    });
});
