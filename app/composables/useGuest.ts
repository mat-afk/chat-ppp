export const useGuest = () => {
  const { user } = useUserSession();
  const isGuest = computed(() => user.value?.type === "GUEST");

  async function sessionize() {
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
  }

  return {
    isGuest,
    sessionize,
  };
};
