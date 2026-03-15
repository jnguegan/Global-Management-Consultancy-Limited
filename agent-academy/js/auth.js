(function () {
  const sb =
    window.supabaseClient ||
    window.sb ||
    null;

  function getClient() {
    return sb;
  }

  async function getSession() {
    if (!sb || !sb.auth) {
      return { session: null, user: null, error: new Error("Supabase client not found") };
    }

    try {
      const { data, error } = await sb.auth.getSession();

      if (error) {
        return { session: null, user: null, error };
      }

      const session = data?.session || null;
      const user = session?.user || null;

      return { session, user, error: null };
    } catch (error) {
      return { session: null, user: null, error };
    }
  }

  async function getUser() {
    if (!sb || !sb.auth) {
      return { user: null, error: new Error("Supabase client not found") };
    }

    try {
      const { data, error } = await sb.auth.getUser();

      if (error) {
        return { user: null, error };
      }

      return { user: data?.user || null, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  async function signOut() {
    if (!sb || !sb.auth) {
      return { error: new Error("Supabase client not found") };
    }

    try {
      const { error } = await sb.auth.signOut();
      return { error: error || null };
    } catch (error) {
      return { error };
    }
  }

  window.AgentAcademyAuth = {
    getClient,
    getSession,
    getUser,
    signOut
  };
})();

