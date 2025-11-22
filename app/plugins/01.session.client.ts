import { useGuest } from "~/composables/useGuest";

export default defineNuxtPlugin(async (_) => {
  const { loggedIn, user } = useUserSession();

  if (loggedIn.value || (user.value && user.value.type === "PERFORMER")) return;

  await useGuest().sessionize();
});
