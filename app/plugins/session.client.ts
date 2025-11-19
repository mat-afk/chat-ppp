export default defineNuxtPlugin(async (nuxtApp) => {
  const { loggedIn, user } = useUserSession();

  console.log(loggedIn.value);

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
});
