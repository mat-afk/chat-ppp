<script setup lang="ts">
const open = ref(false);

const items = computed(() => []);
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
            >Chat</span
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
            v-bind="
              collapsed ? { icon: 'i-lucide-plus' } : { label: 'New chat' }
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
          <template #item-trailing="{ item }">
            <div
              class="flex -mr-1.25 translate-x-full group-hover:translate-x-0 transition-transform"
            >
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="xs"
                class="text-muted hover:text-primary hover:bg-accented/50 focus-visible:bg-accented/50 p-0.5"
                tabindex="-1"
              />
            </div>
          </template>
        </UNavigationMenu>
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :label="collapsed ? '' : 'Sign in with Google'"
          icon="i-simple-icons-google"
          color="neutral"
          variant="ghost"
          class="w-full"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch
      placeholder="Search chats..."
      :groups="[
        {
          id: 'links',
          items: [
            {
              label: 'New chat',
              to: '/',
              icon: 'i-lucide-square-pen',
            },
          ],
        },
      ]"
    />

    <slot />
  </UDashboardGroup>
</template>
