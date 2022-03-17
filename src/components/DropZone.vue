<template>
<!---
 This is just an alert - so we can open the drop window
 <drop-zone @activateDrop="activateDrop" description="OK, I've got it - let go of the mousebutton..">
     some component or v-card come in here....
 </drop-zone>
-->
<div>
  <v-card
    title="drop zone"
    :class="computedDropZone"
    @dragover.prevent="dragTrue"
    @dragenter.prevent="dragTrue"
    @dragleave.prevent="dragFalse"
  >
  <template v-if="dragging==true"> {{ description }} </template>
    <slot />

  </v-card>

</div>
</template>

<script>
export default {
  name: 'DropZone',
  components:{},
  props: ['description'],
  data() {
    return {
      e: {},
      dragging:false,
  }},
  computed:{
    computedDropZone() {
      if (this.dragging) return "drop-zone"
      return ""
    }
  },
  methods:{
    dragTrue() {
        console.log('we detected a drag event')
        setTimeout(() => {if (this.dragging == false) {this.$emit('activateDrop');this.dragging = true}}, 500)

    },
    dragFalse() {
      if (this.dragging == true )
         setTimeout(() => {if (this.dragging == true) this.dragging = false}, 1500)
    },
  }
}
</script>
<style scoped>
.drop-zone {
    background-color: orange;
    color: #777;
    /*
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.2px;
    transition: background-color .2s linear;
    height: 10px;
    padding: 40px; */
}

.xxxwatermark {
/* Text color */
    color: rgba(0, 0, 0, 0.2);
    /* Text styles */
    font-size: 3rem;
    font-weight: bold;
    text-transform: uppercase;
    /* Rotate the text */
      transform: rotate(-45deg);
    /* Disable the selection */
    user-select: none;
}

</style>