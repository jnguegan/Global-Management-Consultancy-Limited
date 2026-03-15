(function () {
  function normalizePlan(value) {
    if (!value) return "free";

    const v = String(value).trim().toLowerCase();

    if (v === "starter") return "starter";
    if (v === "professional") return "professional";
    if (v === "premium") return "premium";
    if (v === "premium intensive") return "premium_intensive";
    if (v === "premium_intensive") return "premium_intensive";

    return "free";
  }

  function isPaidPlan(plan) {
    return ["starter", "professional", "premium", "premium_intensive"].includes(
      String(plan || "").trim().toLowerCase()
    );
  }

  async function getProfileAccess(userId) {
    const auth = window.AgentAcademyAuth;
    const sb = auth?.getClient ? auth.getClient() : null;

    if (!sb || !userId) {
      return {
        plan: "free",
        subscriptionStatus: "inactive",
        source: "fallback"
      };
    }

    try {
      const { data, error } = await sb
        .from("profiles")
        .select("plan_tier, access_level, subscription_status")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) {
        return {
          plan: "free",
          subscriptionStatus: "inactive",
          source: "fallback"
        };
      }

      const planTier = normalizePlan(data.plan_tier);
      const accessLevel = normalizePlan(data.access_level);
      const subscriptionStatus = String(data.subscription_status || "inactive").trim().toLowerCase();

      const resolvedPlan = planTier !== "free" ? planTier : accessLevel;

      return {
        plan: resolvedPlan,
        subscriptionStatus,
        source: "profiles"
      };
    } catch (error) {
      return {
        plan: "free",
        subscriptionStatus: "inactive",
        source: "fallback"
      };
    }
  }

  async function getAccessState() {
    const auth = window.AgentAcademyAuth;

    if (!auth || !auth.getSession) {
      return {
        isLoggedIn: false,
        isPaid: false,
        plan: "free",
        subscriptionStatus: "inactive",
        user: null
      };
    }

    const { user } = await auth.getSession();

    if (!user) {
      return {
        isLoggedIn: false,
        isPaid: false,
        plan: "free",
        subscriptionStatus: "inactive",
        user: null
      };
    }

    const metaPlan =
      normalizePlan(user.user_metadata?.plan) !== "free"
        ? normalizePlan(user.user_metadata?.plan)
        : normalizePlan(user.app_metadata?.plan);

    if (metaPlan !== "free") {
      return {
        isLoggedIn: true,
        isPaid: true,
        plan: metaPlan,
        subscriptionStatus: "active",
        user
      };
    }

    const profileAccess = await getProfileAccess(user.id);

    const paidByProfile =
      isPaidPlan(profileAccess.plan) &&
      (profileAccess.subscriptionStatus === "active" || profileAccess.subscriptionStatus === "trialing" || profileAccess.subscriptionStatus === "");

    return {
      isLoggedIn: true,
      isPaid: paidByProfile,
      plan: profileAccess.plan || "free",
      subscriptionStatus: profileAccess.subscriptionStatus || "inactive",
      user
    };
  }

  async function requireLogin(options = {}) {
    const loginUrl = options.loginUrl || "/agent-academy/login.html";

    const access = await getAccessState();

    if (!access.isLoggedIn) {
      window.location.href = loginUrl;
      return null;
    }

    return access;
  }

  async function requirePaidAccess(options = {}) {
    const loginUrl = options.loginUrl || "/agent-academy/login.html";
    const upgradeUrl = options.upgradeUrl || "/agent-academy/upgrade.html";

    const access = await getAccessState();

    if (!access.isLoggedIn) {
      window.location.href = loginUrl;
      return null;
    }

    if (!access.isPaid) {
      window.location.href = upgradeUrl;
      return null;
    }

    return access;
  }

  window.AgentAcademyGuard = {
    normalizePlan,
    isPaidPlan,
    getProfileAccess,
    getAccessState,
    requireLogin,
    requirePaidAccess
  };
})();

