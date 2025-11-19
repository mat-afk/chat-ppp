<script lang="ts" setup>
const { send, data } = useWebSocket("ws://localhost:3000/_ws");

const history = ref<string[]>([]);

function onSubmit() {
  send(input.value);
  history.value.push("client: " + input.value);
}

const input = ref("");

watch(data, () => history.value.push("server: " + data.value));
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="input" />
      <button type="submit">Enviar</button>
    </form>
    <pre>
      <p v-for="entry in history">{{ entry }}</p>
    </pre>
  </div>
</template>
