const AgentAcademyDashboard = (() => {
  const state = {
    lang: localStorage.getItem("lang") || "en",
    access: null
  };

  const translations = {
    en: {
      title: "Agent Academy Dashboard",
      subtitle: "Your training hub for FIFA Football Agent exam preparation.",
      statusLabel: "Access status",
      statusFree: "Free account",
      statusPaid: "Paid access",
      statusChecking: "Checking access",
      welcome: "Welcome",
      email: "Email",
      plan: "Plan",
      nextSteps: "Your next steps",
      freeLead: "Your account is active, but premium tools remain locked until you upgrade.",
      paidLead: "Your account has premium access. You can now continue to your training tools.",
      mockTitle: "Mock Exam",
      mockTextFree: "Timed premium exam simulator with regulation-weighted selection, review flags and exam-style structure.",
      mockTextPaid: "Launch the full timed mock exam experience.",
      quizTitle: "Topic Quiz",
      quizTextFree: "Premium topic-based revision across FIFA regulations and key exam themes.",
      quizTextPaid: "Continue practicing by topic and strengthen weaker areas.",
      playbookTitle: "Playbook",
      playbookText: "Read the online playbook with references, source links and structured learning support.",
      upgradeTitle: "Upgrade Access",
      upgradeText: "Unlock the full Agent Academy with Starter, Professional or Premium Intensive.",
      openMock: "Open mock exam",
      openQuiz: "Open quiz",
      openPlaybook: "Open playbook",
      openUpgrade: "See plans",
      locked: "Locked",
      logout: "Log out",
      academyHome: "Back to Academy",
      footer: "Agent Academy by GlobalMGM",
      loading: "Loading dashboard...",
      error: "Unable to load your dashboard right now."
    },
    fr: {
      title: "Tableau de bord Agent Academy",
      subtitle: "Votre centre de formation pour la préparation à l’examen d’agent de football de la FIFA.",
      statusLabel: "Statut d’accès",
      statusFree: "Compte gratuit",
      statusPaid: "Accès payant",
      statusChecking: "Vérification de l’accès",
      welcome: "Bienvenue",
      email: "E-mail",
      plan: "Offre",
      nextSteps: "Vos prochaines étapes",
      freeLead: "Votre compte est actif, mais les outils premium restent verrouillés jusqu’à votre mise à niveau.",
      paidLead: "Votre compte dispose d’un accès premium. Vous pouvez maintenant continuer vers vos outils de formation.",
      mockTitle: "Examen blanc",
      mockTextFree: "Simulateur d’examen premium chronométré avec sélection pondérée par règlement, drapeaux de révision et structure type examen.",
      mockTextPaid: "Lancez l’expérience complète de l’examen blanc chronométré.",
      quizTitle: "Quiz par thème",
      quizTextFree: "Révision premium par thème à travers les règlements FIFA et les sujets clés de l’examen.",
      quizTextPaid: "Continuez à pratiquer par thème et renforcez vos points faibles.",
      playbookTitle: "Playbook",
      playbookText: "Lisez le playbook en ligne avec références, liens sources et accompagnement pédagogique structuré.",
      upgradeTitle: "Passer à l’offre supérieure",
      upgradeText: "Débloquez l’Agent Academy complète avec Starter, Professional ou Premium Intensive.",
      openMock: "Ouvrir l’examen blanc",
      openQuiz: "Ouvrir le quiz",
      openPlaybook: "Ouvrir le playbook",
      openUpgrade: "Voir les offres",
      locked: "Verrouillé",
      logout: "Se déconnecter",
      academyHome: "Retour à l’Academy",
      footer: "Agent Academy par GlobalMGM",
      loading: "Chargement du tableau de bord...",
      error: "Impossible de charger votre tableau de bord pour le moment."
    },
    es: {
      title: "Panel de Agent Academy",
      subtitle: "Tu centro de formación para preparar el examen de agente de fútbol de la FIFA.",
      statusLabel: "Estado de acceso",
      statusFree: "Cuenta gratuita",
      statusPaid: "Acceso de pago",
      statusChecking: "Verificando acceso",
      welcome: "Bienvenido",
      email: "Correo electrónico",
      plan: "Plan",
      nextSteps: "Tus próximos pasos",
      freeLead: "Tu cuenta está activa, pero las herramientas premium seguirán bloqueadas hasta que mejores tu acceso.",
      paidLead: "Tu cuenta tiene acceso premium. Ahora puedes continuar a tus herramientas de formación.",
      mockTitle: "Mock Exam",
      mockTextFree: "Simulador premium de examen cronometrado con selección ponderada por reglamento, banderas de revisión y estructura tipo examen.",
      mockTextPaid: "Abre la experiencia completa del examen simulado cronometrado.",
      quizTitle: "Quiz por tema",
      quizTextFree: "Repaso premium por temas en los reglamentos FIFA y en los temas clave del examen.",
      quizTextPaid: "Sigue practicando por tema y refuerza las áreas más débiles.",
      playbookTitle: "Playbook",
      playbookText: "Lee el playbook online con referencias, enlaces fuente y apoyo de aprendizaje estructurado.",
      upgradeTitle: "Mejorar acceso",
      upgradeText: "Desbloquea Agent Academy completo con Starter, Professional o Premium Intensive.",
      openMock: "Abrir mock exam",
      openQuiz: "Abrir quiz",
      openPlaybook: "Abrir playbook",
      openUpgrade: "Ver planes",
      locked: "Bloqueado",
      logout: "Cerrar sesión",
      academyHome: "Volver a Academy",
      footer: "Agent Academy por GlobalMGM",
      loading: "Cargando panel...",
      error: "No se puede cargar tu panel en este momento."
    }
  };

  const el = {};

  function t(key) {
    return translations[state.lang]?.[key] || translations.en[key] || key;
  }

  function formatPlan(plan) {
    const value = String(plan || "free").toLowerCase();

    if (value === "starter") return "Starter";
    if (value === "professional") return "Professional";
    if (value === "premium") return "Premium";
    if (value === "premium_intensive") return "Premium Intensive";

    return "Free";
  }

  function cacheDom() {
    el.pageTitle = document.getElementById("pageTitle");
    el.pageSubtitle = document.getElementById("pageSubtitle");
    el.statusLabel = document.getElementById("statusLabel");
    el.statusValue = document.getElementById("statusValue");
    el.dashboardLead = document.getElementById("dashboardLead");

    el.metaWelcomeLabel = document.getElementById("metaWelcomeLabel");
    el.metaWelcomeValue = document.getElementById("metaWelcomeValue");
    el.metaEmailLabel = document.getElementById("metaEmailLabel");
    el.metaEmailValue = document.getElementById("metaEmailValue");
    el.metaPlanLabel = document.getElementById("metaPlanLabel");
    el.metaPlanValue = document.getElementById("metaPlanValue");

    el.nextStepsTitle = document.getElementById("nextStepsTitle");

    el.mockBadge = document.getElementById("mockBadge");
    el.mockTitle = document.getElementById("mockTitle");
    el.mockText = document.getElementById("mockText");
    el.mockBtn = document.getElementById("mockBtn");

    el.quizBadge = document.getElementById("quizBadge");
    el.quizTitle = document.getElementById("quizTitle");
    el.quizText = document.getElementById("quizText");
    el.quizBtn = document.getElementById("quizBtn");

    el.playbookBadge = document.getElementById("playbookBadge");
    el.playbookTitle = document.getElementById("playbookTitle");
    el.playbookText = document.getElementById("playbookText");
    el.playbookBtn = document.getElementById("playbookBtn");

    el.upgradeBadge = document.getElementById("upgradeBadge");
    el.upgradeTitle = document.getElementById("upgradeTitle");
    el.upgradeText = document.getElementById("upgradeText");
    el.upgradeBtn = document.getElementById("upgradeBtn");

    el.logoutBtn = document.getElementById("logoutBtn");
    el.academyHomeBtn = document.getElementById("academyHomeBtn");
    el.footerText = document.getElementById("footerText");
  }

  function renderStatic() {
    document.documentElement.lang = state.lang;
    document.title = `${t("title")} | GlobalMGM`;

    el.pageTitle.textContent = t("title");
    el.pageSubtitle.textContent = t("subtitle");
    el.statusLabel.textContent = t("statusLabel");
    el.statusValue.textContent = t("statusChecking");
    el.dashboardLead.textContent = t("loading");

    el.metaWelcomeLabel.textContent = t("welcome");
    el.metaEmailLabel.textContent = t("email");
    el.metaPlanLabel.textContent = t("plan");

    el.nextStepsTitle.textContent = t("nextSteps");

    el.mockTitle.textContent = t("mockTitle");
    el.quizTitle.textContent = t("quizTitle");
    el.playbookTitle.textContent = t("playbookTitle");
    el.upgradeTitle.textContent = t("upgradeTitle");

    el.playbookText.textContent = t("playbookText");
    el.upgradeText.textContent = t("upgradeText");

    el.playbookBtn.textContent = t("openPlaybook");
    el.upgradeBtn.textContent = t("openUpgrade");
    el.logoutBtn.textContent = t("logout");
    el.academyHomeBtn.textContent = t("academyHome");
    el.footerText.textContent = t("footer");
  }

  function renderAccess() {
    if (!state.access) {
      el.dashboardLead.textContent = t("error");
      return;
    }

    const { isPaid, user, plan } = state.access;

    el.statusValue.textContent = isPaid ? t("statusPaid") : t("statusFree");
    el.metaWelcomeValue.textContent =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      "—";
    el.metaEmailValue.textContent = user?.email || "—";
    el.metaPlanValue.textContent = formatPlan(plan);

    el.playbookBadge.textContent = "";
    el.upgradeBadge.textContent = "";

    if (isPaid) {
      el.dashboardLead.textContent = t("paidLead");

      el.mockBadge.textContent = "";
      el.quizBadge.textContent = "";

      el.mockText.textContent = t("mockTextPaid");
      el.quizText.textContent = t("quizTextPaid");

      el.mockBtn.textContent = t("openMock");
      el.quizBtn.textContent = t("openQuiz");

      el.mockBtn.href = "/agent-academy/mock-exam.html";
      el.quizBtn.href = "/agent-academy/quiz.html";
    } else {
      el.dashboardLead.textContent = t("freeLead");

      el.mockBadge.textContent = t("locked");
      el.quizBadge.textContent = t("locked");

      el.mockText.textContent = t("mockTextFree");
      el.quizText.textContent = t("quizTextFree");

      el.mockBtn.textContent = t("openUpgrade");
      el.quizBtn.textContent = t("openUpgrade");

      el.mockBtn.href = "/agent-academy/upgrade.html";
      el.quizBtn.href = "/agent-academy/upgrade.html";
    }
  }

  function setLanguage(lang) {
    state.lang = ["en", "fr", "es"].includes(lang) ? lang : "en";
    localStorage.setItem("lang", state.lang);
    renderStatic();
    renderAccess();
  }

  function bindEvents() {
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLanguage(btn.dataset.lang || "en");
      });
    });

    el.logoutBtn.addEventListener("click", async () => {
      const auth = window.AgentAcademyAuth;
      if (auth?.signOut) {
        await auth.signOut();
      }
      window.location.href = "/agent-academy/login.html";
    });
  }

  async function init() {
    cacheDom();
    renderStatic();
    bindEvents();

    try {
      const guard = window.AgentAcademyGuard;
      const access = await guard.requireLogin({
        loginUrl: "/agent-academy/login.html"
      });

      if (!access) return;

      state.access = access;
      renderAccess();
    } catch (error) {
      console.error("Dashboard init error:", error);
      el.dashboardLead.textContent = t("error");
    }
  }

  return {
    init
  };
})();

document.addEventListener("DOMContentLoaded", AgentAcademyDashboard.init);

