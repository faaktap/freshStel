<template>
 <v-card xmax-width="500" class="mx-auto" :color="color" elevation="2" :loading="loading">
   <v-card-title
       class="headline ma-1">
       Student Learn Assist
   </v-card-title>
   <v-card-text >
    <v-flex xs4>
    Does this student need examination assistance?
    </v-flex>
    <v-flex xs6>
         <v-radio-group dense v-model="learnAssistFlag" label="BUR" row>
          <v-radio  label="Yes"  :value="true"  ></v-radio>
          <v-radio  label="No"   :value="false"></v-radio>
         </v-radio-group>
    </v-flex>
    <v-flex xs2><v-btn @click="updateDB"> update </v-btn></v-flex>
   </v-card-text>
   <v-card-actions>

   </v-card-actions>
 </v-card>
</template>

<script>
import { zData } from "@/api/zGetBackgroundData.js"
import { getters } from "@/api/store";
export default {
    name:"StudentEmailList",
    props: ['studentid','color'],
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      loading:false,
      learnAssistFlag: false
    }),
    methods:{
      checkDB() {
        //Check if student is in learnAssist table
        let sqlStatement = `select count(*) cnt from dkhs_learnassist where studentid = ${this.studentid}`
        zData.loadSql(this.loading, sqlStatement, this.assignData)
      },
      assignData(response) {
        this.learnAssistFlag = false
        if (response[0].cnt > 0) this.learnAssistFlag = true
      },
      updateDB() {
        let sqlStatement
        if (this.learnAssistFlag) {
          sqlStatement = `REPLACE INTO dkhs_learnassist VALUES (null, ${this.studentid}, 0,now())`
        } else {
          sqlStatement = `DELETE FROM dkhs_learnassist where studentid = ${this.studentid}`
        }

        zData.loadSql(this.loading, sqlStatement, this.updatedData)
      },
      updatedData(response) {
        console.log('Update:',response)
        alert('wat nou')
      }

    },
    mounted: function() {
        console.log(this.$options.name,  this.studentid)
        this.learnAssistFlag = false
        if (this.studentid) this.checkDB()
    },
    watch: {
        studentid(n,o) {
            if (n != o) this.checkDB()
        },
    }
}
</script>