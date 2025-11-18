export default defineNuxtPlugin(async (nuxtApp) => {
  const { loggedIn, user } = useUserSession();

  if (loggedIn.value || (user.value && user.value.type === "PERFORMER")) return;

  const existingSessionToken = localStorage.getItem("session-token");

  const { sessionToken } = await $fetch<{ sessionToken: string }>(
    "/api/auth/sessions",
    {
      method: "PUT",
      body: {
        sessionToken: existingSessionToken ?? undefined,
      },
    }
  );

  localStorage.setItem("session-token", sessionToken);
  console.log(sessionToken);
});
