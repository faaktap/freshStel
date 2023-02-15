<template>
<!-- Must make dialog persistent - otherwise value get's confused. -->
<v-dialog v-model="showIt" :fullscreen="$vuetify.breakpoint.mobile" max-width="400">
 <v-card  max-width="400" color="white" style="position: relative;">
  <v-card-title xclass="text-md-h4 d-xs-none d-sm-block wordbreak text-center">
    <span>Merit Level Edit (Still to be completed)</span>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-menu>
  </v-card-title>

   <v-card class="pa-2" v-if="currentRecord">
    <v-layout row wrap align-content-start justify-space-between>
     <!-- <personel-menemonic class="my-2"
                         :value="currentRecord.owner"
                         @userid="currentRecord.userid = $event"/> -->
     <v-text-field v-model="currentRecord.title" label="title" filled class="ma-2"/>
     <v-text-field v-if="currentRecord.forward == 0"
                   v-model="currentRecord.meritid"
                   label="meritid"
                   filled class="ma-2" />
     <v-textarea v-model="currentRecord.description" label="description" filled class="ma-2"/>
    </v-layout>
   </v-card>
  <v-card-actions>
    <v-spacer />
    <v-btn @click="save" color="primary"> save </v-btn>
    <v-btn @click="close" color="primary"> close </v-btn>
   </v-card-actions>
 </v-card>
</v-dialog>
</template>

<script>
import { getters } from "@/api/store";
import { zData } from "@/api/zGetBackgroundData.js"
import { crudTask } from "@/components/merit/crudTask.js"
import { infoSnackbar } from "@/api/GlobalActions"
// import PersonelMenemonic from '@/components/staff/PersonelMenemonic.vue';
export default {
    name: 'MeritForm',
//    components:{ PersonelMenemonic},
    props:{
       id:String,
      },
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
        crudTask: crudTask,
        currentRecord:{},
        showIt: false,
    }},
    updated() {
      this.finishedLoading()
    },
    mounted() {
      if (this.getZml.meritLevel.length < 10) {
        zData.initialData('checkofditwerk',this.finishedLoading)
      }
      console.log(this.$options.name , 'mounted', this.id)
      this.finishedLoading()

    },
    computed: {
    },
    methods: {
      save() {
        crudTask.saveData('merit', this.currentRecord, this.afterward)
        this.$emit('done','saved')
      },
      close() {
        this.$emit('done','close')
      },
      afterward(e) {
        console.log('afterwards: ', e)
      },
      finishedLoading() {
        //Search for the id we got...
        if (this.id) {
          this.currentRecord = crudTask.get('merit',this.id)
          this.showIt = true
          console.log('zzz',this.currentRecord)
        } else { console.log('ID is bad.')}
      },
      clickOnRow(e1,e2) {
        console.log('clicked on row inside row', e1,e2)
        infoSnackbar('clicked on row inside row')
      },
    },
    watch: {
      id(newVal, oldVal) {
        console.log(newVal, oldVal, this.id)
        this.finishedLoading()
      }
    }
  }
</script>
