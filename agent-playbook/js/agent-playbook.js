const supportedLanguages = ["en", "fr", "es"];
let currentLanguage = "en";
let translations = {};
let supabaseClient = null;

if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
  supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );
}

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = form.name.value.trim();
    const email = form.email.value.trim();
    const profile = form.profile.value.trim();
    const language = currentLanguage || "en";

    message.className = "form-message";

    if (!full_name || !email || !profile) {
      message.textContent =
        getNestedValue(translations, "form.validationError") ||
        "Please complete all fields.";
      message.classList.add("error");
      return;
    }

    if (!supabaseClient) {
      message.textContent =
        getNestedValue(translations, "form.submitError") ||
        "Form service is not configured yet.";
      message.classList.add("error");
      return;
    }

    try {
      const { error } = await supabaseClient
        .from("waitlist_signups")
        .insert([
          {
            page: "agent-playbook",
            full_name,
            email,
            profile,
            language,
            source: window.location.hostname
          }
        ]);

      if (error) {
        throw error;
      }

      message.textContent =
        getNestedValue(translations, "form.success") ||
        "Thank you. Your interest has been recorded.";
      message.classList.add("success");

      form.reset();
    } catch (error) {
      console.error(error);

      message.textContent =
        getNestedValue(translations, "form.submitError") ||
        "Something went wrong. Please try again.";
      message.classList.add("error");
    }
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
