<template>
    <v-radio-group v-model="inp">
        {{ label || ''}}
      <v-layout row wrap align-content-start justify-space-around class="ma-2 pa-2">
        <v-radio v-for="(l,i) in theList" :key="i" :value="i">
          <template v-slot:label>
            <v-img
              :src="l.pic || 'some pic'"
              :alt="l.alt || 'no alt'"
              :title="l.title || 'none'"
              :height="l.height || height|| 'auto'"
              :width="l.width || width ||  'auto'"
              :cover="cover || false"
              :contain="contain || false"
            />
          </template>
        </v-radio>
      </v-layout>
    </v-radio-group>
</template>

<script>
export default {
  name:'VRadioPic',
  props: ['items','type','value', 'obj','label', 'color', 'cover','contain', 'height', 'width'],
  data () {
    return {
      hello:''
    }
  },
  methods:{
  },
  computed:{
    theList() {
        if (!this.items) {
            return []
        }
        if (!this.items[0].pic) {
            return [{pic:'https://www.zmlrekenaars.co.za/test/img/wall042.jpg', alt:'Alternate Text 1', title:'The 1st Title', height:'100px', width:'100px'}
                   ,{pic:'https://www.zmlrekenaars.co.za/test/img/wall001.jpg', alt:'Alternate Text 2', title:'The 2ndt Title', height:'100px', width:'100px'}
                   ]
        }
        return this.items
    },
    inp:{
      get(){  return this.value},
      set(v){ this.$emit('input', v)}
    }
  }
}
</script>