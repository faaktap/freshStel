<template>
 <v-card xmax-width="500" class="mx-auto" :color="color" elevation="2" :loading="loading">
   <v-card-title
       class="headline ma-1">
       Student Merit Information
   </v-card-title>
   <v-card-text >
    <v-flex xs12>
         <merit-chip />
    </v-flex>
    <!-- <v-flex xs2><v-btn @click="updateDB"> update </v-btn></v-flex> -->
   </v-card-text>
   <v-card-actions>

   </v-card-actions>
 </v-card>
</template>

<script>
import { zData } from "@/api/zGetBackgroundData.js"
import { getters } from "@/api/store";
import MeritChip from "@/components/merit/MeritChip"

export default {
    name:"StudentMerit",
    components:{MeritChip},
    props: ['studentid','color'],
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      loading:false,
      student:{}
    }),
    methods:{
      checkDB() {
        this.$cs.l('1',this.student)
        this.$cs.l('2',Object.keys(this.student).length)
        if (!Object.keys(this.student).length) {
          let sqlStatement = `select * from dkhs_student where studentid = ${this.studentid}`
          zData.loadSql(this.loading, sqlStatement, this.assignData)
        } else {
          //This student loaded already
          this.$cs.l('studentid loaded alreday', this.student, this.studentid)
        }
      },
      assignData(response) {
        this.student = response[0]
        this.$cs.l('loaded:',this.student)
        ///let sqlStatement = `select * from dkhs_student where studentid = ${this.studentid}`
        ///zData.loadSql(this.loading, sqlStatement, this.assignData)
      },
      updateDB() {
        let sqlStatement
        alert('update merit')

        zData.loadSql(this.loading, sqlStatement, this.updatedData)
      },
      updatedData(response) {
        this.$cs.l('Update:',response)
        alert('wat nou')
      }

    },
    mounted: function() {
        this.$cs.l(this.$options.name,  this.studentid)
        if (this.studentid) this.checkDB()
    },
    watch: {
        // studentid(n,o) {
        //     if (n != o) this.checkDB()
        // },
    }
}
</script>