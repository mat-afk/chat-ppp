<script setup lang="ts">
import type { Message, MessageSender } from "~~/server/lib/prisma";

const route = useRoute();
const { isGuest } = useGuest();
const { user } = useUserSession();

const { data: chat, refresh: refreshChat } = await useFetch(
  `/api/chats/${route.params.id}`
);

const { data: newMessage } = useEventSource(
  `http://localhost:3000/sse?userId=${user.value?.id}&chatId=${route.params.id}`,
  [],
  {
    serializer: {
      read: (raw?: string) => {
        const object = JSON.parse(raw || "");

        return { ...object, sentAt: object.sentAt } as Message;
      },
    },
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

const messages = ref<UIMessage[]>([]);
const lastSender = ref<MessageSender>("GUEST");

const submitted = computed(() => lastSender.value === user.value?.type);

watchEffect(() => {
  if (!chat.value) return;

  messages.value = chat.value.messages.map<UIMessage>((message) => {
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

  lastSender.value = chat.value.lastMessageSender;
});

watch(newMessage, (message) => {
  if (!message) return;
  if (!user.value) return;

  const role = message.sender === user.value.type ? "user" : "assistant";

  messages.value.push({
    id: message.id.toString(),
    role,
    parts: [
      {
        type: "text",
        text: message.content,
      },
    ],
  });

  lastSender.value = message.sender;
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
        <ClientOnly>
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
        </ClientOnly>

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
