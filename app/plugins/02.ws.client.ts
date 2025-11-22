import type { WebSocketData } from "~~/shared/types";

export default defineNuxtPlugin((nuxtApp) => {
  const { user, fetch } = useUserSession();

  const data = ref<WebSocketData>();

  const socket = ref<ReturnType<typeof useWebSocket<WebSocketData>>>();

  function connect(userId?: string) {
    if (socket.value) {
      socket.value.close();
    }

    socket.value = useWebSocket<WebSocketData>(`/ws?userId=${userId}`, {
      onMessage(_, event) {
        if (nuxtApp.$config.public.nodeEnv === "development") {
          console.log("[ws] message received: " + event.data);
        }

        data.value = JSON.parse(event.data);
      },
    });
  }

  watch(
    () => user.value?.id,
    async (id) => {
      if (!id) {
        await fetch();
        return;
      }

      console.log("[ws] reconnecting due to user change...");
      connect(id);
    },
    {
      immediate: true,
    }
  );

  return {
    provide: {
      socket: {
        socket,
        data,
        connect,
      },
    },
  };
});
