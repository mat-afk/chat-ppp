import { useGuest } from "~/composables/useGuest";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { loggedIn, user } = useUserSession();

  if (loggedIn.value || (user.value && user.value.type === "PERFORMER")) return;

  useGuest().sessionize();
});
