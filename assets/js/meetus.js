(function () {
  // Detect WebP support
  // function webpSupported() {
  //   try {
  //     return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  //   } catch (e) {
  //     return false;
  //   }
  // }

  // // Swap images to JPG if WebP not supported
  // if (!webpSupported()) {
  //   document.querySelectorAll('img[data-jpg-src]').forEach(function (img) {
  //     img.src = img.getAttribute('data-jpg-src');
  //   });
  // }

  // Helper function to play video when ready
  function playWhenReady(video) {
    if (video.readyState >= 3) {
      video.play().catch(function (error) {
        console.log('Video autoplay failed:', error);
      });
    } else {
      video.addEventListener('canplay', function onCanPlay() {
        video.removeEventListener('canplay', onCanPlay);
        video.play().catch(function (error) {
          console.log('Video autoplay failed:', error);
        });
      });
    }
  }

  // Helper function to stop all videos except the one with the given index
  function stopAllVideos(excludeIndex) {
    document.querySelectorAll('.trainee-media-container').forEach(function (container) {
      const containerIndex = container.id.replace('media-container-', '');
      if (containerIndex === excludeIndex) return;
      container.classList.remove('playing');
      const video = container.querySelector('video');
      if (video) {
        video.pause();
      }
    });
  }
  document.querySelectorAll('.trainee-profile-hoverable').forEach(function (profile) {
    profile.addEventListener('mouseenter', function () {
      const index = this.getAttribute('data-trainee-index');
      stopAllVideos(index);
      const container = document.getElementById('media-container-' + index);
      const video = document.getElementById('video-' + index);

      // Play the media on hover
      if (video) {
        video.onended = function () {
          video.style.transition = 'opacity 2s ease';
          video.style.opacity = '0';
          setTimeout(function () {
            video.style.display = 'none';
          }, 2000);
        };
        playWhenReady(video);
        container.classList.add('playing');
      }
    });

    profile.addEventListener('mouseleave', function () {
      const index = this.getAttribute('data-trainee-index');
      const container = document.getElementById('media-container-' + index);
      const video = document.getElementById('video-' + index);

      // Pause the media on mouse leave
      // if (video) {
      //   video.pause();
      // }
      // container.classList.remove('playing');
    });

    profile.addEventListener('touchend', function () {
      const index = this.getAttribute('data-trainee-index');
      stopAllVideos(index);
      const container = document.getElementById('media-container-' + index);
      const video = document.getElementById('video-' + index);

      // Play the media on touch
      if (video) {
        video.onended = function () {
          video.style.transition = 'opacity 0.5s ease';
          video.style.opacity = '0';
          setTimeout(function () {
            video.style.display = 'none';
          }, 500);
        };
        playWhenReady(video);
        container.classList.add('playing');
      }
    });
  });
})();