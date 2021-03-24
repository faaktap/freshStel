<template>
  <v-container v-if="emailList">
   <v-row><v-col cols="12">
    <v-card class="mx-auto">
       <v-container>
         <v-row dense>
           <v-col cols="12">
             <v-card color="purple lighten-3">
  <v-data-table
    :headers="emailHeader"
    :items="emailList"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table> 
             </v-card>
           </v-col>
         </v-row>
       </v-container>
    </v-card>
   </v-col></v-row>
  </v-container>   
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
export default {
    name:"StudentEmailList",
    props: ['studentList'],
    data: () => ({
      emailList:null,
      emailHeader: [
          //{text: 'id',            align: 'start',            value: 'subid' },
          {text: 'email',         align: 'start',            value: 'email' },
          //{text: 'impNumber',     align: 'start',            value: 'impnumber' },
          {text: 'fullname',      align: 'start',            value: 'name' },
          {text: 'OptOut',       align: 'start',            value: 'outid' },
          {text: 'Inserted',       align: 'start',            value: 'insertdate' },
          //{text: 'Changed',       align: 'start',            value: 'changedate' },
          //{text: 'Extra',       align: 'start',            value: 'extra' },
        ]

    }),
    methods:{
      getEmails() {
        let sl = { task: 'plainSql'
                 , sql: 'SELECT * FROM m_subscriber where impnumber = ' + this.studentList.data.studentid}
        zmlFetch(sl, this.processAfterFetch); 
      },
      processAfterFetch(response) {
          console.log(response)
          if (!response.error) {
             this.emailList = response
          }
      }

    },
    mounted: function() {
        console.log('SEL : Mount')
        if (this.studentList) {
           console.log('SEL : ', this.studentList.data.studentid)
           this.getEmails()
        } else {
           console.log('SEL : NoName')
        }
    },
    watch: {
        studentList(n,o) {
            if (n != o) this.getEmails()
        }
    }
}
</script>