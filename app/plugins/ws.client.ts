import type { WebSocketData } from "~~/shared/types";

export default defineNuxtPlugin((nuxtApp) => {
  const { user } = useUserSession();

  const data = ref<WebSocketData>();

  const socket = useWebSocket<WebSocketData>(`/ws?userId=${user.value?.id}`, {
    onMessage(_, event) {
      if (nuxtApp.$config.public.nodeEnv === "dev") {
        console.log(event);
      }

      data.value = JSON.parse(event.data);
    },
  });

  return {
    provide: {
      socket: {
        ...socket,
        data,
      },
    },
  };
});
