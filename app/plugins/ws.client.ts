import type { WebSocketData } from "~~/shared/types";

export default defineNuxtPlugin((_) => {
  const { user } = useUserSession();

  const data = ref<WebSocketData>();

  const socket = useWebSocket<WebSocketData>(`/ws?userId=${user.value?.id}`, {
    onMessage(_, event) {
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
