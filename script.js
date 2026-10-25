
"use strict";

// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// =========================
// DESTINATION FILTERS
// =========================

const filterButtons = document.querySelectorAll(".filter-btn");
const destinationCards = document.querySelectorAll(".destination-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    // Update active filter button
    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    // Show matching destinations
    destinationCards.forEach((card) => {
      const category = card.dataset.category;

      const shouldShow =
        selectedFilter === "all" ||
        category === selectedFilter;

      card.hidden = !shouldShow;
    });
  });
});

// =========================
// CLICKABLE DESTINATION CARDS
// =========================

const destinationSelect = document.getElementById("destination");
const tripSection = document.getElementById("contact");

destinationCards.forEach((card) => {
  const selectDestination = () => {
    destinationSelect.value = card.dataset.destination;

    tripSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    destinationSelect.focus({ preventScroll: true });
  };

  card.addEventListener("click", (event) => {
    // Avoid handling a click twice when the arrow is clicked
    if (event.target.closest("button")) return;

    selectDestination();
  });

  const arrow = card.querySelector(".card-arrow");

  arrow.addEventListener("click", (event) => {
    event.stopPropagation();
    selectDestination();
  });
});

// =========================
// TRIP DATE VALIDATION
// =========================

const travelDate = document.getElementById("travelDate");

// Prevent selection of dates in the past
function setMinimumDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  travelDate.min = `${year}-${month}-${day}`;
}

setMinimumDate();

// =========================
// TRIP PLANNER FORM
// =========================

const tripForm = document.getElementById("tripForm");
const formMessage = document.getElementById("formMessage");

tripForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Clear the previous message
  formMessage.textContent = "";
  formMessage.className = "form-message";

  // Check form validity
  if (!tripForm.checkValidity()) {
    tripForm.reportValidity();
    return;
  }

  const name = document
    .getElementById("travellerName")
    .value.trim();

  const destination = destinationSelect.value;
  const date = travelDate.value;
  const travellers = document.getElementById("travellers").value;
  const travelStyle = document.getElementById("travelStyle").value;

  // Validate the date
  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    formMessage.textContent =
      "Please select today or a future travel date.";

    formMessage.classList.add("error");
    travelDate.focus();
    return;
  }

  // Prepare a demo request summary
  const request = {
    name: name,
    destination: destination,
    travelDate: date,
    travellers: Number(travellers),
    travelStyle: travelStyle
  };

  console.log("Demo trip request:", request);

  formMessage.textContent =
    `Thank you, ${name}! Your trip request for ${destination} ` +
    `on ${date} for ${travellers} traveller(s) has been prepared. ` +
    "This is a demo; your request has not been sent to a business.";

  formMessage.classList.add("success");
});
