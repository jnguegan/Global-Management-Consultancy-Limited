/* assets/js/i18n.js
   GlobalMGM i18n (EN/FR/ES) with localStorage persistence
*/
(function () {
  "use strict";

  const LANG_KEY = "gmc_lang";

  // Add keys for each page as we upgrade them (services, finance, contact, etc.)
  const translations = {
    en: {
      "lang.label": "Language",
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.finance": "Finance",
      "nav.contact": "Contact",
      "nav.partner": "Partner Enquiry",

      "hero.kicker": "International · Football · Finance",
      "hero.title": "Global Sport Finance and Football Agency Services",
      "hero.p1": "<strong>Global Management Consultancy Limited</strong> is an international advisory and services firm operating at the intersection of professional football and cross-border financial infrastructure.",
      "hero.p2": "We provide specialised football agency services and modern financial solutions through <strong>Global Sport Finance</strong>, supporting professional football clubs, agencies and players with multi-currency accounts, foreign exchange, international payments and card-based expense management.",
      "hero.p3": "Football is inherently international. Salaries, bonuses, transfers, sponsorship revenues and operating costs move across countries and currencies every day. Generic banking and payment solutions are rarely designed for this reality. Global Management Consultancy Limited was created to address this gap by combining sports industry expertise with modern financial services built specifically for international football operations.",
      "hero.p4": "Through <strong>Global Sport Finance</strong>, we deliver integrated treasury workflows, FX optimisation, cross-border payments and operational spending controls, helping clubs and agencies manage their financial operations efficiently while supporting players with practical tools for international living, travel and career mobility.",
      "hero.p5": "Our football agency services complement this financial infrastructure by providing professional representation, career strategy, contract negotiation support and club relations within the global game.",
      "hero.p6": "Our work is international by design and compliance-driven by structure. All payment services, e-money accounts, card issuing and foreign exchange services are delivered in partnership with FCA and EU regulated financial institutions, ensuring secure, compliant and scalable solutions for our international clients.",
      "hero.p7": "Global Management Consultancy Limited combines football industry expertise and institutional-grade financial infrastructure to support the modern realities of the global football ecosystem.",

      "cta.finance": "Explore Global Sport Finance",
      "cta.services": "View services",
      "cta.contact": "Contact",

      "cred.strip": "Commercial & contractual consulting · Partner onboarding · Global Management Consultancy Limited",

      "cards.finance.title": "Global Sport Finance",
      "cards.finance.text": "Multi-currency, FX, cross-border payments, cards and expense workflows tailored to football operations.",
      "cards.agency.title": "Football Agency",
      "cards.agency.text": "Representation, career strategy, negotiations, and player-focused support within the professional game.",
      "cards.primary": "Primary focus",

      "footer.company": "Global Management Consultancy Limited",
      "footer.legal": "Legal",
      "footer.terms": "Terms",
      "footer.privacy": "Privacy",
      "footer.cookies": "Cookies",
      "footer.notice": "<strong>Important notice:</strong> Content on this website is provided for general information only and does not constitute legal, tax, investment or financial advice.",
      "footer.regulatory": "<strong>Regulatory:</strong> Services described may include commercial and contractual consulting. If any activity falls within UK financial services regulation (including FCA-regulated activities), such services are provided only where authorised or through appropriately authorised partners. Clients should obtain independent professional advice.",
      "footer.rights": "Global Management Consultancy Limited. All rights reserved."
    },

    fr: {
      "lang.label": "Langue",
      "nav.home": "Accueil",
      "nav.services": "Services",
      "nav.finance": "Finance",
      "nav.contact": "Contact",
      "nav.partner": "Demande de partenariat",

      "hero.kicker": "International · Football · Finance",
      "hero.title": "Finance du sport & services d’agence de football",
      "hero.p1": "<strong>Global Management Consultancy Limited</strong> est un cabinet international de conseil et de services, au croisement du football professionnel et des infrastructures financières transfrontalières.",
      "hero.p2": "Nous proposons des services spécialisés d’agence de football et des solutions financières modernes via <strong>Global Sport Finance</strong>, en accompagnant clubs, agences et joueurs avec des comptes multidevises, du change, des paiements internationaux et une gestion des dépenses par cartes.",
      "hero.p3": "Le football est par nature international. Salaires, primes, transferts, revenus de sponsoring et coûts d’exploitation circulent chaque jour entre pays et devises. Les solutions bancaires génériques sont rarement conçues pour cette réalité. Global Management Consultancy Limited a été créée pour combler ce manque en combinant expertise du secteur sportif et services financiers modernes conçus pour les opérations internationales du football.",
      "hero.p4": "Via <strong>Global Sport Finance</strong>, nous déployons des flux de trésorerie intégrés, l’optimisation FX, des paiements transfrontaliers et des contrôles de dépenses, afin d’aider clubs et agences à gérer efficacement leurs opérations financières tout en offrant aux joueurs des outils pratiques pour la vie internationale, les déplacements et la mobilité de carrière.",
      "hero.p5": "Nos services d’agence de football complètent cette infrastructure financière : représentation professionnelle, stratégie de carrière, appui à la négociation des contrats et relations clubs à l’échelle mondiale.",
      "hero.p6": "Notre activité est internationale par conception et structurée autour de la conformité. Les services de paiement, comptes de monnaie électronique, émission de cartes et services de change sont fournis en partenariat avec des institutions financières régulées FCA et UE, garantissant des solutions sûres, conformes et évolutives.",
      "hero.p7": "Global Management Consultancy Limited associe expertise du football et infrastructure financière de niveau institutionnel pour répondre aux réalités actuelles de l’écosystème mondial du football.",

      "cta.finance": "Découvrir Global Sport Finance",
      "cta.services": "Voir les services",
      "cta.contact": "Contact",

      "cred.strip": "Conseil commercial & contractuel · Onboarding partenaires · Global Management Consultancy Limited",

      "cards.finance.title": "Global Sport Finance",
      "cards.finance.text": "Multidevises, change, paiements transfrontaliers, cartes et flux de dépenses adaptés aux opérations football.",
      "cards.agency.title": "Agence de football",
      "cards.agency.text": "Représentation, stratégie de carrière, négociations et accompagnement des joueurs dans le football professionnel.",
      "cards.primary": "Priorité",

      "footer.company": "Global Management Consultancy Limited",
      "footer.legal": "Mentions légales",
      "footer.terms": "Conditions",
      "footer.privacy": "Confidentialité",
      "footer.cookies": "Cookies",
      "footer.notice": "<strong>Information importante :</strong> Le contenu de ce site est fourni à titre informatif et ne constitue pas un conseil juridique, fiscal, d’investissement ou financier.",
      "footer.regulatory": "<strong>Réglementation :</strong> Les services décrits peuvent inclure du conseil commercial et contractuel. Si une activité relève de la réglementation des services financiers au Royaume-Uni (y compris les activités régulées par la FCA), ces services ne sont fournis que lorsqu’ils sont autorisés ou via des partenaires dûment autorisés. Les clients doivent solliciter un avis professionnel indépendant.",
      "footer.rights": "Global Management Consultancy Limited. Tous droits réservés."
    },

    es: {
      "lang.label": "Idioma",
      "nav.home": "Inicio",
      "nav.services": "Servicios",
      "nav.finance": "Finanzas",
      "nav.contact": "Contacto",
      "nav.partner": "Solicitud de partnership",

      "hero.kicker": "Internacional · Fútbol · Finanzas",
      "hero.title": "Finanzas deportivas y servicios de agencia de fútbol",
      "hero.p1": "<strong>Global Management Consultancy Limited</strong> es una firma internacional de asesoría y servicios que opera en la intersección entre el fútbol profesional y la infraestructura financiera transfronteriza.",
      "hero.p2": "Ofrecemos servicios especializados de agencia de fútbol y soluciones financieras modernas a través de <strong>Global Sport Finance</strong>, apoyando a clubes, agencias y jugadores con cuentas multidivisa, cambio de divisas, pagos internacionales y gestión de gastos con tarjetas.",
      "hero.p3": "El fútbol es inherentemente internacional. Salarios, primas, traspasos, ingresos por patrocinio y costes operativos se mueven cada día entre países y monedas. Las soluciones bancarias genéricas rara vez están diseñadas para esta realidad. Global Management Consultancy Limited se creó para cubrir este vacío combinando experiencia en la industria deportiva con servicios financieros modernos diseñados específicamente para operaciones internacionales del fútbol.",
      "hero.p4": "A través de <strong>Global Sport Finance</strong>, ofrecemos flujos integrados de tesorería, optimización de FX, pagos transfronterizos y controles de gasto operativo, ayudando a clubes y agencias a gestionar eficientemente sus operaciones financieras y apoyando a los jugadores con herramientas prácticas para la vida internacional, viajes y movilidad profesional.",
      "hero.p5": "Nuestros servicios de agencia de fútbol complementan esta infraestructura financiera mediante representación profesional, estrategia de carrera, apoyo en negociación de contratos y relaciones con clubes en el fútbol global.",
      "hero.p6": "Nuestro trabajo es internacional por diseño y está estructurado con enfoque de cumplimiento. Los servicios de pago, cuentas de dinero electrónico, emisión de tarjetas y servicios de cambio se prestan en colaboración con instituciones financieras reguladas por la FCA y la UE, garantizando soluciones seguras, conformes y escalables para clientes internacionales.",
      "hero.p7": "Global Management Consultancy Limited combina experiencia en el fútbol con infraestructura financiera de nivel institucional para apoyar las realidades modernas del ecosistema futbolístico global.",

      "cta.finance": "Explorar Global Sport Finance",
      "cta.services": "Ver servicios",
      "cta.contact": "Contacto",

      "cred.strip": "Consultoría comercial y contractual · Onboarding de partners · Global Management Consultancy Limited",

      "cards.finance.title": "Global Sport Finance",
      "cards.finance.text": "Multidivisa, FX, pagos transfronterizos, tarjetas y flujos de gastos adaptados a operaciones futbolísticas.",
      "cards.agency.title": "Agencia de fútbol",
      "cards.agency.text": "Representación, estrategia de carrera, negociaciones y apoyo centrado en el jugador dentro del fútbol profesional.",
      "cards.primary": "Enfoque principal",

      "footer.company": "Global Management Consultancy Limited",
      "footer.legal": "Legal",
      "footer.terms": "Términos",
      "footer.privacy": "Privacidad",
      "footer.cookies": "Cookies",
      "footer.notice": "<strong>Aviso importante:</strong> El contenido de este sitio web se proporciona solo con fines informativos y no constituye asesoramiento legal, fiscal, de inversión o financiero.",
      "footer.regulatory": "<strong>Regulatorio:</strong> Los servicios descritos pueden incluir consultoría comercial y contractual. Si alguna actividad se encuentra dentro de la regulación de servicios financieros del Reino Unido (incluidas actividades reguladas por la FCA), dichos servicios se prestan únicamente cuando estén autorizados o a través de partners debidamente autorizados. Los clientes deben obtener asesoramiento profesional independiente.",
      "footer.rights": "Global Management Consultancy Limited. Todos los derechos reservados."
    }
  };

  function getInitialLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && translations[saved]) return saved;

    const htmlLang = (document.documentElement.lang || "en").toLowerCase();
    if (translations[htmlLang]) return htmlLang;

    return "en";
  }

  function setActiveLangUI(lang) {
    document.querySelectorAll(".langBtn").forEach((btn) => {
      const pressed = btn.dataset.lang === lang;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
  }

  function applyI18n(lang) {
    const dict = translations[lang] || translations.en;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if (typeof val === "string") {
        // Controlled translations (we own the strings), so innerHTML is OK for <strong>, etc.
        el.innerHTML = val;
      }
    });

    // Keep dropdown in sync (if present)
    const select = document.getElementById("langSelect");
    if (select) select.value = lang;

    // Keep buttons in sync (if present)
    setActiveLangUI(lang);
  }

  function setLang(lang) {
    if (!translations[lang]) lang = "en";
    localStorage.setItem(LANG_KEY, lang);
    applyI18n(lang);
  }

  function initLangToggle() {
    const initial = getInitialLang();
    applyI18n(initial);

    // Dropdown (preferred)
    const select = document.getElementById("langSelect");
    if (select) {
      select.value = initial;
      select.addEventListener("change", () => setLang(select.value));
    }

    // Buttons (legacy support)
    document.querySelectorAll(".langBtn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initYear();
      initLangToggle();
    });
  } else {
    initYear();
    initLangToggle();
  }

  // Optional: expose setter if you ever need it
  window.gmcSetLang = setLang;
})();
