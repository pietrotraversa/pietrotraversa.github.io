"use strict";

const navbar = document.getElementById("myNavbar");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("navDemo");
const modal = document.getElementById("modal01");
const modalImage = document.getElementById("img01");
const modalCaption = document.getElementById("caption");
const modalClose = document.getElementById("modalClose");
let lastModalTrigger = null;

function setMobileMenu(open) {
  mobileMenu.classList.toggle("w3-show", open);
  mobileMenuButton.setAttribute("aria-expanded", String(open));
}

mobileMenuButton.addEventListener("click", () => {
  setMobileMenu(!mobileMenu.classList.contains("w3-show"));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenu(false));
});

window.addEventListener("scroll", () => {
  navbar.classList.toggle("w3-card", window.scrollY > 100);
}, { passive: true });

function openImageModal(trigger) {
  const image = trigger.querySelector("img");
  lastModalTrigger = trigger;
  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modalCaption.textContent = image.alt;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeImageModal() {
  if (modal.hidden) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("modal-open");
  lastModalTrigger?.focus();
}

document.querySelectorAll(".project-image-button").forEach((button) => {
  button.addEventListener("click", () => openImageModal(button));
});

modalClose.addEventListener("click", closeImageModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (!modal.hidden && event.key === "Tab") {
    event.preventDefault();
    modalClose.focus();
    return;
  }

  if (event.key === "Escape") {
    closeImageModal();
    setMobileMenu(false);
  }
});
