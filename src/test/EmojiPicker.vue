<template>
  <div class="emoji-picker" v-if="show && emojisO.length">
    <v-card height="300px" v-if="show">
      <v-card-title class="blue white--text">
        <span class="headline">Emoji Picker</span>
      </v-card-title>
      <v-card-text>
        <div class="emoji-content">
          <emoji v-for="e in emojisO" v-bind:key="e.key" :emoji="e" @click="onEmojiClick" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import Emoji from '@/test/Emoji.vue'

  export default {
    name:'EmojiPicker',
    components: { Emoji },
    props: {
      show: {default: false}
    },
    data: () => ({
        emojisO: []
    }),
    mounted() {
      console.log(this.$options.name,'mount',this.emojisO.length)
    },
    created () {
       fetch('emoji.json')
       .then(response => {
            if (response.ok && (response.status >= 200 && response.status <= 299)) {
              return response.json();
            } else {
              throw Error(response.statusText)
            }
        })
        .then(responseAsJson => {
            console.log('fetch is loading')
            this.emojisO = responseAsJson.peoples.people
        })
    },
    methods: {
      onEmojiClick (emoji) {
        this.$emit('click', emoji)
      },
      closePicker () {
        this.$emit('close')
      }
    },
  }
</script>

<style>
  .emoji-picker{
    background: white;
    position: absolute;
    bottom: 5rem;
    top: 51px;
    left: 5px;
    width: 200px;
    user-select: none;
    z-index: 11;
  }
  .emoji-picker .emoji-header{
    display: flex;
    padding: 5px;
    box-shadow: 0px 5px 9px 0px rgba(0,0,0,0.15);
  }

  .emoji-picker .emoji-header .emoji-close{
    margin-left: auto;
  }
  .emoji-picker .emoji-content{
    margin-top: 10px;
    overflow-y: auto;
    height: 200px;
  }
  .emoji-picker span{
    cursor: pointer;
    font-size: 25px;
  }
</style>