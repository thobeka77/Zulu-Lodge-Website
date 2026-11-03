/* Zulu Sunset Lodge — Part 3 JavaScript enhancements
   Client-side interactions and validation for this static educational website. */
"use strict";

const rooms = {
  luxury: { name: "Luxury Suite", price: 2200, rating: "4.8/5", image: "Images/luxury-suite.jpeg" },
  garden: { name: "Garden Villa", price: 3800, rating: "4.9/5", image: "Images/garden-villa.jpeg" },
  safari: { name: "Sunset Safari Villa", price: 4500, rating: "4.9/5", image: "Images/safari-villa.jpeg" },
  heritage: { name: "Heritage Deluxe Suite", price: 2600, rating: "4.7/5", image: "Images/heritage-suite.jpeg" },
  sunset: { name: "Sunset View Suite", price: 3200, rating: "4.8/5", image: "Images/sunset-view.jpeg" },
  pool: { name: "Private Pool Villa", price: 4800, rating: "5.0/5", image: "Images/pool-villa.jpeg" }
};

function money(value) {
  return "R " + Number(value || 0).toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

function selectRoom(key) {
  if (!rooms[key]) return;
  try { localStorage.setItem("zuluSelectedRoom", key); } catch (error) { /* storage may be disabled */ }
  window.location.href = "booking.html";
}

function getSelectedRoom() {
  try {
    const key = localStorage.getItem("zuluSelectedRoom") || "luxury";
    return rooms[key] || rooms.luxury;
  } catch (error) { return rooms.luxury; }
}

function readBooking() {
  try { return JSON.parse(localStorage.getItem("zuluBooking") || "{}"); }
  catch (error) { return {}; }
}
function saveBooking(booking) {
  try { localStorage.setItem("zuluBooking", JSON.stringify(booking)); }
  catch (error) { console.warn("Booking details could not be saved in this browser."); }
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-navigation");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", expanded ? "Open navigation menu" : "Close navigation menu");
      nav.classList.toggle("is-open", !expanded);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
    }));
  }
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.setAttribute("aria-current", "page");
      link.classList.add("active");
    }
  });
}

function setupBookingPage() {
  const form = document.getElementById("booking-form");
  const roomInput = document.getElementById("room-type");
  const image = document.getElementById("booking-room-image");
  if (!form || !roomInput || !image) return;

  const room = getSelectedRoom();
  const name = document.getElementById("booking-room-name");
  const rating = document.getElementById("booking-room-rating");
  const price = document.getElementById("booking-room-price");
  const guestInput = document.getElementById("guests");
  const nightsInput = document.getElementById("nights");
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const total = document.getElementById("booking-total");

  image.src = room.image;
  image.alt = room.name;
  if (name) name.textContent = room.name;
  if (rating) rating.textContent = "★★★★★ " + room.rating;
  if (price) price.textContent = money(room.price) + " per night";
  roomInput.value = room.name;

  const today = new Date();
  const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  if (checkin) checkin.min = todayString;
  if (checkout) checkout.min = checkin?.value || todayString;

  function updateTotal() {
    const nights = Math.max(1, Number(nightsInput?.value) || 1);
    const totalValue = room.price * nights;
    if (total) total.textContent = money(totalValue);
    const old = readBooking();
    saveBooking({ ...old, room: room.name, price: room.price, nights, guests: Math.max(1, Number(guestInput?.value) || 1), total: totalValue });
  }
  nightsInput?.addEventListener("input", updateTotal);
  guestInput?.addEventListener("input", updateTotal);
  checkin?.addEventListener("change", () => {
    if (checkout) {
      checkout.min = checkin.value || todayString;
      if (checkout.value && checkin.value && checkout.value <= checkin.value) checkout.value = "";
    }
  });
  checkout?.addEventListener("change", () => {
    if (checkin?.value && checkout.value) {
      const diff = Math.round((new Date(checkout.value) - new Date(checkin.value)) / 86400000);
      if (diff > 0 && nightsInput) nightsInput.value = String(Math.min(diff, 30));
      updateTotal();
    }
  });
  updateTotal();

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (checkin?.value && checkout?.value && checkout.value <= checkin.value) {
      checkout.setCustomValidity("Check-out must be after check-in.");
      checkout.reportValidity();
      checkout.setCustomValidity("");
      return;
    }
    const data = new FormData(form);
    const booking = readBooking();
    Object.assign(booking, {
      name: data.get("name"), email: data.get("email"), phone: data.get("phone"),
      checkin: data.get("checkin"), checkout: data.get("checkout"),
      guests: Number(data.get("guests")), requests: data.get("requests") || ""
    });
    saveBooking(booking);
    window.location.href = "payment.html";
  });
}

