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
      "footer.rights": "Global Management Consultancy Limited. All rights reserved.",

       "partner.title": "Partner Enquiry",
"partner.intro": "Submit a commercial enquiry for partnership discussions. This form is for general business enquiries and does not constitute regulated financial services onboarding.",
"partner.botlabel": "Don’t fill this out:",
"partner.fullname": "Full name *",
"partner.company": "Company / Organisation *",
"partner.country": "Country *",
"partner.email": "Email *",
"partner.phone": "Phone (optional)",
"partner.enquirytype": "Nature of enquiry *",
"partner.selectone": "Select one…",
"partner.enquiry.card": "Card Issuing & Payment Services",
"partner.enquiry.fx": "Foreign Exchange & International Payments",
"partner.enquiry.football": "Football Commercial & Contract Representation",
"partner.enquiry.other": "Other Commercial Enquiries",
"partner.orgtype": "Type of Organisation",
"partner.org.fintech": "Fintech / Payments Provider",
"partner.org.broker": "Brokerage / Liquidity Provider",
"partner.org.club": "Football Club / Agency",
"partner.org.corp": "Corporate / Commercial Partner",
"partner.org.individual": "Individual (Other)",
"partner.jurisdiction": "Jurisdiction of Interest",
"partner.jur.uk": "United Kingdom",
"partner.jur.eu": "European Union",
"partner.jur.africa": "Africa",
"partner.jur.me": "Middle East",
"partner.jur.other": "Other",
"partner.timeline": "Timeline",
"partner.time.immediate": "Immediate (0–2 weeks)",
"partner.time.short": "Short term (2–6 weeks)",
"partner.time.medium": "Medium term (6–12 weeks)",
"partner.time.exploratory": "Exploratory (no fixed timeline)",
"partner.message": "Brief description *",
"partner.placeholder": "Please summarise your request, relevant jurisdictions, and preferred next step (intro call / email).",
"partner.consent": "I confirm I am submitting this enquiry for business purposes and I have read the Privacy notice.",
"partner.submit": "Submit enquiry",
"partner.sla": "We typically respond within 1–2 business days.",
"partner.note": "<strong>Note:</strong> Please do not submit account credentials, payment details, or sensitive personal information through this form.",
       "services.kicker": "Services",
      "services.title": "Focused services for football and finance",
      "services.p1": "Global Management Consultancy Limited provides two core service lines designed for the realities of international football operations.",
      "services.p2": "Our primary focus is <strong>Global Sport Finance</strong> and <strong>Football Agency Services</strong>, supporting clubs, agencies and professional players with modern financial infrastructure and professional representation.",

      "services.card1.title": "Global Sport Finance",
      "services.card1.li1": "Multi-currency accounts and wallets",
      "services.card1.li2": "Foreign exchange and treasury workflows",
      "services.card1.li3": "Local and international payments",
      "services.card1.li4": "Mass payouts for salaries, bonuses and suppliers",
      "services.card1.li5": "Club and player cards (physical and virtual)",
      "services.card1.li6": "Expense management and spending controls",

      "services.card2.title": "Football Agency Services",
      "services.card2.li1": "Player representation and career planning",
      "services.card2.li2": "Contract negotiation support",
      "services.card2.li3": "Club relations and opportunity sourcing",
      "services.card2.li4": "International mobility guidance",
      "services.card2.li5": "Strategic career advisory",
       "finance.kicker": "Global Sport Finance",
      "finance.title": "Financial infrastructure for the global football ecosystem",
      "finance.p1": "Global Sport Finance is a specialised financial services platform provided by <strong>Global Management Consultancy Limited</strong>, designed to help football clubs, agencies and professional players manage money seamlessly across borders.",
      "finance.p2": "Built specifically for the international football industry, we combine multi-currency accounts, foreign exchange, international payments and card-based expense management into one integrated solution — delivered in partnership with regulated financial institutions.",

      "finance.who.title": "Who we serve",
      "finance.who.li1": "Professional football clubs",
      "finance.who.li2": "Player agencies and management companies",
      "finance.who.li3": "Professional players and image rights vehicles",
      "finance.who.li4": "Academies, training centres and strategic partners",

      "finance.services.title": "Our services",
      "finance.services.li1": "Multi-currency accounts and wallets",
      "finance.services.li2": "Local and international IBANs",
      "finance.services.li3": "Institutional FX pricing and conversion",
      "finance.services.li4": "Local and international payments",
      "finance.services.li5": "Mass payouts (salaries, bonuses, suppliers)",
      "finance.services.li6": "Club and player cards",
      "finance.services.li7": "Expense management and spending controls",

      "finance.why.title": "Why Global Sport Finance",
      "finance.why.p1": "Football is inherently international. Salaries, bonuses, transfers and operating costs move across countries and currencies every day. Generic banking solutions are rarely designed for this reality.",
      "finance.why.li1": "Designed for international football operations",
      "finance.why.li2": "Built for football-specific workflows",
      "finance.why.li3": "Institutional-grade financial partners",
      "finance.why.li4": "Scalable across clubs, agencies and player structures",

      "finance.approach.title": "Our approach",
      "finance.approach.p1": "Global Sport Finance operates as a specialised service line within <strong>Global Management Consultancy Limited</strong>, combining financial infrastructure with deep football industry expertise.",
      "finance.approach.p2": "All payment services, e-money accounts, card issuing and foreign exchange services are delivered in partnership with FCA and EU regulated financial institutions.",

      "finance.reg.title": "Regulatory Notice",
      "finance.reg.p1": "Global Sport Finance is a service provided by <strong>Global Management Consultancy Limited</strong>. Payment services, e-money accounts, card issuing and foreign exchange services are provided by regulated Electronic Money Institutions and Payment Institutions.",
      "finance.reg.p2": "Global Management Consultancy Limited does not itself provide regulated payment services.",
         "contact.kicker": "Contact",
      "contact.title": "Send us a message",
      "contact.p1": "Tell us whether your enquiry is about Global Sport Finance or Football Agency services.",

      "contact.form.title": "Contact form",
      "contact.form.name": "Your name",
      "contact.form.email": "Email address",
      "contact.form.subject": "Subject (Finance / Agency)",
      "contact.form.message": "Your message",
      "contact.form.send": "Send",

      "contact.note": "For commercial partnerships, use the <a href=\"partner-enquiry.html\">Partner Enquiry</a> form.",

      "contact.include.title": "What to include",
      "contact.include.li1": "Finance or Agency",
      "contact.include.li2": "Countries involved (if cross-border)",
      "contact.include.li3": "Time sensitivity",
      "contact.include.li4": "Best way to reach you",
        "terms.title": "Terms",
      "terms.last": "Last updated:",

      "terms.1.title": "1. Information only",
      "terms.1.text": "Content on this website is provided for general information purposes only and does not constitute professional advice.",

      "terms.2.title": "2. No reliance",
      "terms.2.text": "You should not rely on the information on this website as an alternative to legal, tax, financial, or other professional advice.",

      "terms.3.title": "3. Services and regulation",
      "terms.3.text": "Any services described may include commercial and contractual consulting. Where an activity is subject to regulation, it is provided only where authorised or through appropriately authorised partners, as applicable.",

      "terms.4.title": "4. Intellectual property",
      "terms.4.text": "Unless stated otherwise, all content is owned by or licensed to Global Management Consultancy Limited. You may not reproduce it without permission.",

      "terms.5.title": "5. Limitation of liability",
      "terms.5.text": "To the extent permitted by law, we are not liable for any loss arising from use of this website or reliance on its content.",

      "terms.6.title": "6. Third-party links",
      "terms.6.text": "Links to third-party sites are provided for convenience only. We do not endorse and are not responsible for their content.",

      "terms.7.title": "7. Contact",
      "terms.7.text": "For legal requests or notices, please use the contact method provided on the Contact page.",
      "privacy.title": "Privacy",
      "privacy.last": "Last updated:",

      "privacy.1.title": "1. Who we are",
      "privacy.1.text": "This website is operated by Global Management Consultancy Limited (“we”, “us”, “our”).",

      "privacy.2.title": "2. What data we collect",
      "privacy.2.text": "We may collect information you submit via forms (such as name, email, phone, company details, and message content).",

      "privacy.3.title": "3. How we use your data",
      "privacy.3.li1": "To respond to enquiries and provide requested information",
      "privacy.3.li2": "To operate, maintain, and improve our website",
      "privacy.3.li3": "To meet legal and compliance obligations",

      "privacy.4.title": "4. Legal bases",
      "privacy.4.text": "Where applicable under data protection laws, we process personal data based on legitimate interests, consent (where requested), and compliance with legal obligations.",

      "privacy.5.title": "5. Sharing",
      "privacy.5.text": "We do not sell personal data. We may share with service providers who support website operations (e.g., hosting, forms) and professional advisers, where necessary.",

      "privacy.6.title": "6. Retention",
      "privacy.6.text": "We keep personal data only as long as needed for the purposes above or as required by law.",

      "privacy.7.title": "7. Your rights",
      "privacy.7.text": "You may have rights to access, correct, delete, or restrict processing of your personal data. Requests can be made via the Contact page.",

      "privacy.8.title": "8. International transfers",
      "privacy.8.text": "Where data is transferred internationally, we use appropriate safeguards where required.",

      "privacy.9.title": "9. Security",
      "privacy.9.text": "We take reasonable measures to protect personal data, but no method of transmission is completely secure.",


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
      "footer.rights": "Global Management Consultancy Limited. Tous droits réservés.",
       "partner.title": "Demande de partenariat",
