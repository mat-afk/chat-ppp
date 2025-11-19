<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type z from "zod";
import { keySchema } from "~~/shared/lib/zod";

const emit = defineEmits<{ close: [] }>();

type KeySchema = z.infer<typeof keySchema>;

const state = reactive<KeySchema>({
  key: "",
});

const toast = useToast();
const { fetch: fetchSession } = useUserSession();

async function onSubmit(event: FormSubmitEvent<KeySchema>) {
  try {
    await $fetch("/api/auth/login", {
      body: {
        key: event.data.key,
      },
      method: "POST",
    });
  } catch (e) {
    toast.add({
      title: "Erro",
      description: "Você não foi identificado no sistema.",
      color: "error",
    });
    return;
  }

  toast.add({
    title: "Entrada como performer confirmada",
    description: "Você entrou como performer no sistema.",
    icon: "i-lucide-key-square",
  });

  await fetchSession();

  emit("close");
  navigateTo("/");
}
</script>

<template>
  <UModal
    title="Junte-se a nós"
    description="Entre usando a sua chave mágica."
    :ui="{
      footer: 'flex-row-reverse justify-start',
    }"
  >
    <template #body>
      <UForm
        :schema="keySchema"
        :state="state"
        class="flex flex-col gap-5"
        @submit="onSubmit"
      >
        <UFormField label="Chave mágica" name="key" required>
          <UInput
            placeholder="Digite sua chave mágica"
            v-model="state.key"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" class="flex justify-center items-center"
          >Entrar</UButton
        >
      </UForm>
    </template>
  </UModal>
</template>
