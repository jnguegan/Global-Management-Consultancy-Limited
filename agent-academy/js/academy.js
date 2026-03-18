// ===============================
// ACCESS CONTROL CORE
// ===============================

const PLAN_LEVELS = {
  free: 1,
  starter: 2,
  professional: 3,
  premium: 4
};

function mapPlan(plan) {
  if (!plan) return "free";

  const normalized = String(plan).toLowerCase();
  return PLAN_LEVELS[normalized] ? normalized : "free";
}

window.hasAccess = function (userPlan, requiredLevel) {
  if (window.userRole === "admin") return true;

  const plan = mapPlan(userPlan);
  const required = String(requiredLevel || "professional").toLowerCase();

  return (PLAN_LEVELS[plan] || 0) >= (PLAN_LEVELS[required] || 999);
};

window.userPlan = "free";
window.userRole = "user";

// ===============================
// FETCH USER PLAN FROM SUPABASE
// ===============================
window.loadUserAccess = async function (userId) {
  try {
    const client =
      window.supabaseClient ||
      window.sb ||
      window.supabaseInstance ||
      null;

    if (!client) {
      console.error("No Supabase client available for loadUserAccess");
      window.userPlan = "free";
      window.userRole = "user";
      return "free";
    }

    const { data, error } = await client
      .from("user_access")
      .select("plan, role, is_active, access_end")
      .eq("user_id", userId)
      .eq("is_active", true)
     .maybeSingle();

    if (error || !data) {
      console.error("loadUserAccess error:", error);
      window.userPlan = "free";
      window.userRole = "user";
      return "free";
    }

    if (data.access_end && new Date(data.access_end) < new Date()) {
      window.userPlan = "free";
      window.userRole = "user";
      return "free";
    }

    window.userPlan = mapPlan(data.plan);
    window.userRole = data.role || "user";

    return window.userPlan;

  } catch (err) {
    console.error("Access load error:", err);
    window.userPlan = "free";
    window.userRole = "user";
    return "free";
  }
};