"partner.intro": "Soumettez une demande commerciale pour discuter d’un partenariat. Ce formulaire concerne des demandes générales et ne constitue pas un onboarding de services financiers réglementés.",
"partner.botlabel": "Ne remplissez pas ce champ :",
"partner.fullname": "Nom complet *",
"partner.company": "Entreprise / Organisation *",
"partner.country": "Pays *",
"partner.email": "E-mail *",
"partner.phone": "Téléphone (optionnel)",
"partner.enquirytype": "Nature de la demande *",
"partner.selectone": "Sélectionnez…",
"partner.enquiry.card": "Émission de cartes & services de paiement",
"partner.enquiry.fx": "Change (FX) & paiements internationaux",
"partner.enquiry.football": "Représentation commerciale & contractuelle (football)",
"partner.enquiry.other": "Autres demandes commerciales",
"partner.orgtype": "Type d’organisation",
"partner.org.fintech": "Fintech / Prestataire de paiement",
"partner.org.broker": "Brokerage / Fournisseur de liquidité",
"partner.org.club": "Club / Agence de football",
"partner.org.corp": "Partenaire corporate / commercial",
"partner.org.individual": "Individu (autre)",
"partner.jurisdiction": "Juridiction d’intérêt",
"partner.jur.uk": "Royaume-Uni",
"partner.jur.eu": "Union européenne",
"partner.jur.africa": "Afrique",
"partner.jur.me": "Moyen-Orient",
"partner.jur.other": "Autre",
"partner.timeline": "Calendrier",
"partner.time.immediate": "Immédiat (0–2 semaines)",
"partner.time.short": "Court terme (2–6 semaines)",
"partner.time.medium": "Moyen terme (6–12 semaines)",
"partner.time.exploratory": "Exploratoire (pas de calendrier fixe)",
"partner.message": "Description brève *",
"partner.placeholder": "Merci de résumer votre demande, les juridictions concernées et la prochaine étape souhaitée (appel d’intro / e-mail).",
"partner.consent": "Je confirme soumettre cette demande à des fins professionnelles et avoir lu la notice de confidentialité.",
"partner.submit": "Envoyer la demande",
"partner.sla": "Nous répondons généralement sous 1 à 2 jours ouvrés.",
"partner.note": "<strong>Note :</strong> Merci de ne pas transmettre d’identifiants, de détails de paiement ou d’informations sensibles via ce formulaire.",

      "services.kicker": "Services",
      "services.title": "Des services ciblés pour le football et la finance",
      "services.p1": "Global Management Consultancy Limited propose deux lignes de services principales adaptées aux réalités des opérations internationales du football.",
      "services.p2": "Notre priorité est <strong>Global Sport Finance</strong> et les <strong>services d’agence de football</strong>, en accompagnant clubs, agences et joueurs professionnels grâce à une infrastructure financière moderne et une représentation professionnelle.",

      "services.card1.title": "Global Sport Finance",
      "services.card1.li1": "Comptes et portefeuilles multidevises",
      "services.card1.li2": "Change (FX) et gestion de trésorerie",
      "services.card1.li3": "Paiements locaux et internationaux",
      "services.card1.li4": "Paiements en masse : salaires, primes et fournisseurs",
      "services.card1.li5": "Cartes club et joueurs (physiques et virtuelles)",
      "services.card1.li6": "Gestion des dépenses et contrôles de paiement",

      "services.card2.title": "Services d’agence de football",
      "services.card2.li1": "Représentation des joueurs et planification de carrière",
      "services.card2.li2": "Assistance à la négociation contractuelle",
      "services.card2.li3": "Relations clubs et sourcing d’opportunités",
      "services.card2.li4": "Accompagnement à la mobilité internationale",
      "services.card2.li5": "Conseil stratégique de carrière",
      "finance.kicker": "Global Sport Finance",
      "finance.title": "Infrastructure financière pour l’écosystème mondial du football",
      "finance.p1": "Global Sport Finance est une plateforme de services financiers spécialisés fournie par <strong>Global Management Consultancy Limited</strong>, conçue pour aider les clubs, agences et joueurs professionnels à gérer leurs finances facilement au-delà des frontières.",
      "finance.p2": "Conçue spécifiquement pour l’industrie internationale du football, nous combinons comptes multidevises, change (FX), paiements internationaux et gestion des dépenses par cartes dans une solution intégrée — fournie en partenariat avec des institutions financières régulées.",

      "finance.who.title": "À qui s’adresse notre offre",
      "finance.who.li1": "Clubs de football professionnels",
      "finance.who.li2": "Agences de joueurs et sociétés de management",
      "finance.who.li3": "Joueurs professionnels et structures de droits à l’image",
      "finance.who.li4": "Académies, centres de formation et partenaires stratégiques",

      "finance.services.title": "Nos services",
      "finance.services.li1": "Comptes et portefeuilles multidevises",
      "finance.services.li2": "IBAN locaux et internationaux",
      "finance.services.li3": "Tarification FX institutionnelle et conversion",
      "finance.services.li4": "Paiements locaux et internationaux",
      "finance.services.li5": "Paiements en masse (salaires, primes, fournisseurs)",
      "finance.services.li6": "Cartes club et joueurs",
      "finance.services.li7": "Gestion des dépenses et contrôles de paiement",

      "finance.why.title": "Pourquoi Global Sport Finance",
      "finance.why.p1": "Le football est par nature international. Salaires, primes, transferts et coûts d’exploitation circulent chaque jour entre pays et devises. Les solutions bancaires classiques sont rarement conçues pour cette réalité.",
      "finance.why.li1": "Conçu pour les opérations internationales du football",
      "finance.why.li2": "Adapté aux flux spécifiques du football",
      "finance.why.li3": "Partenaires financiers de niveau institutionnel",
      "finance.why.li4": "Évolutif pour clubs, agences et structures de joueurs",

      "finance.approach.title": "Notre approche",
      "finance.approach.p1": "Global Sport Finance fonctionne comme une ligne de service spécialisée au sein de <strong>Global Management Consultancy Limited</strong>, combinant infrastructure financière et expertise approfondie du football.",
      "finance.approach.p2": "Tous les services de paiement, comptes de monnaie électronique, émission de cartes et services de change sont fournis en partenariat avec des institutions financières régulées FCA et UE.",

      "finance.reg.title": "Avis réglementaire",
      "finance.reg.p1": "Global Sport Finance est un service fourni par <strong>Global Management Consultancy Limited</strong>. Les services de paiement, comptes de monnaie électronique, émission de cartes et services de change sont fournis par des établissements de monnaie électronique et établissements de paiement régulés.",
      "finance.reg.p2": "Global Management Consultancy Limited ne fournit pas directement de services de paiement réglementés.",
      "contact.kicker": "Contact",
      "contact.title": "Envoyez-nous un message",
      "contact.p1": "Indiquez si votre demande concerne Global Sport Finance ou les services d’agence de football.",

      "contact.form.title": "Formulaire de contact",
      "contact.form.name": "Votre nom",
      "contact.form.email": "Adresse e-mail",
      "contact.form.subject": "Objet (Finance / Agence)",
      "contact.form.message": "Votre message",
      "contact.form.send": "Envoyer",

      "contact.note": "Pour les partenariats commerciaux, utilisez le formulaire <a href=\"partner-enquiry.html\">Demande de partenariat</a>.",

      "contact.include.title": "À inclure dans votre message",
      "contact.include.li1": "Finance ou Agence",
      "contact.include.li2": "Pays concernés (si transfrontalier)",
      "contact.include.li3": "Niveau d’urgence",
      "contact.include.li4": "Meilleur moyen de vous contacter",
      "terms.title": "Conditions",
      "terms.last": "Dernière mise à jour :", 

      "terms.1.title": "1. Informations générales",
      "terms.1.text": "Le contenu de ce site est fourni à titre informatif uniquement et ne constitue pas un conseil professionnel.",

      "terms.2.title": "2. Absence de reliance",
      "terms.2.text": "Vous ne devez pas vous appuyer sur les informations de ce site comme alternative à un conseil juridique, fiscal, financier ou autre conseil professionnel.",

      "terms.3.title": "3. Services et réglementation",
      "terms.3.text": "Les services décrits peuvent inclure du conseil commercial et contractuel. Lorsqu’une activité est soumise à réglementation, elle n’est fournie que lorsqu’elle est autorisée ou via des partenaires dûment autorisés, selon le cas.",

      "terms.4.title": "4. Propriété intellectuelle",
      "terms.4.text": "Sauf indication contraire, l’ensemble du contenu appartient à Global Management Consultancy Limited ou est utilisé sous licence. Vous ne pouvez pas le reproduire sans autorisation.",

      "terms.5.title": "5. Limitation de responsabilité",
      "terms.5.text": "Dans la limite autorisée par la loi, nous ne sommes pas responsables des pertes résultant de l’utilisation de ce site ou de la confiance accordée à son contenu.",

      "terms.6.title": "6. Liens vers des tiers",
      "terms.6.text": "Les liens vers des sites tiers sont fournis uniquement pour votre commodité. Nous ne les approuvons pas et ne sommes pas responsables de leur contenu.",

      "terms.7.title": "7. Contact",
      "terms.7.text": "Pour toute demande ou notification juridique, veuillez utiliser les coordonnées indiquées sur la page Contact.",
      "privacy.title": "Confidentialité",
      "privacy.last": "Dernière mise à jour :", 

      "privacy.1.title": "1. Qui sommes-nous",
      "privacy.1.text": "Ce site web est exploité par Global Management Consultancy Limited (« nous », « notre »).",

      "privacy.2.title": "2. Données collectées",
      "privacy.2.text": "Nous pouvons collecter les informations que vous soumettez via les formulaires (nom, e-mail, téléphone, informations d’entreprise et contenu du message).",

      "privacy.3.title": "3. Utilisation de vos données",
      "privacy.3.li1": "Répondre aux demandes et fournir les informations sollicitées",
      "privacy.3.li2": "Exploiter, maintenir et améliorer notre site web",
      "privacy.3.li3": "Respecter nos obligations légales et de conformité",

      "privacy.4.title": "4. Bases légales",
      "privacy.4.text": "Lorsque la législation sur la protection des données s’applique, nous traitons les données personnelles sur la base de nos intérêts légitimes, du consentement (lorsqu’il est demandé) et du respect de nos obligations légales.",

      "privacy.5.title": "5. Partage",
      "privacy.5.text": "Nous ne vendons pas vos données personnelles. Nous pouvons les partager avec des prestataires soutenant le fonctionnement du site (hébergement, formulaires) et avec des conseillers professionnels si nécessaire.",

      "privacy.6.title": "6. Conservation",
      "privacy.6.text": "Nous conservons les données personnelles uniquement le temps nécessaire aux finalités ci-dessus ou selon les exigences légales.",

      "privacy.7.title": "7. Vos droits",
      "privacy.7.text": "Vous pouvez disposer de droits d’accès, de rectification, de suppression ou de limitation du traitement de vos données. Les demandes peuvent être faites via la page Contact.",

      "privacy.8.title": "8. Transferts internationaux",
      "privacy.8.text": "Lorsque des données sont transférées à l’international, nous mettons en place les garanties appropriées lorsque cela est requis.",

      "privacy.9.title": "9. Sécurité",
      "privacy.9.text": "Nous prenons des mesures raisonnables pour protéger les données personnelles, mais aucune méthode de transmission n’est totalement sécurisée.",


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
      "footer.rights": "Global Management Consultancy Limited. Todos los derechos reservados.",
       "partner.title": "Solicitud de partnership",
