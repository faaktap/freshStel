<template>
<!---
 Write a way that handle any incoming drop items, and put them is a data struct, and pass it
 back to our caller.
 We handle text, html, url and files at the moment, and will display and alert if there is something else
-->
<div>
  <v-card elevation="0"
    style="background-color: transparent;"
    title="drop zone"
    :class="computedDropZone"
    @drop.prevent="xonDrop"
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
  name: 'Drop',
  components:{},
  props: ['description'],
  data() {
    return {
      e: {},
      showFiles:false,
      dragging:false,
      type:null,
      data1:[],
      fullResult:[]
  }},
  computed:{
    computedDropZone() {
      if (this.dragging) return "drop-zone"
      return ""
    }
  },
  methods:{
    dragTrue() {
        setTimeout(() => {if (this.dragging == false) this.dragging = true}, 500)
    },
    dragFalse() {
      if (this.dragging == true )
         setTimeout(() => {if (this.dragging == true) this.dragging = false}, 1500)
    },
    saveFullResult(tp,e) {
       switch (tp){
         case "text/uri-list":
           if (e.dataTransfer.getData(tp).indexOf('about:blank#blocked') != -1) {
             //Ignore a blank one
           } else {
             this.fullResult.push({type:'url',data: e.dataTransfer.getData(tp)})
           }
           break
         case "text/html":
           this.fullResult.push({type:'html',data: e.dataTransfer.getData(tp)})
           break
         case "text/plain":
           this.fullResult.push({type:'text',data: e.dataTransfer.getData(tp)})
           break
         case "Files":
           this.fullResult.push({type:'files',data: [...e.dataTransfer.files]})
           break
         default:
           alert('none of our stuff handle',e.dataTransfer.types[e.dataTransfer.types.length-1])
       }
    },
    xonDrop(e) {
      this.fullResult.length = 0
      if (e.dataTransfer.types && e.dataTransfer.types.length) {
        this.type =  e.dataTransfer.types[e.dataTransfer.types.length-1]
        e.dataTransfer.types.forEach(tp => {
          console.log('type = ', tp)
          this.saveFullResult(tp,e)
        });
      }
      this.e = ` d-${e.dataTransfer.dropEffect}  t-${e.dataTransfer.types} , i-${e.dataTransfer.items}  , f-${e.dataTransfer.files}`
      if (this.fullResult.length) {
         console.log('emit!!!')
        this.$emit('dataDropped', this.fullResult)
        this.dragging = false
        this.dragFalse()
      }
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