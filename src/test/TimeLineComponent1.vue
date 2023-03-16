<template>
  <article>
    <h1>{{ contact.name }}</h1>
    <ul>
      <li>Phone: {{ contact.phone }}</li>
    </ul>
    <v-text-field width="200px" outlined v-model="contact.name" />
  </article>
</template>

<script>
export default {
    name:"cc",
    props:["contact"]
}
</script>