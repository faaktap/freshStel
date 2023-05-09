<template>
<v-container fluid>
  <v-card >
    <v-card-actions v-if="showAdd==false">
      <v-btn  @click="showAdd = !showAdd"> Add </v-btn>
    </v-card-actions>
  <v-chip-group mandatory column v-if="showAdd">
    <v-chip v-for="tag in meritFilter"
            :key="tag.meritid"
            @click="okWereGood(tag)"
            outlined
            :title="tag.description"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  </v-card>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zData } from "@/api/zGetBackgroundData.js"
  export default {
    name: 'MeritChip',
    props:['studentid'],
    components:{
    },
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
        showAdd:false,
        aTable: [],
        curTag:'',
    }},
    computed: {
       meritFilter() {
         return this.aTable
       },
    },
    methods: {
      okWereGood(pData) {
        console.log('.....We do not need description here ',  pData.meritid, this.studentid, pData)
        this.$router.push({name: 'MeritStepper' , meta: {layout: "AppLayoutDefault" }
                          ,params: {meritid: pData.meritid
                                 , description: pData.title
                                 , studentid:this.studentid}
                          })
      },
      initialize(data) {
        data.forEach(e => {
          let colon =  e.defaultdescription.indexOf(':')
          e.title = e.defaultdescription.substring(0, colon-1)
          e.description = e.defaultdescription.substring(colon+1)
        })
        this.aTable = data
        this.getZml.meritLevel = data
       },
    },
    mounted() {
      this.$cs.l('Mounted', this.$options.name, 'Stud?=',this.studentid)
      let sqlStatement = `SELECT meritid, defaultpersmenemonic, point, defaultdescription FROM dkhs_meritlink`
      zData.loadSql(this.loading, sqlStatement, this.initialize, this.error)
    },

  }
</script>