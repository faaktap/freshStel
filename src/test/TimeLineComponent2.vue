<template>
  <article>
    <h1>{{ event.name }}</h1>
    <ul>
      <li>event: {{ event }}</li>
    </ul>
    <v-textarea v-model="event.name" outlined class="ma-2" label="replace the data for event" />
  </article>
</template>

<script>
export default {
    name:"ee",
    props:["event"]
}
</script>