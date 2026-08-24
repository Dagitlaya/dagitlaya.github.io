(function () {
  function initMeetUsVideos() {
    // Make sure the browser is actually fetching this video before playing.
    // Videos start with preload="none" until the lazy loader requests metadata.
    function ensureVideoLoaded(video) {
      if (video.readyState >= 3) return; // enough data buffered to play
      video.setAttribute('data-video-loaded', '1'); // tells lazy loader: already handled
      video.preload = 'auto';
      video.load();
    }

    // Helper function to play video when ready
    function playWhenReady(video) {
      ensureVideoLoaded(video);

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

    // Lazy-load each video's metadata only as it approaches the viewport.
    // The page renders many profiles at once; letting every video fetch data
    // on page load saturates the browser's per-origin connection limit (worst
    // on GitHub Pages), so the video you jump to via the TOC never gets data.
    // Full video data is fetched on hover via ensureVideoLoaded().
    function initLazyVideoLoading() {
      var videos = document.querySelectorAll('.trainee-media-container video');
      if (!videos.length) return;

      // Older browsers without IntersectionObserver: fall back to today's
      // behavior (metadata for every video, no full downloads).
      if (!('IntersectionObserver' in window)) {
        for (var i = 0; i < videos.length; i++) {
          videos[i].preload = 'metadata';
        }
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (!entry.isIntersecting) continue;
          var video = entry.target;
          if (video.getAttribute('data-video-loaded')) continue;
          video.setAttribute('data-video-loaded', '1');
          video.preload = 'metadata'; // cheap range request; full data on hover
          video.load();
          observer.unobserve(video);
        }
      }, {
        rootMargin: '600px 0px 600px 0px',
        threshold: 0
      });

      for (var i = 0; i < videos.length; i++) {
        videos[i].preload = 'none';
        observer.observe(videos[i]);
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

    // Start lazy-loading videos only as they approach the viewport.
    initLazyVideoLoading();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeetUsVideos);
  } else {
    initMeetUsVideos();
  }
})();