function setupPaymentPage() {
  const summary = document.getElementById("payment-summary");
  if (!summary) return;
  const booking = readBooking();
  if (!booking.room) {
    summary.innerHTML = '<p>No booking selected. <a href="rooms.html">Choose a room</a>.</p>';
    return;
  }
  summary.textContent = `${booking.room} — ${booking.guests || 1} guest(s), ${booking.nights || 1} night(s). Estimated total: ${money(booking.total)}.`;
  const form = document.getElementById("payment-form");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    // Demonstration only: no card details are processed and no real payment occurs.
    booking.paymentStatus = "Demo only — not paid";
    booking.reference = "DEMO-" + Math.floor(100000 + Math.random() * 900000);
    saveBooking(booking);
    window.location.href = "confirmation.html";
  });
}

function setupConfirmationPage() {
  const box = document.getElementById("confirmation-details");
  if (!box) return;
  const booking = readBooking();
  if (!booking.room) {
    box.textContent = "No booking details were found in this browser. Please start from the booking page.";
    return;
  }
  const rows = [
    ["Reference", booking.reference || "Pending"],
    ["Guest", booking.name || ""],
    ["Accommodation", booking.room],
    ["Check-in", booking.checkin || ""],
    ["Check-out", booking.checkout || ""],
    ["Estimated total", money(booking.total)],
    ["Payment status", booking.paymentStatus || "Not paid"]
  ];
  box.replaceChildren(...rows.map(([label, value]) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    p.append(strong, document.createTextNode(value));
    return p;
  }));
}

function setupRoomSearch() {
  const grid = document.getElementById("rooms-list");
  const search = document.getElementById("room-search");
  const sort = document.getElementById("room-sort");
  if (!grid || !search || !sort) return;
  const cards = Array.from(grid.querySelectorAll(".room-card"));
  const originalOrder = new Map(cards.map((card, index) => [card, index]));
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = cards.filter(card => card.textContent.toLowerCase().includes(query));
    visible.sort((a, b) => {
      const priceA = Number((a.querySelector(".room-price")?.textContent || "").replace(/[^\d]/g, ""));
      const priceB = Number((b.querySelector(".room-price")?.textContent || "").replace(/[^\d]/g, ""));
      if (sort.value === "price-asc") return priceA - priceB;
      if (sort.value === "price-desc") return priceB - priceA;
      if (sort.value === "name") return (a.querySelector("h3")?.textContent || "").localeCompare(b.querySelector("h3")?.textContent || "");
      return originalOrder.get(a) - originalOrder.get(b);
    });
    cards.forEach(card => { card.hidden = !visible.includes(card); });
    visible.forEach(card => grid.appendChild(card));
    const count = document.getElementById("room-results-count");
    if (count) count.textContent = `Showing ${visible.length} of ${cards.length} accommodation options`;
    let empty = grid.querySelector(".no-results");
    if (!visible.length && !empty) {
      empty = document.createElement("p"); empty.className = "no-results"; empty.textContent = "No accommodation matches your search. Try another keyword.";
      grid.appendChild(empty);
    } else if (visible.length && empty) empty.remove();
  }
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  render();
}

