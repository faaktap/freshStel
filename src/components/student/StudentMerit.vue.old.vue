<template>
 <v-card xmax-width="500" class="mx-auto" :color="color" elevation="2" :loading="loading">
   <v-card-title
       class="headline ma-1">
       Student Merit Information
   </v-card-title>
   <v-card-text >
    <v-flex xs12>
      <merit-list :studentid="studentid" meritid="0"/>
    </v-flex>
    <v-flex xs12>
         <merit-chip :studentid="studentid" />
    </v-flex>
   </v-card-text>
   <v-card-actions>

   </v-card-actions>
 </v-card>
</template>

<script>
//import { zData } from "@/api/zGetBackgroundData.js"
import { getters } from "@/api/store";
import MeritChip from "@/components/merit/MeritChip"
import MeritList from "@/components/merit/MeritList"

export default {
    name:"StudentMerit",
    props: ['studentid','color'],
    components:{
        MeritChip
      , MeritList
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      loading:false,
      student:{}
    }),
    methods:{
      checkDB() {
        // this.$cs.l(this.$options.name,'1',this.student)
        // this.$cs.l(this.$options.name,'2',Object.keys(this.student).length)
        // if (!Object.keys(this.student).length) {
        //   let sqlStatement = `select * from dkhs_student where studentid = ${this.studentid}`
        //   zData.loadSql(this.loading, sqlStatement, this.assignData)
        // } else {
        //   //This student loaded already
        //   this.$cs.l('student loaded already', this.student, this.studentid)
        // }
      },
      assignData(response) {
        this.$cs.l('loaded:',response)
        // this.student = response[0]
        // this.$cs.l('loaded:',this.student)
      },

    },
    mounted: function() {
        this.$cs.l('Mount',this.$options.name,  this.studentid)
        // if (this.studentid != 'undefined') this.checkDB()
    },
    watch: {}
}
</script>