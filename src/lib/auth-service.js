import { supabase } from "./supabase";

/**
 * Handles user sign-in and logs the activity to the database.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data: any, error: any}>}
 */
export const signInWithAudit = async (email, password) => {
  // 1. Attempt the sign-in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 2. Prepare the log entry
  const logEntry = {
    email,
    event_type: error ? "LOGIN_FAILURE" : "LOGIN_SUCCESS",
    metadata: error
      ? { error: error.message }
      : {
          user_agent:
            typeof window !== "undefined" ? navigator.userAgent : "server",
        },
  };

  if (!error && data?.user) {
    logEntry.user_id = data.user.id;
  }

  // 3. Fire-and-forget the log (don't block the UI for logging)
  // But wait, in a CRM context, we might want to ensure it's logged.
  // We'll use a standard insert.
  try {
    const { error: logError } = await supabase
      .from("audit_logs")
      .insert(logEntry);

    if (logError) {
      console.error("Audit Log failed:", logError);
    }
  } catch (err) {
    console.error("Audit Log exception:", err);
  }

  return { data, error };
};

/**
 * Handles user sign-out and logs the activity.
 */
export const signOutWithAudit = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      email: user.email,
      event_type: "LOGOUT",
    });
  }

  return await supabase.auth.signOut();
};
