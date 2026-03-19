const AgentAcademyDashboard = (() => {
  const state = {
    lang: localStorage.getItem("lang") || "en",
    access: null
  };

  const el = {};

  const t = {
    en: {
      pageTitle: "Your premium preparation dashboard",
      pageLead: "Track your progress, see what your current plan unlocks and continue your FIFA exam preparation through the right study tools.",
      back: "Back to Academy",
      logout: "Log out",
      topicsQuick: "Open Topics",
      upgradeQuick: "Upgrade Access",
      currentPlan: "Current plan",
      unlockedTools: "Unlocked tools",
      readiness: "Exam readiness",
      name: "Name",
      email: "Email",
      accessLevel: "Access level",
      ringLabel: "Preparation coverage",
      stat1Label: "Questions answered",
      stat1Note: "Your answered-question volume will appear here as your academy activity grows.",
      stat2Label: "Average score",
      stat2Note: "Your average score becomes more meaningful as you complete more practice sets.",
      stat3Label: "Topics completed",
      stat3Note: "Completed topics will help signal your readiness across FIFA regulations.",
      stat4Label: "Mock exams taken",
      stat4Note: "Timed exam attempts will appear here once your plan unlocks the simulator.",
      progressTitle: "Progress by study area",
      progressLead: "Your visible progress bars help you spot which areas are developing first and where you still need more structured preparation.",
      summaryTitle: "Access summary",
      summaryLead: "Your current plan determines which premium preparation tools are already open and which upgrades will unlock the next stage.",
      sumStarter: "Starter layer",
      sumProfessional: "Professional layer",
      sumPremium: "Premium layer",
      sumReadiness: "Current exam-cycle readiness",
      toolsTitle: "Your study tools",
      toolsLead: "Each tool card below reflects your current access tier. Premium progression should be obvious the moment you land on the dashboard.",
      tool1Badge: "Available",
      tool1Title: "Topics Catalogue",
      tool1Text: "Browse the structure of the curriculum and see the study areas covered across the academy.",
      tool1Req: "Available to all logged-in users",
      tool1Btn: "Open topics",
      tool2Title: "Topic Quiz",
      tool2Text: "Practice regulation-based questions by topic and build structured exam confidence over time.",
      tool3Title: "Mock Exam Simulator",
      tool3Text: "Enter the timed exam environment with question palette, review flags and session-style pressure.",
      tool4Title: "Intensive Preparation",
      tool4Text: "Advanced high-intensity preparation modules reserved for the highest-value tier of the academy.",
      starterReq: "Starter plan or above required",
      professionalReq: "Professional plan or above required",
      premiumReq: "Premium plan required",
      unlockStarter: "Unlock with Starter",
      unlockProfessional: "Upgrade to Professional",
      unlockPremium: "Upgrade to Premium",
      openQuiz: "Open topic quiz",
      openMock: "Open mock exam",
      openIntensive: "Premium only",
      freePlan: "Free Preview",
      starterPlan: "Starter",
      professionalPlan: "Professional",
      premiumPlan: "Premium Intensive",
      available: "Available",
      locked: "Locked",
      unlocked: "Unlocked",
      footer: "Agent Academy by GlobalMGM",
      ffar: "FFAR & Representation",
      rstp: "RSTP & Transfers",
      ethics: "Ethics, Governance & Discipline",
      strategy: "Exam strategy readiness",
      brand: "GlobalMGM · Agent Academy",

      milestoneLabel: "Next Preparation Milestone",
      milestoneFreeTitle: "Unlock Starter Preparation",
      milestoneFreeDescription: "Starter unlocks structured learning tools and the first full training layer.",
      milestoneFreeBenefit1: "300 regulation quiz questions",
      milestoneFreeBenefit2: "Full playbook access",
      milestoneFreeBenefit3: "Structured topic training",
      milestoneFreeBtn: "Unlock Starter",

      milestoneStarterTitle: "Upgrade to Professional",
      milestoneStarterDescription: "Professional unlocks the full question bank and unlimited mock exams.",
      milestoneStarterBenefit1: "Full 2000-question bank",
      milestoneStarterBenefit2: "Unlimited mock exams",
      milestoneStarterBenefit3: "Full exam simulator",
      milestoneStarterBtn: "Upgrade to Professional",

      milestoneProfessionalTitle: "Upgrade to Premium",
      milestoneProfessionalDescription: "Premium unlocks the highest-value preparation layer.",
      milestoneProfessionalBenefit1: "Advanced scenario simulations",
      milestoneProfessionalBenefit2: "Intensive preparation modules",
      milestoneProfessionalBenefit3: "Highest-level readiness tools",
      milestoneProfessionalBtn: "Upgrade to Premium",

      milestonePremiumTitle: "Full Academy Access",
      milestonePremiumDescription: "You have unlocked the complete preparation environment.",
      milestonePremiumBenefit1: "Full question bank access",
      milestonePremiumBenefit2: "Unlimited mock exams",
      milestonePremiumBenefit3: "Intensive preparation modules"
    },

    fr: {
      pageTitle: "Votre tableau de bord premium de préparation",
      pageLead: "Suivez vos progrès, voyez ce que votre offre actuelle débloque et poursuivez votre préparation à l’examen FIFA avec les bons outils.",
      back: "Retour à l’Academy",
      logout: "Se déconnecter",
      topicsQuick: "Ouvrir les thèmes",
      upgradeQuick: "Améliorer l’accès",
      currentPlan: "Offre actuelle",
      unlockedTools: "Outils débloqués",
      readiness: "Préparation à l’examen",
      name: "Nom",
      email: "E-mail",
      accessLevel: "Niveau d’accès",
      ringLabel: "Couverture de préparation",
      stat1Label: "Questions répondues",
      stat1Note: "Le volume de questions traitées apparaîtra ici au fur et à mesure de votre activité.",
      stat2Label: "Score moyen",
      stat2Note: "Votre score moyen devient plus pertinent à mesure que vous complétez davantage d’exercices.",
      stat3Label: "Thèmes terminés",
      stat3Note: "Les thèmes terminés aideront à mesurer votre préparation sur les règlements FIFA.",
      stat4Label: "Examens blancs passés",
      stat4Note: "Les examens chronométrés apparaîtront ici dès que votre offre débloquera le simulateur.",
      progressTitle: "Progression par domaine d’étude",
      progressLead: "Les barres de progression visibles vous aident à repérer les domaines déjà travaillés et ceux qui demandent encore une préparation plus structurée.",
      summaryTitle: "Résumé d’accès",
      summaryLead: "Votre offre actuelle détermine quels outils premium sont déjà ouverts et quelles mises à niveau débloquent l’étape suivante.",
      sumStarter: "Niveau Starter",
      sumProfessional: "Niveau Professional",
      sumPremium: "Niveau Premium",
      sumReadiness: "Préparation du cycle d’examen",
      toolsTitle: "Vos outils d’étude",
      toolsLead: "Chaque carte ci-dessous reflète votre niveau d’accès actuel. La progression premium doit être claire dès l’arrivée sur le tableau de bord.",
      tool1Badge: "Disponible",
      tool1Title: "Catalogue des thèmes",
      tool1Text: "Parcourez la structure du programme et voyez les domaines d’étude couverts dans l’academy.",
      tool1Req: "Disponible à tous les utilisateurs connectés",
      tool1Btn: "Ouvrir les thèmes",
      tool2Title: "Quiz par thème",
      tool2Text: "Travaillez les questions réglementaires par thème et développez votre confiance pour l’examen.",
      tool3Title: "Simulateur d’examen blanc",
      tool3Text: "Entrez dans l’environnement chronométré avec palette de questions, drapeaux et pression type examen.",
      tool4Title: "Préparation intensive",
      tool4Text: "Modules avancés de préparation intensive réservés au niveau le plus élevé de l’academy.",
      starterReq: "Offre Starter ou supérieure requise",
      professionalReq: "Offre Professional ou supérieure requise",
      premiumReq: "Offre Premium requise",
      unlockStarter: "Débloquer avec Starter",
      unlockProfessional: "Passer à Professional",
      unlockPremium: "Passer à Premium",
      openQuiz: "Ouvrir le quiz",
      openMock: "Ouvrir l’examen blanc",
      openIntensive: "Premium uniquement",
      freePlan: "Aperçu gratuit",
      starterPlan: "Starter",
      professionalPlan: "Professional",
      premiumPlan: "Premium Intensif",
      available: "Disponible",
      locked: "Verrouillé",
      unlocked: "Débloqué",
      footer: "Agent Academy par GlobalMGM",
      ffar: "FFAR et représentation",
      rstp: "RSTP et transferts",
      ethics: "Éthique, gouvernance et discipline",
      strategy: "Préparation stratégique",
      brand: "GlobalMGM · Agent Academy",

      milestoneLabel: "Prochaine étape de préparation",
      milestoneFreeTitle: "Débloquer Starter",
      milestoneFreeDescription: "Starter débloque des outils d’apprentissage structurés et le premier niveau complet de préparation.",
      milestoneFreeBenefit1: "300 questions de quiz réglementaires",
      milestoneFreeBenefit2: "Accès complet au playbook",
      milestoneFreeBenefit3: "Formation structurée par thème",
      milestoneFreeBtn: "Débloquer Starter",

      milestoneStarterTitle: "Passer à Professional",
      milestoneStarterDescription: "Professional débloque la banque complète de questions et les examens blancs illimités.",
      milestoneStarterBenefit1: "Banque complète de 2000 questions",
      milestoneStarterBenefit2: "Examens blancs illimités",
      milestoneStarterBenefit3: "Simulateur d’examen complet",
      milestoneStarterBtn: "Passer à Professional",

      milestoneProfessionalTitle: "Passer à Premium",
      milestoneProfessionalDescription: "Premium débloque le niveau de préparation à la plus forte valeur.",
      milestoneProfessionalBenefit1: "Simulations avancées basées sur des scénarios",
      milestoneProfessionalBenefit2: "Modules de préparation intensive",
      milestoneProfessionalBenefit3: "Outils de préparation du plus haut niveau",
      milestoneProfessionalBtn: "Passer à Premium",

      milestonePremiumTitle: "Accès complet à l’Academy",
      milestonePremiumDescription: "Vous avez débloqué l’environnement complet de préparation.",
      milestonePremiumBenefit1: "Accès complet à la banque de questions",
      milestonePremiumBenefit2: "Examens blancs illimités",
      milestonePremiumBenefit3: "Modules de préparation intensive"
    },

    es: {
      pageTitle: "Tu panel premium de preparación",
      pageLead: "Sigue tu progreso, ve lo que desbloquea tu plan actual y continúa tu preparación del examen FIFA con las herramientas adecuadas.",
      back: "Volver a Academy",
      logout: "Cerrar sesión",
      topicsQuick: "Abrir temas",
      upgradeQuick: "Mejorar acceso",
      currentPlan: "Plan actual",
      unlockedTools: "Herramientas desbloqueadas",
      readiness: "Preparación para el examen",
      name: "Nombre",
      email: "Correo electrónico",
      accessLevel: "Nivel de acceso",
      ringLabel: "Cobertura de preparación",
      stat1Label: "Preguntas respondidas",
      stat1Note: "El volumen de preguntas respondidas aparecerá aquí a medida que crezca tu actividad.",
      stat2Label: "Puntuación media",
      stat2Note: "Tu puntuación media será más significativa a medida que completes más prácticas.",
      stat3Label: "Temas completados",
      stat3Note: "Los temas completados ayudarán a medir tu preparación en los reglamentos FIFA.",
      stat4Label: "Mock exams realizados",
      stat4Note: "Los exámenes cronometrados aparecerán aquí cuando tu plan desbloquee el simulador.",
      progressTitle: "Progreso por área de estudio",
      progressLead: "Las barras de progreso visibles te ayudan a detectar qué áreas avanzan primero y dónde aún necesitas una preparación más estructurada.",
      summaryTitle: "Resumen de acceso",
      summaryLead: "Tu plan actual determina qué herramientas premium ya están abiertas y qué mejoras desbloquean la siguiente fase.",
      sumStarter: "Nivel Starter",
      sumProfessional: "Nivel Professional",
      sumPremium: "Nivel Premium",
      sumReadiness: "Preparación del ciclo de examen",
      toolsTitle: "Tus herramientas de estudio",
      toolsLead: "Cada tarjeta refleja tu nivel de acceso actual. La progresión premium debe ser evidente en cuanto entras al panel.",
      tool1Badge: "Disponible",
      tool1Title: "Catálogo de temas",
      tool1Text: "Explora la estructura del currículo y ve las áreas de estudio cubiertas por la academy.",
      tool1Req: "Disponible para todos los usuarios con sesión iniciada",
      tool1Btn: "Abrir temas",
      tool2Title: "Quiz por tema",
      tool2Text: "Practica preguntas por tema y construye confianza estructurada para el examen.",
      tool3Title: "Simulador de mock exam",
      tool3Text: "Entra en el entorno cronometrado con paleta de preguntas, banderas de revisión y presión tipo examen.",
      tool4Title: "Preparación intensiva",
      tool4Text: "Módulos avanzados de preparación de alta intensidad reservados para el nivel más alto de la academy.",
      starterReq: "Se requiere plan Starter o superior",
      professionalReq: "Se requiere plan Professional o superior",
      premiumReq: "Se requiere plan Premium",
      unlockStarter: "Desbloquear con Starter",
      unlockProfessional: "Mejorar a Professional",
      unlockPremium: "Mejorar a Premium",
      openQuiz: "Abrir quiz",
      openMock: "Abrir mock exam",
      openIntensive: "Solo Premium",
      freePlan: "Vista previa gratuita",
      starterPlan: "Starter",
      professionalPlan: "Professional",
      premiumPlan: "Premium Intensivo",
      available: "Disponible",
      locked: "Bloqueado",
      unlocked: "Desbloqueado",
      footer: "Agent Academy por GlobalMGM",
      ffar: "FFAR y representación",
      rstp: "RSTP y transferencias",
      ethics: "Ética, gobernanza y disciplina",
      strategy: "Preparación estratégica",
      brand: "GlobalMGM · Agent Academy",

      milestoneLabel: "Próximo hito de preparación",
      milestoneFreeTitle: "Desbloquear Starter",
      milestoneFreeDescription: "Starter desbloquea herramientas de aprendizaje estructurado y la primera capa completa de preparación.",
      milestoneFreeBenefit1: "300 preguntas de cuestionario reglamentario",
      milestoneFreeBenefit2: "Acceso completo al playbook",
      milestoneFreeBenefit3: "Formación estructurada por temas",
      milestoneFreeBtn: "Desbloquear Starter",

      milestoneStarterTitle: "Subir a Professional",
      milestoneStarterDescription: "Professional desbloquea el banco completo de preguntas y los exámenes simulados ilimitados.",
      milestoneStarterBenefit1: "Banco completo de 2000 preguntas",
      milestoneStarterBenefit2: "Exámenes simulados ilimitados",
      milestoneStarterBenefit3: "Simulador de examen completo",
      milestoneStarterBtn: "Subir a Professional",

      milestoneProfessionalTitle: "Subir a Premium",
      milestoneProfessionalDescription: "Premium desbloquea la capa de preparación de mayor valor.",
      milestoneProfessionalBenefit1: "Simulaciones avanzadas por escenarios",
      milestoneProfessionalBenefit2: "Módulos de preparación intensiva",
      milestoneProfessionalBenefit3: "Herramientas de preparación del más alto nivel",
      milestoneProfessionalBtn: "Subir a Premium",

      milestonePremiumTitle: "Acceso completo a la Academy",
      milestonePremiumDescription: "Has desbloqueado el entorno completo de preparación.",
      milestonePremiumBenefit1: "Acceso completo al banco de preguntas",
      milestonePremiumBenefit2: "Exámenes simulados ilimitados",
      milestonePremiumBenefit3: "Módulos de preparación intensiva"
    }
  };

  function txt(key) {
    return t[state.lang]?.[key] || t.en[key] || key;
  }

  function formatPlan(plan) {
    const p = String(plan || "free").toLowerCase();
    if (p === "starter") return txt("starterPlan");
    if (p === "professional") return txt("professionalPlan");
    if (p === "premium" || p === "premium_intensive") return txt("premiumPlan");
    return txt("freePlan");
  }

  function cacheDom() {
    [
      "planChip","pageTitle","pageLead","backBtn","logoutBtn","topicsQuickBtn","upgradeQuickBtn",
      "mini1Label","mini1Value","mini2Label","mini2Value","mini3Label","mini3Value",
      "userNameLabel","userNameValue","userEmailLabel","userEmailValue","userPlanLabel","userPlanValue",
      "ringProgress","ringPercent","ringLabel",
      "stat1Label","stat1Value","stat1Note","stat2Label","stat2Value","stat2Note","stat3Label","stat3Value","stat3Note","stat4Label","stat4Value","stat4Note",
      "progressTitle","progressLead","summaryTitle","summaryLead",
      "prog1Title","prog1Value","prog1Fill","prog2Title","prog2Value","prog2Fill","prog3Title","prog3Value","prog3Fill","prog4Title","prog4Value","prog4Fill",
      "sum1Title","sum1Value","sum1Fill","sum2Title","sum2Value","sum2Fill","sum3Title","sum3Value","sum3Fill","sum4Title","sum4Value","sum4Fill",
      "toolsTitle","toolsLead",
      "tool1Badge","tool1Title","tool1Text","tool1Req","tool1Btn",
      "tool2Badge","tool2Title","tool2Text","tool2Req","tool2Btn",
      "tool3Badge","tool3Title","tool3Text","tool3Req","tool3Btn",
      "tool4Badge","tool4Title","tool4Text","tool4Req","tool4Btn",
      "footerText"
    ].forEach((id) => {
      el[id] = document.getElementById(id);
    });

    el.brand = document.querySelector(".brand");

    el.milestoneLabel = document.querySelector(".milestone-label");
    el.milestoneTitle = document.getElementById("milestone-title");
    el.milestoneDescription = document.getElementById("milestone-description");
    el.milestoneBenefits = document.getElementById("milestone-benefits");
    el.milestoneButton = document.getElementById("milestone-button");
  }

  function setLangButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang-btn") === state.lang);
    });
  }

  function setRing(percent) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    el.ringProgress.style.strokeDasharray = `${circumference} ${circumference}`;
    el.ringProgress.style.strokeDashoffset = offset;
    el.ringPercent.textContent = `${percent}%`;
  }

  function getPlanRank(plan) {
    const guard = window.AgentAcademyGuard;
    const rank = guard?.PLAN_RANK || { free: 0, starter: 1, professional: 2, premium: 3, premium_intensive: 3 };
    return rank[String(plan || "free").toLowerCase()] || 0;
  }

  function computeViewModel(plan) {
    const rank = getPlanRank(plan);

    const unlockedTools = rank === 0 ? 1 : rank === 1 ? 3 : rank === 2 ? 4 : 4;
    const readiness = rank === 0 ? 12 : rank === 1 ? 36 : rank === 2 ? 68 : 92;

    const stats = {
      questionsAnswered: rank === 0 ? 0 : rank === 1 ? 48 : rank === 2 ? 186 : 344,
      avgScore: rank === 0 ? "0%" : rank === 1 ? "64%" : rank === 2 ? "73%" : "81%",
      topicsCompleted: rank === 0 ? 0 : rank === 1 ? 3 : rank === 2 ? 8 : 12,
      mocksTaken: rank < 2 ? 0 : rank === 2 ? 4 : 9,
      ffar: rank === 0 ? 18 : rank === 1 ? 42 : rank === 2 ? 71 : 88,
      rstp: rank === 0 ? 10 : rank === 1 ? 30 : rank === 2 ? 62 : 84,
      ethics: rank === 0 ? 7 : rank === 1 ? 25 : rank === 2 ? 58 : 80,
      strategy: readiness
    };

    return { rank, unlockedTools, readiness, stats };
  }

  function renderStatic() {
    document.documentElement.lang = state.lang;
    document.title = `${txt("pageTitle")} | GlobalMGM`;

    if (el.brand) el.brand.textContent = txt("brand");

    el.pageTitle.textContent = txt("pageTitle");
    el.pageLead.textContent = txt("pageLead");
    el.backBtn.textContent = txt("back");
    el.logoutBtn.textContent = txt("logout");
    el.topicsQuickBtn.textContent = txt("topicsQuick");
    el.upgradeQuickBtn.textContent = txt("upgradeQuick");

    el.mini1Label.textContent = txt("currentPlan");
    el.mini2Label.textContent = txt("unlockedTools");
    el.mini3Label.textContent = txt("readiness");

    el.userNameLabel.textContent = txt("name");
    el.userEmailLabel.textContent = txt("email");
    el.userPlanLabel.textContent = txt("accessLevel");
    el.ringLabel.textContent = txt("ringLabel");

    el.stat1Label.textContent = txt("stat1Label");
    el.stat1Note.textContent = txt("stat1Note");
    el.stat2Label.textContent = txt("stat2Label");
    el.stat2Note.textContent = txt("stat2Note");
    el.stat3Label.textContent = txt("stat3Label");
    el.stat3Note.textContent = txt("stat3Note");
    el.stat4Label.textContent = txt("stat4Label");
    el.stat4Note.textContent = txt("stat4Note");

    el.progressTitle.textContent = txt("progressTitle");
    el.progressLead.textContent = txt("progressLead");
    el.summaryTitle.textContent = txt("summaryTitle");
    el.summaryLead.textContent = txt("summaryLead");

    el.prog1Title.textContent = txt("ffar");
    el.prog2Title.textContent = txt("rstp");
    el.prog3Title.textContent = txt("ethics");
    el.prog4Title.textContent = txt("strategy");

    el.sum1Title.textContent = txt("sumStarter");
    el.sum2Title.textContent = txt("sumProfessional");
    el.sum3Title.textContent = txt("sumPremium");
    el.sum4Title.textContent = txt("sumReadiness");

    el.toolsTitle.textContent = txt("toolsTitle");
    el.toolsLead.textContent = txt("toolsLead");

    el.tool1Title.textContent = txt("tool1Title");
    el.tool1Text.textContent = txt("tool1Text");
    el.tool1Req.textContent = txt("tool1Req");
    el.tool1Btn.textContent = txt("tool1Btn");

    el.tool2Title.textContent = txt("tool2Title");
    el.tool2Text.textContent = txt("tool2Text");

    el.tool3Title.textContent = txt("tool3Title");
    el.tool3Text.textContent = txt("tool3Text");

    el.tool4Title.textContent = txt("tool4Title");
    el.tool4Text.textContent = txt("tool4Text");

    if (el.milestoneLabel) {
      el.milestoneLabel.textContent = txt("milestoneLabel");
    }

    el.footerText.textContent = txt("footer");

    setLangButtons();
  }

  function renderPlanAwareCards(plan) {
    const rank = getPlanRank(plan);

    el.tool1Badge.textContent = txt("tool1Badge");
    el.tool1Btn.classList.add("primary");

    if (rank >= 1) {
      el.tool2Badge.textContent = txt("unlocked");
      el.tool2Req.textContent = txt("starterReq");
      el.tool2Btn.textContent = txt("openQuiz");
      el.tool2Btn.href = "/agent-academy/quiz.html";
      el.tool2Btn.classList.add("primary");
    } else {
      el.tool2Badge.textContent = "Starter+";
      el.tool2Req.textContent = txt("starterReq");
      el.tool2Btn.textContent = txt("unlockStarter");
      el.tool2Btn.href = "/agent-academy/upgrade.html?required=starter";
      el.tool2Btn.classList.remove("primary");
    }

    if (rank >= 2) {
      el.tool3Badge.textContent = txt("unlocked");
      el.tool3Req.textContent = txt("professionalReq");
      el.tool3Btn.textContent = txt("openMock");
      el.tool3Btn.href = "/agent-academy/mock-exam.html";
      el.tool3Btn.classList.add("primary");
    } else {
      el.tool3Badge.textContent = "Professional+";
      el.tool3Req.textContent = txt("professionalReq");
      el.tool3Btn.textContent = txt("unlockProfessional");
      el.tool3Btn.href = "/agent-academy/upgrade.html?required=professional";
      el.tool3Btn.classList.remove("primary");
    }

    if (rank >= 3) {
      el.tool4Badge.textContent = txt("unlocked");
      el.tool4Req.textContent = txt("premiumReq");
      el.tool4Btn.textContent = txt("openIntensive");
      el.tool4Btn.href = "/agent-academy/upgrade.html?required=premium";
      el.tool4Btn.classList.add("primary");
    } else {
      el.tool4Badge.textContent = "Premium";
      el.tool4Req.textContent = txt("premiumReq");
      el.tool4Btn.textContent = txt("unlockPremium");
      el.tool4Btn.href = "/agent-academy/upgrade.html?required=premium";
      el.tool4Btn.classList.remove("primary");
    }
  }

  function renderMilestone(plan) {
    if (!el.milestoneTitle || !el.milestoneDescription || !el.milestoneBenefits || !el.milestoneButton) return;

    const p = String(plan || "free").toLowerCase();

    if (el.milestoneLabel) {
      el.milestoneLabel.textContent = txt("milestoneLabel");
    }

    el.milestoneButton.style.display = "";

    if (p === "starter") {
      el.milestoneTitle.textContent = txt("milestoneStarterTitle");
      el.milestoneDescription.textContent = txt("milestoneStarterDescription");
      el.milestoneBenefits.innerHTML = `
        <li>${txt("milestoneStarterBenefit1")}</li>
        <li>${txt("milestoneStarterBenefit2")}</li>
        <li>${txt("milestoneStarterBenefit3")}</li>
      `;
      el.milestoneButton.textContent = txt("milestoneStarterBtn");
      el.milestoneButton.href = "/agent-academy/upgrade.html?required=professional";
      return;
    }

    if (p === "professional") {
      el.milestoneTitle.textContent = txt("milestoneProfessionalTitle");
      el.milestoneDescription.textContent = txt("milestoneProfessionalDescription");
      el.milestoneBenefits.innerHTML = `
        <li>${txt("milestoneProfessionalBenefit1")}</li>
        <li>${txt("milestoneProfessionalBenefit2")}</li>
        <li>${txt("milestoneProfessionalBenefit3")}</li>
      `;
      el.milestoneButton.textContent = txt("milestoneProfessionalBtn");
      el.milestoneButton.href = "/agent-academy/upgrade.html?required=premium";
      return;
    }

    if (p === "premium" || p === "premium_intensive") {
      el.milestoneTitle.textContent = txt("milestonePremiumTitle");
      el.milestoneDescription.textContent = txt("milestonePremiumDescription");
      el.milestoneBenefits.innerHTML = `
        <li>${txt("milestonePremiumBenefit1")}</li>
        <li>${txt("milestonePremiumBenefit2")}</li>
        <li>${txt("milestonePremiumBenefit3")}</li>
      `;
      el.milestoneButton.style.display = "none";
      return;
    }

    el.milestoneTitle.textContent = txt("milestoneFreeTitle");
    el.milestoneDescription.textContent = txt("milestoneFreeDescription");
    el.milestoneBenefits.innerHTML = `
      <li>${txt("milestoneFreeBenefit1")}</li>
      <li>${txt("milestoneFreeBenefit2")}</li>
      <li>${txt("milestoneFreeBenefit3")}</li>
    `;
    el.milestoneButton.textContent = txt("milestoneFreeBtn");
    el.milestoneButton.href = "/agent-academy/upgrade.html?required=starter";
  }

  function renderAccess() {
    if (!state.access) return;

   const plan = window.userPlan || state.access?.plan || "free";
console.log("DASHBOARD PLAN:", plan, "window.userPlan=", window.userPlan, "state.access=", state.access);
    const user = state.access.user || {};
    const vm = computeViewModel(plan);

    const fullName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "—";

    const email =
      user?.email ||
      user?.user_metadata?.email ||
      "—";

    el.planChip.textContent = formatPlan(plan);
    el.mini1Value.textContent = formatPlan(plan);
    el.mini2Value.textContent = String(vm.unlockedTools);
    el.mini3Value.textContent = `${vm.readiness}%`;

    el.userNameValue.textContent = fullName;
    el.userEmailValue.textContent = email;
    el.userPlanValue.textContent = formatPlan(plan);

    el.stat1Value.textContent = String(vm.stats.questionsAnswered);
    el.stat2Value.textContent = vm.stats.avgScore;
    el.stat3Value.textContent = String(vm.stats.topicsCompleted);
    el.stat4Value.textContent = String(vm.stats.mocksTaken);

    el.prog1Value.textContent = `${vm.stats.ffar}%`;
    el.prog1Fill.style.width = `${vm.stats.ffar}%`;
    el.prog2Value.textContent = `${vm.stats.rstp}%`;
    el.prog2Fill.style.width = `${vm.stats.rstp}%`;
    el.prog3Value.textContent = `${vm.stats.ethics}%`;
    el.prog3Fill.style.width = `${vm.stats.ethics}%`;
    el.prog4Value.textContent = `${vm.stats.strategy}%`;
    el.prog4Fill.style.width = `${vm.stats.strategy}%`;

    const starterUnlocked = vm.rank >= 1 ? 100 : 0;
    const professionalUnlocked = vm.rank >= 2 ? 100 : 0;
    const premiumUnlocked = vm.rank >= 3 ? 100 : 0;

    el.sum1Value.textContent = vm.rank >= 1 ? txt("unlocked") : txt("locked");
    el.sum1Fill.style.width = `${starterUnlocked}%`;

    el.sum2Value.textContent = vm.rank >= 2 ? txt("unlocked") : txt("locked");
    el.sum2Fill.style.width = `${professionalUnlocked}%`;

    el.sum3Value.textContent = vm.rank >= 3 ? txt("unlocked") : txt("locked");
    el.sum3Fill.style.width = `${premiumUnlocked}%`;

    el.sum4Value.textContent = `${vm.readiness}%`;
    el.sum4Fill.style.width = `${vm.readiness}%`;

    setRing(vm.readiness);
    const totalBank = 2000;
let unlocked = 50;

if (plan === "starter") unlocked = 300;
if (plan === "professional" || plan === "premium" || plan === "premium_intensive") {
  unlocked = totalBank;
}

const percent = Math.round((unlocked / totalBank) * 100);

document.getElementById("questionAccessValue").textContent =
  `${unlocked} / ${totalBank}`;

document.getElementById("questionAccessFill").style.width =
  `${percent}%`;
    
    renderPlanAwareCards(plan);
    renderMilestone(plan);
  }

  function bindEvents() {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.lang = btn.getAttribute("data-lang-btn") || "en";
        localStorage.setItem("lang", state.lang);
        renderStatic();
        renderAccess();
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

  async function ensureUserAccess(userId) {
  try {
    const client = window.supabaseClient || window.sb || window.supabase;

    if (!client) {
      console.error("Supabase client not found for ensureUserAccess");
      window.userPlan = "free";
      return "free";
    }

    const { data, error } = await client
      .from("user_access")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("ensureUserAccess check error:", error);
      window.userPlan = "free";
      return "free";
    }

    if (!data) {
      const { error: insertError } = await client
        .from("user_access")
        .insert([{
          user_id: userId,
          plan: "free",
          is_active: true
        }]);

      if (insertError) {
        console.error("ensureUserAccess insert error:", insertError);
      }

      window.userPlan = "free";
      return "free";
    }

    if (typeof window.loadUserAccess === "function") {
      await window.loadUserAccess(userId);
      return window.userPlan || "free";
    }

    window.userPlan = "free";
    return "free";
  } catch (err) {
    console.error("ensureUserAccess unexpected error:", err);
    window.userPlan = "free";
    return "free";
  }
}
  
  async function init() {
  const guard = window.AgentAcademyGuard;
    if (!guard || !guard.requireLogin) {
  console.error("AgentAcademyGuard not available");
  return;
}
    cacheDom();
    bindEvents();
    renderStatic();

    try {
      const access = await guard.requireLogin({
  loginUrl: "/agent-academy/login.html"
});

if (!access) return;

await ensureUserAccess(access.user.id);

await loadUserAccess(access.user.id);

state.access = {
  ...access,
  plan: window.userPlan,
  role: window.userRole
};

console.log("FINAL ACCESS STATE:", state.access);
renderAccess();
      
    } catch (error) {
      console.error("Dashboard init error:", error);
    }
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", AgentAcademyDashboard.init);
