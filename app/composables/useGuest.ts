export const useGuest = () => {
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
    sessionize,
  };
};
