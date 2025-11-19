<script setup lang="ts">
const route = useRoute();

const { data: chat } = await useFetch(`/api/chats/${route.params.id}`, {
  cache: "force-cache",
});

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
}

const messages = computed<UIMessage[]>(() => {
  if (!chat.value) return [];

  const messages = chat.value.messages.map<UIMessage>((message) => {
    return {
      id: message.id.toString(),
      role: message.sender === "GUEST" ? "user" : "assistant",
      parts: [
        {
          type: "text",
          text: message.content,
        },
      ],
    };
  });

  if (chat.value.status === "WAITING") {
    messages.push({
      id: "1",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Raciocinando...",
        },
      ],
    });
  }

  return messages;
});

const toast = useToast();

function onSubmit(e: Event) {
  e.preventDefault();
}

const { isGuest } = useGuest();
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
          :spacing-offset="160"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
        ></UChatMessages>

        <UChatPrompt
          v-model="input"
          variant="subtle"
          placeholder="Escreva sua mensagem aqui..."
          :disabled="chat?.lastMessageSender === 'GUEST' && isGuest"
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
