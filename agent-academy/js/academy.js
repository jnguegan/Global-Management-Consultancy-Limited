// ===============================
// ACCESS CONTROL CORE
// ===============================

// Plan hierarchy
const PLAN_LEVELS = {
  free: 1,
  starter: 2,
  professional: 3,
  premium: 4
};

// Normalize DB/user plan → platform plan
function mapPlan(plan) {
  if (!plan) return "free";

  const normalized = String(plan).toLowerCase();

  if (normalized === "90_day") return "professional";

  return PLAN_LEVELS[normalized] ? normalized : "free";
}

// Check access
window.hasAccess = function (userPlan, requiredLevel) {
  const plan = mapPlan(userPlan);
  const required = String(requiredLevel || "professional").toLowerCase();

  return (PLAN_LEVELS[plan] || 0) >= (PLAN_LEVELS[required] || 999);
};

// Global user plan (default = free)
window.userPlan = "free";

// ===============================
// FETCH USER PLAN FROM SUPABASE
// ===============================
window.loadUserAccess = async function (userId) {
  try {
    const { data, error } = await supabase
      .from("user_access")
      .select("plan, is_active, access_end")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      window.userPlan = "free";
      return "free";
    }

    // Expiry check
    if (data.access_end && new Date(data.access_end) < new Date()) {
      window.userPlan = "free";
      return "free";
    }

    window.userPlan = mapPlan(data.plan);
    return window.userPlan;

  } catch (err) {
    console.error("Access load error:", err);
    window.userPlan = "free";
    return "free";
  }
};
