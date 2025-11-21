<script setup lang="ts">
const input = ref("");
const loading = ref(false);

async function onSubmit() {
  loading.value = true;

  const chat = await $fetch("/api/chats", {
    method: "POST",
    body: { input: input.value },
  });

  await refreshNuxtData("chats");
  await navigateTo(`/chats/${chat?.id}`);
}

const quickChats = [
  {
    label: "Por que '42' é a resposta do universo?",
    icon: "i-lucide-orbit",
  },
];

const { isGuest } = useGuest();
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer
        v-if="!isGuest"
        class="flex-1 flex flex-col justify-center text-center gap-4 sm:gap-6 py-8"
      >
        <h1 class="text-3xl sm:text-4xl text-highlighted text-center font-bold">
          Responda a um chat para começar
        </h1>
      </UContainer>

      <UContainer
        v-else
        class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8"
      >
        <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
          Como posso ajudar?
        </h1>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          placeholder="Escreva sua mensagem aqui..."
          @submit="onSubmit"
        >
          <UChatPromptSubmit color="neutral" />
        </UChatPrompt>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full"
            @click="input = quickChat.label"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
