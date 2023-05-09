<template>
  <div>
    <div v-for="(message,index) in messages" v-bind:key="index">
      <div v-if="index>0 && messages[index-1].user != message.user">{{message.user}}</div>
      <div v-if="index == 0">{{message.user}}</div>
      <div style="margin-top: 5px"></div>
      <div>
        <div v-html="message.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getters } from "@/api/store";
export default {
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
    }),
    props: ['messages'],
    components: {},
    computed: {},
    methods: {

    }
}
</script>

<style>
  span.emoji {
    font-size: 20px;
    vertical-align: middle;
    line-height: 2;
  }
</style>
