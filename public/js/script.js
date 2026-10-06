// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Auto-dismiss flash alerts after 5 seconds (matches CSS progress bar)
document.querySelectorAll('.alert-wl').forEach(alertEl => {
  setTimeout(() => {
    const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
    bsAlert.close();
  }, 5000);
});

// Sticky navbar scroll shadow
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('main-navbar');
  if (navbar) {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Category filter horizontal scrolling
const filters = document.getElementById('filters');
const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');

if (filters && scrollLeftBtn && scrollRightBtn) {
  scrollLeftBtn.addEventListener('click', () => {
      filters.scrollBy({ left: -200, behavior: 'smooth' });
  });

  scrollRightBtn.addEventListener('click', () => {
      filters.scrollBy({ left: 200, behavior: 'smooth' });
  });
}

// ── Listing Cards Interactive Behaviors ──

// In-card multi-image gallery carousel
function initListingCardCarousels() {
  document.querySelectorAll('.listing-card-media').forEach((mediaEl) => {
    const totalImages = parseInt(mediaEl.dataset.totalImages || '1', 10);
    if (totalImages <= 1) return;

    let currentIndex = 0;
    const images = mediaEl.querySelectorAll('.listing-card-img');
    const dots = mediaEl.querySelectorAll('.listing-dot');
    const prevBtn = mediaEl.querySelector('.listing-carousel-btn.prev');
    const nextBtn = mediaEl.querySelector('.listing-carousel-btn.next');

    function updateCarousel(newIdx) {
      if (newIdx < 0) newIdx = totalImages - 1;
      if (newIdx >= totalImages) newIdx = 0;
      currentIndex = newIdx;
      mediaEl.dataset.currentIndex = currentIndex;

      images.forEach((img, idx) => {
        img.classList.toggle('is-active', idx === currentIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateCarousel(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateCarousel(currentIndex + 1);
      });
    }
  });
}

// Listing card wishlist interaction & persistence
function initListingWishlist() {
  const WISHLIST_KEY = 'staynest_wishlist_ids';
  
  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveWishlist(ids) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    } catch {}
  }

  const savedIds = new Set(getWishlist());

  // Mark already-liked cards
  document.querySelectorAll('.listing-wishlist-btn').forEach((btn) => {
    const id = btn.dataset.listingId;
    if (id && savedIds.has(id)) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-label', 'Remove from wishlist');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const currentSaved = new Set(getWishlist());
      const listingId = btn.dataset.listingId;
      if (!listingId) return;

      if (currentSaved.has(listingId)) {
        currentSaved.delete(listingId);
        btn.classList.remove('is-active');
        btn.setAttribute('aria-label', 'Save to wishlist');
      } else {
        currentSaved.add(listingId);
        btn.classList.add('is-active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
      }

      saveWishlist(Array.from(currentSaved));
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initListingCardCarousels();
  initListingWishlist();
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initListingCardCarousels();
  initListingWishlist();
}