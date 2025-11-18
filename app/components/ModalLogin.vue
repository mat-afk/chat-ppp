<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const emit = defineEmits<{ close: [boolean] }>();

const loginSchema = z.object({
  key: z.string().regex(/^[a-z0-9]+$/),
});

type LoginSchema = z.infer<typeof loginSchema>;

const state = reactive<LoginSchema>({
  key: "",
});

async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  console.log("a");
}

const fields = ref<AuthFormField[]>([
  {
    name: "magic-key",
    type: "text",
    label: "Chave mágica",
    placeholder: "Enter your email",
    required: true,
  },
]);
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
      <UAuthForm :fields="fields" :submit="{ label: 'Entrar' }" />
    </template>
  </UModal>
</template>
