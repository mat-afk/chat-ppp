<script setup lang="ts">
import type { MessageSender } from "~~/server/lib/prisma";

const route = useRoute();
const { isGuest } = useGuest();
const { user } = useUserSession();

const { data: chat, refresh: refreshChat } = await useFetch(
  `/api/chats/${route.params.id}`
);

const { $socket } = useNuxtApp();

if (!chat.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Chat não encontrado",
    fatal: true,
  });
}

const input = ref("");

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  parts: {
    type: any;
    text: string;
  }[];
  class?: string;
}

const messages = computed<UIMessage[]>(() => {
  if (!chat.value) return [];

  lastSender.value = chat.value.lastMessageSender;

  return chat.value.messages.map<UIMessage>((message) => {
    const role = message.sender === user.value?.type ? "user" : "assistant";

    return {
      id: message.id.toString(),
      role,
      parts: [
        {
          type: "text",
          text: message.content,
        },
      ],
    };
  });
});
const lastSender = ref<MessageSender>("GUEST");

const submitted = computed(() => lastSender.value === user.value?.type);

const toast = useToast();

async function onSubmit(e: Event) {
  e.preventDefault();

  try {
    await $fetch(`/api/chats/${route.params.id}`, {
      method: "POST",
      body: {
        input: input.value,
      },
    });
  } catch (e) {
    toast.add({
      title: "Chat não encontrado",
      description: "O chat com o id dado não foi encontrado.",
      color: "error",
    });
    return;
  }

  input.value = "";

  await refreshChat();
  await refreshNuxtData("chats");
}

watch($socket.data, async (data) => {
  if (!data) return;
  if (!user.value) return;

  const { event, payload } = data;

  if (event !== "new-message" && event !== "chat-deleted") return;

  if (event === "new-message") {
    if (payload.chatId !== route.params.id) return;

    await refreshChat();
    return;
  }

  if (payload.id !== route.params.id) return;

  await navigateTo("/");
});
</script>

<template>
  <UDashboardPanel id="chat" class="relative">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer
        class="h-full flex-1 overflow-auto flex flex-col gap-4 sm:gap-6"
      >
        <UChatMessages
          should-auto-scroll
          :messages="messages"
          :status="submitted ? 'submitted' : 'ready'"
          :spacing-offset="160"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
        >
          <template #indicator>
            <UButton
              class="px-0"
              color="neutral"
              variant="link"
              loading
              loading-icon="i-lucide-loader"
              :label="isGuest ? 'Raciocinando...' : 'Aguardando usuário...'"
            />
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          variant="subtle"
          placeholder="Escreva sua mensagem aqui..."
          :disabled="submitted"
          autofocus
          @submit="onSubmit"
          class="sticky bottom-0 [view-transition-name:chat-prompt] rounded-b-none z-10"
        >
          <template #footer>
            <UChatPromptSubmit color="neutral" />
          </template>
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
