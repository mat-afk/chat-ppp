<script setup lang="ts">
import ModalConfirm from "~/components/ModalConfirm.vue";
import ModalLogin from "~/components/ModalLogin.vue";
import { useChats } from "~/composables/useChats";

const { user } = useUserSession();
const open = ref(false);

const overlay = useOverlay();

const deleteModal = overlay.create(ModalConfirm, {
  props: {
    title: "Deletar chat",
    description:
      "Você tem certeza de que quer deletar esse chat? Essa ação não pode ser desfeita.",
  },
});

const loginModal = overlay.create(ModalLogin);

const { data: chats, refresh: refreshChats } = await useFetch("/api/chats", {
  key: "chats",
  transform: (data) =>
    data.map((chat) => ({
      ...chat,
      id: chat.id,
      label: chat.title || "Sem título",
      to: `/chats/${chat.id}`,
      icon: "i-lucide-message-circle",
    })),
});

const { groups } = useChats(chats);

const items = computed(() =>
  groups.value?.flatMap((group) => {
    return [
      {
        label: group.label,
        type: "label" as const,
      },
      ...group.items.map((item) => ({
        ...item,
        slot: "chat" as const,
        icon: undefined,
        class: item.label === "Sem título" ? "text-muted" : "",
      })),
    ];
  })
);

const toast = useToast();
const route = useRoute();

async function deleteChat(id: string) {
  const instance = deleteModal.open();
  const result = await instance.result;
  if (!result) return;

  await $fetch(`/api/chats/${id}`, { method: "DELETE" });

  toast.add({
    title: "Chat deletado",
    description: "Seu chat foi deletado.",
    icon: "i-lucide-trash",
  });

  refreshChats();

  if (route.params.id !== id) return;

  navigateTo("/");
}
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      :min-size="12"
      collapsible
      resizable
      class="bg-elevated/50"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/" class="flex items-center gap-1.5">
          <Logo class="h-8 w-auto shrink-0" />
          <span v-if="!collapsed" class="text-xl font-bold text-highlighted"
            >ChatPPP</span
          >
        </NuxtLink>

        <div v-if="!collapsed" class="flex items-center gap-1.5 ms-auto">
          <UDashboardSearchButton collapsed />
          <UDashboardSidebarCollapse />
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="flex flex-col gap-1.5">
          <UButton
            v-if="user && user.type === 'GUEST'"
            v-bind="
              collapsed ? { icon: 'i-lucide-plus' } : { label: 'Nova conversa' }
            "
            variant="soft"
            block
            to="/"
            @click="open = false"
          />

          <template v-if="collapsed">
            <UDashboardSearchButton collapsed />
            <UDashboardSidebarCollapse />
          </template>
        </div>

        <UNavigationMenu
          v-if="!collapsed"
          :items="items"
          :collapsed="collapsed"
          orientation="vertical"
          :ui="{ link: 'overflow-hidden' }"
        >
          <template #chat-trailing="{ item }">
            <div
              class="flex -mr-1.25 translate-x-full group-hover:translate-x-0 transition-transform"
            >
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="md"
                class="text-muted hover:text-primary hover:bg-accented/50 focus-visible:bg-accented/50 p-0.5"
                tabindex="-1"
                @click="deleteChat(item.id)"
              />
            </div>
          </template>
        </UNavigationMenu>
      </template>

      <template #footer="{ collapsed }">
        <UButton v-if="user?.type === 'PERFORMER'" />
        <UUser
          v-else
          :name="collapsed ? '' : 'Anônimo'"
          :description="collapsed ? '' : 'Quer se juntar a nós?'"
          :avatar="{
            icon: 'i-lucide-user',
          }"
          class="w-full cursor-pointer"
          @click="loginModal.open()"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch
      placeholder="Procure conversas..."
      :groups="[
        {
          id: 'links',
          items: [
            {
              label: 'Nova conversa',
              to: '/',
              icon: 'i-lucide-square-pen',
            },
          ],
        },
        ...groups,
      ]"
    />

    <main class="size-full flex flex-col items-center justify-center">
      <DashboardNavbar class="w-full" />
      <div class="flex-1 w-[90%] sm:w-[80%] lg:w-[70%]">
        <slot />
      </div>
    </main>
  </UDashboardGroup>
</template>
