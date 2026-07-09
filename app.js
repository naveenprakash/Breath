/**
 * Breath Interactivity & Animation Engine (MPA Edition)
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Navigation Background Color Shift on Scroll ---
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('bg-brandBg/95', 'shadow-lg', 'border-white/10');
        header.classList.remove('bg-brandBg/80', 'border-white/5');
      } else {
        header.classList.remove('bg-brandBg/95', 'shadow-lg', 'border-white/10');
        header.classList.add('bg-brandBg/80', 'border-white/5');
      }
    });
  }

  // --- Mobile Drawer Navigation Menu Controls ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    function openMobileMenu() {
      mobileMenu.classList.remove('hidden');
      // Force browser reflow to trigger CSS animations smoothly
      mobileMenu.offsetHeight; 
      mobileMenu.classList.add('opacity-100', 'translate-y-0');
      mobileMenu.classList.remove('opacity-0', '-translate-y-2');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
      mobileMenu.classList.add('opacity-0', '-translate-y-2');
      mobileMenu.classList.remove('opacity-100', 'translate-y-0');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      
      // Wait for animation transitions to finish before completely hiding the container
      setTimeout(() => {
        if (mobileMenuBtn.getAttribute('aria-expanded') === 'false') {
          mobileMenu.classList.add('hidden');
        }
      }, 300);
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile drawer when user taps outside the navbar area
    document.addEventListener('click', (e) => {
      const insideNavbar = e.target.closest('header');
      if (!insideNavbar && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
      }
    });

    // Close mobile menu when links are clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // --- Smooth Scroll Anchor Fallback ---
  // If loaded with a hash in URL (e.g. index.html#features), scroll smoothly to it
  if (window.location.hash) {
    const targetHash = window.location.hash.substring(1);
    const targetEl = document.getElementById(targetHash);
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }

  // --- Screenshot Carousel / Slider Logic (Conditional on page structure) ---
  const slidesContainer = document.getElementById('carousel-slides');
  
  if (slidesContainer) {
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoplayTimer = null;

    function updateCarousel() {
      // Slide container translation
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Dots highlight
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('bg-brandTeal', 'w-5');
          dot.classList.remove('bg-white/20', 'w-2.5');
        } else {
          dot.classList.remove('bg-brandTeal', 'w-5');
          dot.classList.add('bg-white/20', 'w-2.5');
        }
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    // Button triggers
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
      
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    // Bullet indicators click trigger
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        currentSlide = idx;
        updateCarousel();
        resetAutoplay();
      });
    });

    // Autoplay functionality (pauses when user hovers or grabs the device)
    function startAutoplay() {
      if (autoplayTimer === null) {
        autoplayTimer = setInterval(nextSlide, 5000);
      }
    }

    function stopAutoplay() {
      if (autoplayTimer !== null) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Hover states to pause/resume autoplay
    const frameContainer = slidesContainer.closest('.relative');
    if (frameContainer) {
      frameContainer.addEventListener('mouseenter', stopAutoplay);
      frameContainer.addEventListener('mouseleave', startAutoplay);
    }

    // --- Mobile Touch Swiping Gestures Support for Carousel ---
    let touchStartX = 0;
    let touchEndX = 0;

    slidesContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    slidesContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
      startAutoplay();
    }, { passive: true });

    function handleSwipeGesture() {
      const swipeThreshold = 50; // Minimum pixels to register as swipe
      const difference = touchStartX - touchEndX;

      if (difference > swipeThreshold) {
        // Swiped Left -> Load next screen
        nextSlide();
      } else if (difference < -swipeThreshold) {
        // Swiped Right -> Load previous screen
        prevSlide();
      }
    }

    // Initial runs
    updateCarousel();
    startAutoplay();
  }

  // Smooth scroll trigger for home page local hashes (e.g. #features)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Push hash state to URL cleanly without page jump
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });

});
