<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();

const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :ui="{
      footer: 'flex-row-reverse justify-start',
    }"
    :close="false"
    :dismissible="false"
  >
    <template #footer>
      <UButton label="Deletar" @click="emit('close', true)" />
      <UButton color="neutral" label="Cancelar" @click="emit('close', false)" />
    </template>
  </UModal>
</template>
