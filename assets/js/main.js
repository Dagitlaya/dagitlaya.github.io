// Fix DOM matches function
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

// Get Scroll position
function getScrollPos() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

  var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
  var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

  return { x: x, y: y };
}

var _scrollTimer = [];

// Smooth scroll
function smoothScrollTo(y, time) {
  time = time == undefined ? 500 : time;

  var scrollPos = getScrollPos();
  var count = 60;
  var length = (y - scrollPos.y);

  function easeInOut(k) {
    return .5 * (Math.sin((k - .5) * Math.PI) + 1);
  }

  for (var i = _scrollTimer.length - 1; i >= 0; i--) {
    clearTimeout(_scrollTimer[i]);
  }

  for (var i = 0; i <= count; i++) {
    (function() {
      var cur = i;
      _scrollTimer[cur] = setTimeout(function() {
        window.scrollTo(
          scrollPos.x,
          scrollPos.y + length * easeInOut(cur/count)
        );
      }, (time / count) * cur);
    })();
  }
}

// Scroll-reveal: fade sections/cards in as they enter the viewport
(function() {
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.scroll-reveal');

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything if IntersectionObserver isn't supported
      revealElements.forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // Animate only once
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
})();

// Parallax scrolling effect
(function() {
  var parallaxBg = document.querySelector('.parallax-background');

  if (!parallaxBg) return;

  var parallaxSpeed = 0.5; // Background moves at 50% of scroll speed

  function updateParallax() {
    var scrollPos = getScrollPos();
    // Use negative value so background moves opposite to scroll direction
    // This creates the parallax effect where background appears to move slower
    var yPos = -(scrollPos.y * parallaxSpeed);
    parallaxBg.style.transform = 'translateY(' + yPos + 'px)';
  }
  
  // Use requestAnimationFrame for smooth performance
  var ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial position
  updateParallax();
})();

// Animated banner logo: use the transparent WebM video when the connection
// is fast enough, otherwise keep the static image fallback.
(function() {
  var logoWrap = document.querySelector('.banner-logo');

  if (!logoWrap) return;

  var video = logoWrap.querySelector('.banner-logo-video');

  if (!video) return;

  function isFastEnough() {
    // Network Information API is not supported everywhere (e.g. Firefox, older Safari).
    // If unavailable, play it safe and keep the static image.
    if (!navigator.connection) return false;

    var conn = navigator.connection;

    // Respect the user's data-saver preference.
    if (conn.saveData === true) return false;

    // Only use the video on a fast '4g' connection.
    if (conn.effectiveType && conn.effectiveType !== '4g') return false;

    // Require at least 1.5 Mbps if the browser reports a downlink speed.
    if (typeof conn.downlink === 'number' && conn.downlink < 1.5) return false;

    return true;
  }

  function initBannerVideo() {
    if (!isFastEnough()) return;

    // Mark the container active so CSS swaps image -> video.
    logoWrap.classList.add('active');

    // Add the 'autoplay' attribute only when actually switching to video.
    video.setAttribute('autoplay', '');

    video.addEventListener('canplay', function() {
      var playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(function() {
          // Autoplay was blocked; fall back to the static image.
          logoWrap.classList.remove('active');
        });
      }
    });

    video.addEventListener('error', function() {
      // WebM failed to load; fall back to the static image.
      logoWrap.classList.remove('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBannerVideo);
  } else {
    initBannerVideo();
  }
})();

