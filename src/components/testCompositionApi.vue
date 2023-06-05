<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
// eslint-disable-next-line
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
<div>
  <v-btn class="ma-2 pa-2" @click="increment" outlined>Count is: {{ count }}</v-btn>
  <v-btn class="ma-2 pa-2" @click="increment" rounded>Count is: {{ count }}</v-btn>
  <v-btn class="ma-2 pa-2" @click="increment" fab> {{ count }} </v-btn>
  <hr>
  <button class="ma-2 pa-2 button" type="button" @click="increment">Count is: {{ count }}</button>
</div>
</template>

<style scoped>
.button {
    padding: 7px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #3498db;
}
</style>