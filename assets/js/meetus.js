(function () {

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
    if (profile.dataset.bound) return;
    profile.dataset.bound = '1';
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

    // profile.addEventListener('mouseleave', function () {
    //   const index = this.getAttribute('data-trainee-index');
    //   const container = document.getElementById('media-container-' + index);
    //   const video = document.getElementById('video-' + index);

    //   // Pause the media on mouse leave
    //   // if (video) {
    //   //   video.pause();
    //   // }
    //   // container.classList.remove('playing');
    // });

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

  /* --- old-code:js ---
  // Original file ended here before reveal-toggle feature
  --- end-old-code --- */

  /* --- old-code:js ---
  // Reveal toggle: arrow click moves profile right/fades, shows pubimg
  document.querySelectorAll('.trainee-arrow-left').forEach(function (arrow) {
    if (arrow.dataset.bound) return;
    arrow.dataset.bound = '1';
    arrow.style.cursor = 'pointer';
    arrow.addEventListener('click', function () {
      var container = this.closest('.trainee-container');
      if (!container) return;

      var profile = container.querySelector('.trainee-profile-hoverable');
      var pubImg = container.querySelector('.trainee-pubimg');

      if (profile) {
        profile.classList.toggle('revealed');
      }
      if (pubImg) {
        pubImg.classList.toggle('visible');
      }
    });
  });
  --- end-old-code --- */

  /* --- old-code:js ---
  // Reveal toggle: delegated click handler (survives DOM replacement/bfcache)
  document.addEventListener('click', function (e) {
    var arrow = e.target.closest('.trainee-arrow-left');
    if (!arrow) return;

    arrow.style.cursor = 'pointer';
    var container = arrow.closest('.trainee-container');
    if (!container) return;

    var profile = container.querySelector('.trainee-profile-hoverable');
    var pubImg = container.querySelector('.trainee-pubimg');

    if (profile) {
      profile.classList.toggle('revealed');
    }
    if (pubImg) {
      pubImg.classList.toggle('visible');
    }
  });
  --- end-old-code --- */

  // Reveal toggle: delegated click handler for left/right arrows
  document.addEventListener('click', function (e) {
    var arrow = e.target.closest('.trainee-arrow-left, .trainee-arrow-right');
    if (!arrow) return;

    arrow.style.cursor = 'pointer';
    var container = arrow.closest('.trainee-container');
    if (!container) return;

    var profile = container.querySelector('.trainee-profile-hoverable');
    var pubImg = container.querySelector('.trainee-pubimg');

    if (profile) {
      profile.classList.toggle('revealed');
    }
    if (pubImg) {
      pubImg.classList.toggle('visible');
    }
  });
})();
