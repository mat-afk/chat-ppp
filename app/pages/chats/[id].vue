<script setup lang="ts">
const route = useRoute();
const toast = useToast();

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

function onSubmit(e: Event) {
  e.preventDefault();
}
</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
        <UChatMessages
          should-auto-scroll
          :messages="messages"
          :spacing-offset="160"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
        ></UChatMessages>

        <UChatPrompt
          v-model="input"
          variant="subtle"
          class="sticky bottom-0 [view-transition-name:chat-prompt] rounded-b-none z-10"
          placeholder="Escreva sua mensagem aqui..."
          @submit="onSubmit"
        >
          <template #footer>
            <UChatPromptSubmit color="neutral" />
          </template>
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
