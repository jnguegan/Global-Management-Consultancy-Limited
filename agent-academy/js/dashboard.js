<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agent Academy Dashboard | GlobalMGM</title>

  <style>
    :root {
      --bg: #08111f;
      --panel: rgba(255,255,255,0.06);
      --border: rgba(255,255,255,0.12);
      --text: #edf3ff;
      --muted: rgba(237,243,255,0.74);
      --gold: #d4af37;
      --gold-soft: rgba(212,175,55,0.16);
      --radius-xl: 24px;
      --radius-lg: 18px;
      --shadow: 0 24px 80px rgba(0,0,0,0.34);
      --max-width: 1180px;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-family: Inter, Arial, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(212,175,55,0.10), transparent 30%),
        linear-gradient(180deg, #07101d 0%, #0a1425 100%);
      color: var(--text);
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .page-shell {
      min-height: 100vh;
      padding: 28px 18px 36px;
    }

    .container {
      max-width: var(--max-width);
      margin: 0 auto;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 22px;
    }

    .brand {
      color: var(--gold);
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .lang-switch {
      display: inline-flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .lang-btn,
    .action-btn,
    .card-btn {
      appearance: none;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.05);
      color: var(--text);
      border-radius: 999px;
      padding: 10px 16px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
    }

    .lang-btn:hover,
    .action-btn:hover,
    .card-btn:hover {
      transform: translateY(-1px);
      border-color: rgba(212,175,55,0.45);
      background: rgba(255,255,255,0.08);
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.35fr 0.9fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      backdrop-filter: blur(10px);
    }

    .hero-panel {
      padding: 28px;
    }

    .hero-panel h1 {
      margin: 0 0 12px;
      font-size: clamp(30px, 5vw, 48px);
      line-height: 1.04;
    }

    .hero-panel p {
      margin: 0;
      font-size: 17px;
      line-height: 1.75;
      color: var(--muted);
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-top: 18px;
      padding: 10px 14px;
      border-radius: 999px;
      background: var(--gold-soft);
      border: 1px solid rgba(212,175,55,0.35);
      color: #fff1c1;
      font-weight: 800;
      flex-wrap: wrap;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 20px;
    }

    .meta-panel {
      padding: 24px;
    }

    .meta-grid {
      display: grid;
      gap: 14px;
    }

    .meta-item {
      padding: 14px 16px;
      border-radius: 16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }

    .meta-label {
      display: block;
      margin-bottom: 6px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      font-weight: 800;
    }

    .meta-value {
      font-size: 16px;
      font-weight: 700;
      word-break: break-word;
    }

    .section-title {
      margin: 18px 0 10px;
      font-size: 24px;
    }

    .lead-text {
      margin: 0 0 16px;
      color: var(--muted);
      line-height: 1.8;
      font-size: 16px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
    }

    .tool-card {
      padding: 22px;
      display: flex;
      flex-direction: column;
      min-height: 255px;
    }

    .tool-badge {
      display: inline-flex;
      align-self: flex-start;
      min-height: 28px;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(212,175,55,0.12);
      border: 1px solid rgba(212,175,55,0.24);
      color: #ffefb5;
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 14px;
    }

    .tool-card h3 {
      margin: 0 0 10px;
      font-size: 21px;
    }

    .tool-card p {
      margin: 0 0 18px;
      color: var(--muted);
      line-height: 1.75;
      flex: 1;
    }

    .card-btn {
      display: inline-flex;
      align-self: flex-start;
      justify-content: center;
      align-items: center;
      min-width: 150px;
    }

    .footer {
      margin-top: 28px;
      padding-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.08);
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 1100px) {
      .hero-grid {
        grid-template-columns: 1fr;
      }

      .cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 720px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }

      .page-shell {
        padding: 20px 14px 28px;
      }

      .hero-panel,
      .meta-panel,
      .tool-card {
        border-radius: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="page-shell">
    <div class="container">

      <div class="topbar">
        <div class="brand">GlobalMGM · Agent Academy</div>

        <div class="lang-switch">
          <button type="button" class="lang-btn" data-lang="en">EN</button>
          <button type="button" class="lang-btn" data-lang="fr">FR</button>
          <button type="button" class="lang-btn" data-lang="es">ES</button>
        </div>
      </div>

      <section class="hero-grid">
        <div class="panel hero-panel">
          <h1 id="pageTitle">Agent Academy Dashboard</h1>
          <p id="pageSubtitle">Your training hub for FIFA Football Agent exam preparation.</p>

          <div class="status-chip">
            <span id="statusLabel">Access status</span>
            <strong id="statusValue">Checking access</strong>
          </div>

          <div class="hero-actions">
            <a href="/agent-academy/index.html" class="action-btn" id="academyHomeBtn">Back to Academy</a>
            <button type="button" class="action-btn" id="logoutBtn">Log out</button>
          </div>
        </div>

        <aside class="panel meta-panel">
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label" id="metaWelcomeLabel">Welcome</span>
              <div class="meta-value" id="metaWelcomeValue">—</div>
            </div>

            <div class="meta-item">
              <span class="meta-label" id="metaEmailLabel">Email</span>
              <div class="meta-value" id="metaEmailValue">—</div>
            </div>

            <div class="meta-item">
              <span class="meta-label" id="metaPlanLabel">Plan</span>
              <div class="meta-value" id="metaPlanValue">Free</div>
            </div>
          </div>
        </aside>
      </section>

      <h2 class="section-title" id="nextStepsTitle">Your next steps</h2>
      <p class="lead-text" id="dashboardLead">Loading dashboard...</p>

      <section class="cards-grid">
        <article class="panel tool-card">
          <div class="tool-badge" id="mockBadge"></div>
          <h3 id="mockTitle">Mock Exam</h3>
          <p id="mockText">Timed premium exam simulator with regulation-weighted selection, review flags and exam-style structure.</p>
          <a href="/agent-academy/upgrade.html" class="card-btn" id="mockBtn">See plans</a>
        </article>

        <article class="panel tool-card">
          <div class="tool-badge" id="quizBadge"></div>
          <h3 id="quizTitle">Topic Quiz</h3>
          <p id="quizText">Premium topic-based revision across FIFA regulations and key exam themes.</p>
          <a href="/agent-academy/upgrade.html" class="card-btn" id="quizBtn">See plans</a>
        </article>

        <article class="panel tool-card">
          <div class="tool-badge" id="playbookBadge"></div>
          <h3 id="playbookTitle">Playbook</h3>
          <p id="playbookText">Read the online playbook with references, source links and structured learning support.</p>
          <a href="/agent-academy/playbook.html" class="card-btn" id="playbookBtn">Open playbook</a>
        </article>

        <article class="panel tool-card">
          <div class="tool-badge" id="upgradeBadge"></div>
          <h3 id="upgradeTitle">Upgrade Access</h3>
          <p id="upgradeText">Unlock the full Agent Academy with Starter, Professional or Premium Intensive.</p>
          <a href="/agent-academy/upgrade.html" class="card-btn" id="upgradeBtn">See plans</a>
        </article>
      </section>

      <div class="footer" id="footerText">Agent Academy by GlobalMGM</div>
    </div>
  </div>

  <script src="/agent-academy/js/supabase-client.js"></script>
  <script src="/agent-academy/js/auth.js"></script>
  <script src="/agent-academy/js/guard.js"></script>
  <script src="/agent-academy/js/dashboard.js"></script>
</body>
</html>
