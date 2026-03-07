const supportedLanguages = ["en", "fr", "es"];
let currentLanguage = "en";
let translations = {};

async function loadLanguage(lang) {
  try {
    const response = await fetch(`./i18n/${lang}.json`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load language file: ${lang}`);
    }

    translations = await response.json();
    currentLanguage = lang;

    applyTranslations();
    updateLanguageButtons();
    localStorage.setItem("agentPlaybookLang", lang);
    document.documentElement.lang = lang;
  } catch (error) {
    console.error(error);
  }
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return null;
  }, obj);
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = getNestedValue(translations, key);

    if (value !== null && value !== undefined) {
      el.textContent = value;
    }
  });

  const title = getNestedValue(translations, "meta.title");
  const description = getNestedValue(translations, "meta.description");

  if (title) document.title = title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && description) {
    metaDescription.setAttribute("content", description);
  }
}

function updateLanguageButtons() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
  });
}

function bindLanguageSwitcher() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (supportedLanguages.includes(lang)) {
        loadLanguage(lang);
      }
    });
  });
}

function bindForm() {
  const form = document.getElementById("waitlistForm");
  const message = document.getElementById("formMessage");

  if (!form || !message) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const profile = form.profile.value.trim();

    message.className = "form-message";

    if (!name || !email || !profile) {
      message.textContent =
        getNestedValue(translations, "form.validationError") ||
        "Please complete all fields.";
      message.classList.add("error");
      return;
    }

    message.textContent =
      getNestedValue(translations, "form.success") ||
      "Thank you. Your interest has been recorded.";
    message.classList.add("success");

    form.reset();
  });
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  bindLanguageSwitcher();
  bindForm();

  const savedLang = localStorage.getItem("agentPlaybookLang");
  const browserLang = navigator.language ? navigator.language.slice(0, 2) : "en";
  const initialLang = supportedLanguages.includes(savedLang)
    ? savedLang
    : supportedLanguages.includes(browserLang)
    ? browserLang
    : "en";

  loadLanguage(initialLang);
});
