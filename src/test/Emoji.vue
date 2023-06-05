<template>
  <span class="mt-1" @click="onEmojiClick">{{emoji.value}} </span>
</template>

<script>
  export default {
    name: "Emoji",
    props: { emoji: ''},
    mounted() {
      console.log(this.$options.name,'mount')
    },
    methods: {
      onEmojiClick () {
        this.$emit('click', this.emoji)
      }
    }
  }
</script>