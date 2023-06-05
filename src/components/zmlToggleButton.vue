<template>
<div class="topright">
<v-btn-toggle v-for="(icon,i) in icons" :key="icon"
              :colors="['gray', 'lightgray']"
              @change="updateValue(toggleView)"
              :value="value"
              dense
              xbackground-color="primary"
>
    <v-btn class="mr-1"
           :class="colors[i]"
           :title="titles[i]"
           small
           xicon
           @click="toggleView=i"
    >
        <v-icon color="primary"> {{ icon }} </v-icon>
    </v-btn>
</v-btn-toggle>
</div>
</template>

<script>
export default {
  name:"zmlToggleButton",
  components: {},
  props:{
       value:{},
       icons:{type: Array, default: () => ['mdi-content-save','mdi-close']},
       colors:{type: Array,default: () => ['green','red accent-2']},
       titles:{type: Array,default: () => ['Save','Close without saving']},
       events:{type: Array,default: () => ['save','close']},
       },
  data: () => ({
    toggleView:'',
  }),
  methods:{
     updateValue(e) {
        console.log('emit:', this.$options.name, e)
        this.$emit('input', e)
        this.$emit(this.events[e])   // we emit an event we can capture on other side .. like @close, and @save
      },
  }
}
</script>

<style scoped>
.topright {
        position: absolute;
        top: 10px;
        right: 8px;
    }
</style>