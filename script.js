/* Aurienne — static behaviours (vanilla JS) */
(function () {
  "use strict";

  var WHATSAPP = "923001234567";

  /* ---------- Intro overlay ---------- */
  var intro = document.getElementById("intro");
  if (intro) {
    window.setTimeout(function () {
      intro.classList.remove("opacity-100");
      intro.classList.add("pointer-events-none", "opacity-0");
      intro.setAttribute("aria-hidden", "true");
    }, 2200);
  }

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector("header");
  var menuPanel = document.getElementById("mobile-menu");
  var menuBtn = document.querySelector('[aria-label="Open menu"]');
  var menuOpen = false;

  function paintHeader() {
    if (!header) return;
    var solid = window.scrollY > 24 || menuOpen;
    header.classList.toggle("bg-transparent", !solid);
    header.classList.toggle("bg-background/90", solid);
    header.classList.toggle("shadow-navigation", solid);
    header.classList.toggle("backdrop-blur-xl", solid);
  }
  window.addEventListener("scroll", paintHeader, { passive: true });
  paintHeader();

  function setMenu(open) {
    menuOpen = open;
    if (menuPanel) {
      menuPanel.classList.toggle("invisible", !open);
      menuPanel.classList.toggle("scale-y-95", !open);
      menuPanel.classList.toggle("opacity-0", !open);
      menuPanel.classList.toggle("visible", open);
      menuPanel.classList.toggle("scale-y-100", open);
      menuPanel.classList.toggle("opacity-100", open);
    }
    paintHeader();
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenu(!menuOpen);
    });
  }
  if (menuPanel) {
    menuPanel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenu(false);
      });
    });
  }

  /* ---------- Product search ---------- */
  var search = document.querySelector('[aria-label="Search products"]');
  var products = Array.prototype.slice.call(
    document.querySelectorAll("#collection article")
  );
  if (search) {
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      products.forEach(function (card) {
        var match = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
        card.style.display = match ? "" : "none";
      });
    });
  }

  /* ---------- WhatsApp ordering ---------- */
  function orderMessage(name, price, notes) {
    return [
      "Hello! I would like to order:",
      "",
      "Product: " + name,
      "Price: " + price,
      "Notes: " + notes,
      "Quantity: 1",
      "",
      "Please provide the available delivery and payment details.",
    ].join("\n");
  }
  function openWhatsApp(text) {
    window.open(
      "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text),
      "_blank"
    );
  }
  document.querySelectorAll("button").forEach(function (btn) {
    var label = (btn.textContent || "").toLowerCase();
    var aria = (btn.getAttribute("aria-label") || "").toLowerCase();
    if (label.indexOf("whatsapp") === -1 && aria.indexOf("whatsapp") === -1) return;
    btn.addEventListener("click", function () {
      var card = btn.closest("article");
      if (card) {
        var name = card.querySelector("h3");
        var ps = card.querySelectorAll("p");
        var price = card.querySelector(".font-display.text-2xl");
        openWhatsApp(
          orderMessage(
            name ? name.textContent.trim() : "Aurienne fragrance",
            price ? price.textContent.trim() : "",
            ps.length ? ps[ps.length - 1].textContent.trim() : ""
          )
        );
        return;
      }
      openWhatsApp("Hello Aurienne! I would like to ask about your fragrances.");
    });
  });

  /* ---------- Testimonials ---------- */
  var testimonials = [
    {
      quote:
        "Beautiful, elegant and unforgettable. Velvet Dawn became my evening signature instantly.",
      name: "Mina R.",
      location: "Doha",
    },
    {
      quote: "The discovery set feels like opening a private wardrobe of moods.",
      name: "Amara K.",
      location: "London",
    },
    {
      quote:
        "Quietly luxurious. People notice the fragrance before they notice the bottle.",
      name: "Sofia N.",
      location: "Karachi",
    },
    {
      quote:
        "Refined, modern, and never loud. Exactly what I wanted from a signature scent.",
      name: "Leila S.",
      location: "Dubai",
    },
  ];
  var quoteEl = document.getElementById("testimonial-quote");
  var authorEl = document.getElementById("testimonial-author");
  var index = 0;

  function renderTestimonial() {
    var t = testimonials[index];
    if (quoteEl) quoteEl.textContent = "\u201C" + t.quote + "\u201D";
    if (authorEl) authorEl.textContent = t.name + " \u00B7 " + t.location;
  }
  function step(delta) {
    index = (index + delta + testimonials.length) % testimonials.length;
    renderTestimonial();
  }
  var prev = document.querySelector('[aria-label="Previous testimonial"]');
  var next = document.querySelector('[aria-label="Next testimonial"]');
  if (prev) prev.addEventListener("click", function () { step(-1); });
  if (next) next.addEventListener("click", function () { step(1); });
  if (quoteEl) {
    window.setInterval(function () { step(1); }, 5200);
  }

  /* ---------- Newsletter forms ---------- */
  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input ? input.value : "");
      var note = form.querySelector("[data-note]");
      if (!note) {
        note = document.createElement("p");
        note.setAttribute("data-note", "");
        note.className = "text-sm text-muted-foreground";
        form.appendChild(note);
      }
      note.textContent = valid
        ? "You are on the private list."
        : "Enter a valid email address.";
      if (valid && input) input.value = "";
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal-card");
  if (reveals.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href").slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
