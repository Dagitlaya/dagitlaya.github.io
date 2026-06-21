
(function() {
// Helper function to stop all videos
function stopAllVideos() {
document.querySelectorAll('.trainee-media-container').forEach(function(container) {
container.classList.remove('playing');
const video = container.querySelector('video');
const animatedWebp = container.querySelector('img.animated-webp');
if (video) {
video.pause();
video.currentTime = 0;
}
if (animatedWebp) {
animatedWebp.style.display = 'none';
}
});
}

document.querySelectorAll('.trainee-profile-hoverable').forEach(function(profile) {
profile.addEventListener('mouseenter', function() {
stopAllVideos();
const index = this.getAttribute('data-trainee-index');
const container = document.getElementById('media-container-' + index);
const video = document.getElementById('video-' + index);
const animatedWebp = document.getElementById('animated-webp-' + index);

// Play the media on hover
if (video) {
video.play().catch(function(error) {
console.log('Video autoplay failed:', error);
});
container.classList.add('playing');
} else if (animatedWebp) {
animatedWebp.style.display = 'block';
container.classList.add('playing');
}
});

profile.addEventListener('mouseleave', function() {
const index = this.getAttribute('data-trainee-index');
const container = document.getElementById('media-container-' + index);
const video = document.getElementById('video-' + index);
const animatedWebp = document.getElementById('animated-webp-' + index);

// Pause and reset the media on mouse leave
if (video) {
video.pause();
video.currentTime = 0;
}
container.classList.remove('playing');
if (animatedWebp) {
animatedWebp.style.display = 'none';
}
});

profile.addEventListener('touchend', function() {
stopAllVideos();
const index = this.getAttribute('data-trainee-index');
const container = document.getElementById('media-container-' + index);
const video = document.getElementById('video-' + index);
const animatedWebp = document.getElementById('animated-webp-' + index);

// Play the media on touch
if (video) {
video.play().catch(function(error) {
console.log('Video autoplay failed:', error);
});
container.classList.add('playing');
} else if (animatedWebp) {
animatedWebp.style.display = 'block';
container.classList.add('playing');
}
});
});
})();