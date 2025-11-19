<script setup lang="ts">
const route = useRoute();

const { data: chat, refresh: refreshChat } = await useFetch(
  `/api/chats/${route.params.id}`,
  {
    cache: "force-cache",
  }
);

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

const submitted = ref(false);

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

  if (chat.value.lastMessageSender === "GUEST" && isGuest.value) {
    submitted.value = true;
  }

  return messages;
});

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

const { isGuest } = useGuest();
const { user } = useUserSession();
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
              label="Raciocinando..."
            />
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          variant="subtle"
          placeholder="Escreva sua mensagem aqui..."
          :disabled="chat?.lastMessageSender === user?.type"
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
