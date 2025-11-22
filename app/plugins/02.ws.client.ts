import type { WebSocketData } from "~~/shared/types";

export default defineNuxtPlugin((nuxtApp) => {
  const { user } = useUserSession();

  const data = ref<WebSocketData>();

  const socket = computed(() => {
    return useWebSocket<WebSocketData>(`/ws?userId=${user.value?.id}`, {
      immediate: false,
      onMessage(_, event) {
        if (nuxtApp.$config.public.nodeEnv === "development") {
          console.log("[ws] message received: " + event);
        }

        data.value = JSON.parse(event.data);
      },
    });
  });

  watch(user, () => socket.value.open(), {
    deep: true,
    immediate: true,
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
