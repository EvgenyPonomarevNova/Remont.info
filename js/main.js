// Smooth scroll for anchors
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const href = a.getAttribute("href");
  if (!href || href === "#") return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

// FAQ accordion: "+" -> "×"
(function initAccordion() {
  const root = document.querySelector("[data-accordion]");
  if (!root) return;

  root.addEventListener("click", (e) => {
    const head = e.target.closest(".accordion__head");
    if (!head) return;

    const item = head.closest(".accordion__item");
    const body = item.querySelector(".accordion__body");
    const btn = item.querySelector(".accordion__btn");

    const isOpen = head.getAttribute("aria-expanded") === "true";

    // close all
    root.querySelectorAll(".accordion__head").forEach((h) => h.setAttribute("aria-expanded", "false"));
    root.querySelectorAll(".accordion__body").forEach((b) => (b.hidden = true));
    root.querySelectorAll(".accordion__btn").forEach((b) => (b.textContent = "+"));

    if (!isOpen) {
      head.setAttribute("aria-expanded", "true");
      body.hidden = false;
      btn.textContent = "×";
    }
  });
})();

// Modal
(function initModal() {
  const modal = document.getElementById("modal-callback");
  if (!modal) return;

  const openers = document.querySelectorAll('[data-modal-open="callback"]');

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  };

  openers.forEach((btn) => btn.addEventListener("click", open));
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-modal-close]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
})();

// Phone mask (simple)
function maskPhone(value) {
  const digits = value.replace(/\D/g, "").replace(/^8/, "7");
  const d = digits.startsWith("7") ? digits.slice(1) : digits;

  let res = "+7";
  if (d.length > 0) res += " (" + d.slice(0, 3);
  if (d.length >= 3) res += ")";
  if (d.length > 3) res += " " + d.slice(3, 6);
  if (d.length > 6) res += " - " + d.slice(6, 8);
  if (d.length > 8) res += " - " + d.slice(8, 10);
  return res;
}

document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener("input", () => {
    input.value = maskPhone(input.value);
  });
});

// Demo submit
function handleForm(form) {
  const status = form.querySelector(".form__status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const email = (fd.get("email") || "").toString().trim();
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();

    const needEmail = form.id === "callback-form";

    if (needEmail && !email) return (status.textContent = "Введите почту.");
    if (!name) return (status.textContent = "Введите имя.");
    if (phone.replace(/\D/g, "").length < 11) return (status.textContent = "Введите телефон полностью.");

    status.textContent = "Отправлено (демо). Подключи отправку на сервер.";
    form.reset();
  });
}
document.querySelectorAll("form").forEach(handleForm);
