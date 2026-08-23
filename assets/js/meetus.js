(function () {
  function initMeetUsVideos() {
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


    // Toggle the profile and pubimg reveal state for the given container
    function toggleReveal(container) {
      const profile = container.querySelector('.trainee-profile-hoverable');
      const pubImg = container.querySelector('.trainee-pubimg');

      if (profile) {
        profile.classList.toggle('revealed');
      }
      if (pubImg) {
        pubImg.classList.toggle('visible');
      }
    }

    // Reveal toggle: delegated click handler for left/right arrows
    document.addEventListener('click', function (e) {
      const arrow = e.target.closest('.trainee-arrow-left, .trainee-arrow-right');
      if (!arrow) return;

      arrow.style.cursor = 'pointer';
      const container = arrow.closest('.trainee-container');
      if (!container) return;

      toggleReveal(container);
    });

    // Track the currently hovered profile so we only trigger on entry
    let activeProfile = null;

    // Delegate mouseover: play a profile's video when hovered
    document.addEventListener('mouseover', function (e) {
      if (!e.target.closest) return;
      const profile = e.target.closest('.trainee-profile-hoverable');
      if (!profile || profile === activeProfile) return;

      activeProfile = profile;
      const index = profile.getAttribute('data-trainee-index');
      if (index === null) return;

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

    // Delegate touchend: play a profile's video on touch
    document.addEventListener('touchend', function (e) {
      if (!e.target.closest) return;
      const profile = e.target.closest('.trainee-profile-hoverable');
      if (!profile) return;

      const index = profile.getAttribute('data-trainee-index');
      if (index === null) return;

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeetUsVideos);
  } else {
    initMeetUsVideos();
  }
})();