"partner.intro": "Envía una consulta comercial para conversaciones de partnership. Este formulario es para consultas generales y no constituye un alta/onboarding de servicios financieros regulados.",
"partner.botlabel": "No rellenes esto:",
"partner.fullname": "Nombre completo *",
"partner.company": "Empresa / Organización *",
"partner.country": "País *",
"partner.email": "Email *",
"partner.phone": "Teléfono (opcional)",
"partner.enquirytype": "Tipo de consulta *",
"partner.selectone": "Selecciona…",
"partner.enquiry.card": "Emisión de tarjetas y servicios de pago",
"partner.enquiry.fx": "Cambio de divisas (FX) y pagos internacionales",
"partner.enquiry.football": "Representación comercial y contractual (fútbol)",
"partner.enquiry.other": "Otras consultas comerciales",
"partner.orgtype": "Tipo de organización",
"partner.org.fintech": "Fintech / Proveedor de pagos",
"partner.org.broker": "Brokerage / Proveedor de liquidez",
"partner.org.club": "Club / Agencia de fútbol",
"partner.org.corp": "Partner corporativo / comercial",
"partner.org.individual": "Individual (otro)",
"partner.jurisdiction": "Jurisdicción de interés",
"partner.jur.uk": "Reino Unido",
"partner.jur.eu": "Unión Europea",
"partner.jur.africa": "África",
"partner.jur.me": "Oriente Medio",
"partner.jur.other": "Otro",
"partner.timeline": "Plazos",
"partner.time.immediate": "Inmediato (0–2 semanas)",
"partner.time.short": "Corto plazo (2–6 semanas)",
"partner.time.medium": "Medio plazo (6–12 semanas)",
"partner.time.exploratory": "Exploratorio (sin plazo fijo)",
"partner.message": "Descripción breve *",
"partner.placeholder": "Resume tu solicitud, jurisdicciones relevantes y el siguiente paso preferido (llamada introductoria / email).",
"partner.consent": "Confirmo que envío esta consulta con fines comerciales y que he leído el aviso de privacidad.",
"partner.submit": "Enviar consulta",
"partner.sla": "Normalmente respondemos en 1–2 días laborables.",
"partner.note": "<strong>Nota:</strong> No envíes credenciales, datos de pago ni información personal sensible a través de este formulario.",
      "services.kicker": "Servicios",
      "services.title": "Servicios especializados para fútbol y finanzas",
      "services.p1": "Global Management Consultancy Limited ofrece dos líneas principales de servicios diseñadas para la realidad de las operaciones internacionales del fútbol.",
      "services.p2": "Nuestro enfoque principal es <strong>Global Sport Finance</strong> y los <strong>servicios de agencia de fútbol</strong>, apoyando a clubes, agencias y jugadores profesionales con infraestructura financiera moderna y representación profesional.",

      "services.card1.title": "Global Sport Finance",
      "services.card1.li1": "Cuentas y monederos multidivisa",
      "services.card1.li2": "Cambio de divisas (FX) y flujos de tesorería",
      "services.card1.li3": "Pagos locales e internacionales",
      "services.card1.li4": "Pagos masivos para salarios, primas y proveedores",
      "services.card1.li5": "Tarjetas para clubes y jugadores (físicas y virtuales)",
      "services.card1.li6": "Gestión de gastos y controles de gasto",

      "services.card2.title": "Servicios de agencia de fútbol",
      "services.card2.li1": "Representación de jugadores y planificación de carrera",
      "services.card2.li2": "Apoyo en negociación de contratos",
      "services.card2.li3": "Relación con clubes y búsqueda de oportunidades",
      "services.card2.li4": "Orientación para movilidad internacional",
      "services.card2.li5": "Asesoría estratégica de carrera",
      "finance.kicker": "Global Sport Finance",
      "finance.title": "Infraestructura financiera para el ecosistema global del fútbol",
      "finance.p1": "Global Sport Finance es una plataforma especializada de servicios financieros ofrecida por <strong>Global Management Consultancy Limited</strong>, diseñada para ayudar a clubes, agencias y jugadores profesionales a gestionar su dinero sin fricciones a nivel internacional.",
      "finance.p2": "Diseñada específicamente para la industria internacional del fútbol, combinamos cuentas multidivisa, cambio de divisas (FX), pagos internacionales y gestión de gastos con tarjetas en una solución integrada — ofrecida en colaboración con instituciones financieras reguladas.",

      "finance.who.title": "A quién servimos",
      "finance.who.li1": "Clubes de fútbol profesionales",
      "finance.who.li2": "Agencias de jugadores y empresas de representación",
      "finance.who.li3": "Jugadores profesionales y estructuras de derechos de imagen",
      "finance.who.li4": "Academias, centros de formación y socios estratégicos",

      "finance.services.title": "Nuestros servicios",
      "finance.services.li1": "Cuentas y monederos multidivisa",
      "finance.services.li2": "IBAN locales e internacionales",
      "finance.services.li3": "Tipo de cambio institucional y conversión",
      "finance.services.li4": "Pagos locales e internacionales",
      "finance.services.li5": "Pagos masivos (salarios, primas y proveedores)",
      "finance.services.li6": "Tarjetas para clubes y jugadores",
      "finance.services.li7": "Gestión de gastos y controles de gasto",

      "finance.why.title": "Por qué Global Sport Finance",
      "finance.why.p1": "El fútbol es inherentemente internacional. Salarios, primas, traspasos y costes operativos se mueven cada día entre países y monedas. Las soluciones bancarias tradicionales rara vez están diseñadas para esta realidad.",
      "finance.why.li1": "Diseñado para operaciones internacionales de fútbol",
      "finance.why.li2": "Creado para flujos específicos del fútbol",
      "finance.why.li3": "Partners financieros de nivel institucional",
      "finance.why.li4": "Escalable para clubes, agencias y estructuras de jugadores",

      "finance.approach.title": "Nuestro enfoque",
      "finance.approach.p1": "Global Sport Finance opera como una línea de servicio especializada dentro de <strong>Global Management Consultancy Limited</strong>, combinando infraestructura financiera con experiencia profunda en la industria del fútbol.",
      "finance.approach.p2": "Todos los servicios de pago, cuentas de dinero electrónico, emisión de tarjetas y servicios de cambio se prestan en colaboración con instituciones financieras reguladas por la FCA y la UE.",

      "finance.reg.title": "Aviso regulatorio",
      "finance.reg.p1": "Global Sport Finance es un servicio proporcionado por <strong>Global Management Consultancy Limited</strong>. Los servicios de pago, cuentas de dinero electrónico, emisión de tarjetas y servicios de cambio son prestados por Entidades de Dinero Electrónico y Entidades de Pago reguladas.",
      "finance.reg.p2": "Global Management Consultancy Limited no presta directamente servicios de pago regulados.",
      "contact.kicker": "Contacto",
      "contact.title": "Envíanos un mensaje",
      "contact.p1": "Indica si tu consulta es sobre Global Sport Finance o servicios de agencia de fútbol.",

      "contact.form.title": "Formulario de contacto",
      "contact.form.name": "Tu nombre",
      "contact.form.email": "Correo electrónico",
      "contact.form.subject": "Asunto (Finanzas / Agencia)",
      "contact.form.message": "Tu mensaje",
      "contact.form.send": "Enviar",

      "contact.note": "Para partnerships comerciales, utiliza el formulario de <a href=\"partner-enquiry.html\">Solicitud de partnership</a>.",

      "contact.include.title": "Qué incluir",
      "contact.include.li1": "Finanzas o Agencia",
      "contact.include.li2": "Países implicados (si es transfronterizo)",
      "contact.include.li3": "Urgencia / plazo",
      "contact.include.li4": "Mejor forma de contactarte",

      "terms.title": "Términos",
      "terms.last": "Última actualización:",

      "terms.1.title": "1. Solo información",
      "terms.1.text": "El contenido de este sitio web se proporciona únicamente con fines informativos y no constituye asesoramiento profesional.",

      "terms.2.title": "2. No dependencia",
      "terms.2.text": "No debe basarse en la información de este sitio web como alternativa a asesoramiento legal, fiscal, financiero u otro asesoramiento profesional.",

      "terms.3.title": "3. Servicios y regulación",
      "terms.3.text": "Los servicios descritos pueden incluir consultoría comercial y contractual. Cuando una actividad esté sujeta a regulación, se prestará únicamente cuando esté autorizada o a través de partners debidamente autorizados, según corresponda.",

      "terms.4.title": "4. Propiedad intelectual",
      "terms.4.text": "Salvo que se indique lo contrario, todo el contenido es propiedad de Global Management Consultancy Limited o se utiliza bajo licencia. No puede reproducirse sin permiso.",

      "terms.5.title": "5. Limitación de responsabilidad",
      "terms.5.text": "En la medida permitida por la ley, no somos responsables de ninguna pérdida derivada del uso de este sitio web o de la confianza depositada en su contenido.",

      "terms.6.title": "6. Enlaces de terceros",
      "terms.6.text": "Los enlaces a sitios web de terceros se proporcionan solo por conveniencia. No los respaldamos ni somos responsables de su contenido.",

      "terms.7.title": "7. Contacto",
      "terms.7.text": "Para solicitudes o notificaciones legales, utilice el método de contacto indicado en la página de Contacto.",
      "privacy.title": "Privacidad",
      "privacy.last": "Última actualización:",

      "privacy.1.title": "1. Quiénes somos",
      "privacy.1.text": "Este sitio web es operado por Global Management Consultancy Limited (“nosotros”, “nuestro”).",

      "privacy.2.title": "2. Qué datos recopilamos",
      "privacy.2.text": "Podemos recopilar información que envíes a través de formularios (como nombre, email, teléfono, datos de empresa y contenido del mensaje).",

      "privacy.3.title": "3. Cómo usamos tus datos",
      "privacy.3.li1": "Responder consultas y proporcionar la información solicitada",
      "privacy.3.li2": "Operar, mantener y mejorar nuestro sitio web",
      "privacy.3.li3": "Cumplir con obligaciones legales y de cumplimiento",

      "privacy.4.title": "4. Bases legales",
      "privacy.4.text": "Cuando sea aplicable bajo las leyes de protección de datos, procesamos datos personales basándonos en intereses legítimos, consentimiento (cuando se solicite) y cumplimiento de obligaciones legales.",

      "privacy.5.title": "5. Compartir datos",
      "privacy.5.text": "No vendemos datos personales. Podemos compartirlos con proveedores que apoyen el funcionamiento del sitio web (por ejemplo, hosting y formularios) y con asesores profesionales cuando sea necesario.",

      "privacy.6.title": "6. Conservación",
      "privacy.6.text": "Conservamos los datos personales solo el tiempo necesario para los fines anteriores o según lo requiera la ley.",

      "privacy.7.title": "7. Tus derechos",
      "privacy.7.text": "Puedes tener derechos de acceso, corrección, eliminación o restricción del tratamiento de tus datos personales. Las solicitudes pueden hacerse a través de la página de Contacto.",

      "privacy.8.title": "8. Transferencias internacionales",
      "privacy.8.text": "Cuando los datos se transfieren internacionalmente, aplicamos las salvaguardas adecuadas cuando sea necesario.",

      "privacy.9.title": "9. Seguridad",
      "privacy.9.text": "Tomamos medidas razonables para proteger los datos personales, pero ningún método de transmisión es completamente seguro.",

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
    // Translate placeholders (for forms)
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = dict[key];
      if (typeof val === "string") {
        el.setAttribute("placeholder", val);
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
