(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  // Both conditions are passed so the handler always fires: a single non-exhaustive
  // condition never invokes gsap.matchMedia()'s callback when it evaluates to false.
  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      fullMotion: "(prefers-reduced-motion: no-preference)"
    },
    function (context) {
      if (context.conditions.reduceMotion) {
        gsap.set(
          ".hero-pill-badge, .hero-title, .hero-subtitle, .hero-search-box, .quick-tag-btn",
          { autoAlpha: 1 }
        );
        return;
      }

      buildHeroTimeline();
      buildSectionHeaderReveals();
      buildStatCounters();
      buildBatchReveal(".destinations-grid .destination-card", { grid: "auto" });
      buildBatchReveal(".featured-stays-grid .featured-card", { grid: "auto" });
      buildMoodSection();
      buildBatchReveal(".pillars-grid .pillar-card", { grid: "auto" });
      buildBatchReveal(".testimonials-grid .testimonial-card", { grid: "auto" });
      buildDbmsSpotlight();
      buildLabGlow();
      buildSimpleReveal(".host-cta-card");
      buildSimpleReveal(".faq-wrapper");
      buildSimpleReveal(".cta-bottom-banner");
      buildMagneticButtons();
      buildScrollIndicator();
      refreshOnLazyImages();
    }
  );

  function buildHeroTimeline() {
    var tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(".hero-pill-badge", { y: -16 }, { autoAlpha: 1, y: 0, duration: 0.5 })
      .fromTo(".hero-title", { y: -16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(".hero-subtitle", { y: -16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.35")
      .fromTo(".hero-search-box", { y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(
        ".quick-tag-btn",
        { y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05 },
        "-=0.25"
      );
  }

  function buildSectionHeaderReveals() {
    document.querySelectorAll(".section-header").forEach(function (header) {
      gsap.from(header, {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: header, start: "top 85%", once: true }
      });
    });
  }

  function buildStatCounters() {
    document.querySelectorAll(".stat-value").forEach(function (el) {
      var text = el.textContent.trim();
      var match = text.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
      if (!match) return;

      var numStr = match[1];
      var suffix = match[2];
      var isDecimal = numStr.indexOf(".") !== -1;
      var target = parseFloat(numStr.replace(/,/g, ""));
      var proxy = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: function () {
          gsap.to(proxy, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent =
                (isDecimal ? proxy.val.toFixed(2) : Math.round(proxy.val).toLocaleString("en-IN")) +
                suffix;
            }
          });
        }
      });
    });
  }

  function buildBatchReveal(selector, staggerOverrides) {
    if (!document.querySelector(selector)) return;

    ScrollTrigger.batch(selector, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(
          batch,
          { autoAlpha: 0, y: 16, scale: 0.92 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: Object.assign({ each: 0.06, from: "start" }, staggerOverrides || {})
          }
        );
      }
    });
  }

  // Mood panels: a simple fade-up entrance for the filmstrip (all widths),
  // plus — desktop only — the section pins in place and page scroll drives
  // the filmstrip sideways past the viewport (scrubbed to the scrollbar, so
  // it reverses cleanly on scroll-up). matchMedia handles killing/reverting
  // the pin automatically if the viewport crosses back under the breakpoint.
  function buildMoodSection() {
    var pin = document.querySelector("#moodPin");
    var track = document.querySelector("#moodPanels");
    if (!pin || !track) return;

    gsap.fromTo(
      track,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: pin, start: "top 85%", once: true }
      }
    );

    // Below 992px landing.css keeps .mood-pin as a plain native
    // overflow-x:auto scroller (works with zero JS). Above it, take over:
    // suppress the native scrollbar for the duration and drive the same
    // element via a scroll-scrubbed transform instead. matchMedia reverts
    // this (native scroll back on, tween/pin killed) if the viewport
    // crosses back under the breakpoint.
    var moodMM = gsap.matchMedia();
    moodMM.add("(min-width: 992px)", function () {
      pin.scrollLeft = 0;
      pin.style.overflowX = "hidden";

      var distance = track.scrollWidth - pin.clientWidth;
      if (distance <= 0) {
        pin.style.overflowX = "";
        return;
      }

      var scrollTween = gsap.to(track, {
        x: function () {
          return -(track.scrollWidth - pin.clientWidth);
        },
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top+=80",
          end: function () {
            return "+=" + (track.scrollWidth - pin.clientWidth);
          },
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      return function () {
        if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
        scrollTween.kill();
        gsap.set(track, { clearProps: "transform" });
        pin.style.overflowX = "";
      };
    });
  }

  function buildDbmsSpotlight() {
    var section = document.querySelector(".lab-spotlight-section");
    if (!section) return;

    var codeLines = section.querySelectorAll(".code-line");

    var tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: section, start: "top 75%", once: true }
    });

    tl.from(".lab-badge", { autoAlpha: 0, y: 16, duration: 0.4 })
      .from(".lab-title", { autoAlpha: 0, y: 20, duration: 0.5 }, "-=0.2")
      .from(".lab-desc", { autoAlpha: 0, y: 16, duration: 0.5 }, "-=0.3")
      .from(".lab-feature-pill", { autoAlpha: 0, y: 12, duration: 0.4, stagger: 0.08 }, "-=0.25")
      .from(".lab-preview-card", { autoAlpha: 0, y: 24, scale: 0.96, duration: 0.5 }, "-=0.35")
      .from(codeLines, { autoAlpha: 0, x: -12, duration: 0.3, stagger: 0.06 }, "-=0.2")
      .fromTo(
        section,
        { boxShadow: "0 0 0 0px rgba(74, 222, 128, 0), 0 12px 32px rgba(20, 24, 31, 0.14)" },
        {
          boxShadow: "0 0 0 3px rgba(74, 222, 128, 0.45), 0 12px 32px rgba(20, 24, 31, 0.14)",
          duration: 0.4,
          repeat: 3,
          yoyo: true
        }
      );
  }

  function buildSimpleReveal(selector) {
    var el = document.querySelector(selector);
    if (!el) return;

    gsap.from(el, {
      autoAlpha: 0,
      y: 24,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true }
    });
  }

  function buildMagneticButtons() {
    var buttons = document.querySelectorAll(
      ".btn-hero-search, .lab-spotlight-section .btn-submit, .cta-btn-white"
    );
    var maxOffset = 8;

    buttons.forEach(function (btn) {
      btn.style.willChange = "transform";
      var xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3" });
      var yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3" });

      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - rect.left - rect.width / 2;
        var relY = e.clientY - rect.top - rect.height / 2;
        xTo(gsap.utils.clamp(-maxOffset, maxOffset, relX * 0.2));
        yTo(gsap.utils.clamp(-maxOffset, maxOffset, relY * 0.2));
      });

      btn.addEventListener("mouseleave", function () {
        xTo(0);
        yTo(0);
      });
    });
  }

  function buildScrollIndicator() {
    var indicator = document.getElementById("heroScrollIndicator");
    if (!indicator) return;

    // Fade in after hero timeline finishes
    gsap.fromTo(indicator, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 1.4, ease: "power2.out" });

    // Hide on scroll past hero
    ScrollTrigger.create({
      trigger: ".landing-hero",
      start: "bottom 80%",
      once: true,
      onEnter: function () {
        gsap.to(indicator, { autoAlpha: 0, y: 10, duration: 0.4, ease: "power2.in" });
      }
    });
  }

  function buildLabGlow() {
    var card = document.querySelector(".lab-preview-card[data-glow]");
    if (!card) return;

    // Pulse the ambient border glow
    gsap.to(card, {
      boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.1), 0 0 30px rgba(74,222,128,0.25), 0 0 60px rgba(74,222,128,0.1)",
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      scrollTrigger: { trigger: card, start: "top 80%" }
    });
  }

  function refreshOnLazyImages() {
    var refreshTimer = null;
    function scheduleRefresh() {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(function () {
        ScrollTrigger.refresh();
      }, 150);
    }

    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", scheduleRefresh, { once: true });
      }
    });
  }
})();
