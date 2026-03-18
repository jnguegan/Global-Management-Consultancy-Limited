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

// Map your current DB plan → platform plan
function mapPlan(plan) {
  if (!plan) return "free";

  // current mapping
  if (plan === "90_day") return "professional";

  return plan;
}

// Check access
window.hasAccess = function (userPlan, requiredLevel) {
  return PLAN_LEVELS[userPlan] >= PLAN_LEVELS[requiredLevel];
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
      return;
    }

    // Expiry check
    if (new Date(data.access_end) < new Date()) {
      window.userPlan = "free";
      return;
    }

    window.userPlan = mapPlan(data.plan);

  } catch (err) {
    console.error("Access load error:", err);
    window.userPlan = "free";
  }
};