function setupGalleryLightbox() {
  const lightbox = document.getElementById("gallery-lightbox");
  const triggers = Array.from(document.querySelectorAll(".gallery-trigger"));
  if (!lightbox || !triggers.length) return;
  const image = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  let activeIndex = 0;
  let previousFocus = null;
  function show(index) {
    activeIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[activeIndex];
    image.src = trigger.dataset.fullImage;
    image.alt = trigger.dataset.imageAlt || "";
    caption.textContent = trigger.querySelector("span")?.textContent || image.alt;
  }
  function open(index) {
    previousFocus = document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close").focus();
  }
  function close() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    previousFocus?.focus();
  }
  triggers.forEach((trigger, index) => trigger.addEventListener("click", () => open(index)));
  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(activeIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(activeIndex + 1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) close(); });
  document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(activeIndex - 1);
    if (event.key === "ArrowRight") show(activeIndex + 1);
  });
}

function setupValidatedEmailForms() {
  const forms = [
    { id: "contact-form", feedback: "contact-feedback", subject: "Contact message — Zulu Sunset Lodge" },
    { id: "enquiry-form", feedback: "enquiry-feedback", subject: "Enquiry — Zulu Sunset Lodge" }
  ];
  forms.forEach(config => {
    const form = document.getElementById(config.id);
    if (!form) return;
    form.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("input", () => {
        field.setCustomValidity("");
        if (field.value && !field.checkValidity()) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
      });
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = document.getElementById(config.feedback);
      if (!form.checkValidity()) {
        form.reportValidity();
        if (feedback) feedback.textContent = "Please check the highlighted fields and try again.";
        return;
      }
      const data = new FormData(form);
      const body = Array.from(data.entries()).map(([key, value]) => `${key}: ${value}`).join("\\n");
      const subject = config.id === "contact-form" ? `${data.get("subject")} — Zulu Sunset Lodge` : `${data.get("type")} enquiry — Zulu Sunset Lodge`;
      // Optional AJAX mode: set this endpoint to your own verified Formspree/form service endpoint.
      // Leave blank until you have configured a real endpoint and reviewed its privacy terms.
      const FORM_ENDPOINT = "";
      if (FORM_ENDPOINT) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Sending…"; }
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: data
        }).then(response => {
          if (!response.ok) throw new Error("The form service returned an error.");
          if (feedback) feedback.textContent = "Thank you. Your message has been submitted successfully.";
          form.reset();
        }).catch(() => {
          if (feedback) feedback.textContent = "We could not submit your message online. Please try again or email reservations@zulusunset.co.za.";
        }).finally(() => {
          if (submitButton) { submitButton.disabled = false; submitButton.textContent = config.id === "contact-form" ? "Prepare Email" : "Prepare Enquiry Email"; }
        });
        return;
      }
      const mailto = `mailto:reservations@zulusunset.co.za?subject=${encodeURIComponent(subject || config.subject)}&body=${encodeURIComponent(body)}`;
      if (feedback) feedback.textContent = "Your details are valid. Your email application should open with the message prepared; press Send there to send it.";
      window.location.href = mailto;
    });
  });
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(".room-card, .info-card, .gallery-item, .faq-list details");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  elements.forEach(element => element.classList.add("reveal"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(element => observer.observe(element));
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupBookingPage();
  setupPaymentPage();
  setupConfirmationPage();
  setupRoomSearch();
  setupGalleryLightbox();
  setupValidatedEmailForms();
  setupRevealAnimations();

  document.querySelectorAll("[data-room]").forEach(button => {
    button.addEventListener("click", () => selectRoom(button.dataset.room));
  });
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  document.getElementById("quick-booking-form")?.addEventListener("submit", event => {
    event.preventDefault();
    window.location.href = "rooms.html";
  });
});
