// Fullscreen image viewer functionality
function openFullscreen(imgElement) {
  const descriptionText = imgElement.closest('.about__container').querySelector('.about__description').innerHTML;

  const overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';

  const imageContainer = document.createElement('div');
  imageContainer.className = 'fullscreen-image-container';

  const fullscreenImg = document.createElement('img');
  fullscreenImg.src = imgElement.src;
  fullscreenImg.className = 'fullscreen-image';
  fullscreenImg.alt = imgElement.alt;

  const descriptionDiv = document.createElement('div');
  descriptionDiv.className = 'fullscreen-description';
  descriptionDiv.innerHTML = descriptionText;

  const closeBtn = document.createElement('div');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = function(e) {
    e.stopPropagation();
    closeFullscreen(overlay);
  };

  imageContainer.appendChild(fullscreenImg);
  overlay.appendChild(imageContainer);
  overlay.appendChild(descriptionDiv);
  overlay.appendChild(closeBtn);

  overlay.onclick = function(e) {
    if (e.target === overlay || e.target === imageContainer) {
      closeFullscreen(overlay);
    }
  };

  document.body.appendChild(overlay);
  document.body.classList.add('no-scroll');

  const escHandler = function(e) {
    if (e.key === 'Escape') {
      closeFullscreen(overlay);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function closeFullscreen(overlay) {
  overlay.style.animation = 'fadeIn 0.3s ease reverse';
  setTimeout(() => {
    overlay.remove();
    document.body.classList.remove('no-scroll');
  }, 300);
}

// Expandable content functionality
document.addEventListener("DOMContentLoaded", function() {
  const expandableBtns = document.querySelectorAll(".services__button");

  expandableBtns.forEach((btn) => {
    // Store original text content
    const originalText = btn.textContent.trim();

    btn.addEventListener("click", () => {
      // Find the parent qualification__data element
      const parentData = btn.closest(".qualification__data");
      const expandable = parentData.querySelector(".services__expandable");

      if (!expandable) return;

      // Check if this is currently active
      const isActive = btn.classList.contains("active");

      // Close all other expandable sections first
      expandableBtns.forEach((otherBtn) => {
        const otherParent = otherBtn.closest(".qualification__data");
        const otherExpandable = otherParent.querySelector(".services__expandable");
        if (otherExpandable && otherExpandable !== expandable) {
          otherExpandable.classList.remove("active");
          otherBtn.classList.remove("active");
          // Restore original text for other buttons
          const otherOriginalText = otherBtn.getAttribute("data-original-text") || "View More";
          otherBtn.childNodes[0].textContent = otherOriginalText + " ";
        }
      });

      // Toggle current section
      if (isActive) {
        expandable.classList.remove("active");
        btn.classList.remove("active");
        // Restore original text when closing
        const storedText = btn.getAttribute("data-original-text") || "View More";
        btn.childNodes[0].textContent = storedText + " ";
      } else {
        expandable.classList.add("active");
        btn.classList.add("active");
        // Store original text if not already stored
        if (!btn.hasAttribute("data-original-text")) {
          btn.setAttribute("data-original-text", originalText);
        }
        // Change text to "Close"
        btn.childNodes[0].textContent = "Close ";
        // Add clicked class for persistent color
        btn.classList.add("clicked");
      }
    });
  });
});