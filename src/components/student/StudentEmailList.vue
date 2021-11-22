<template>
 <v-card xmax-width="500" class="mx-auto" :color="color" elevation="2"> 
   <v-card-title class="headline ma-1"> Emails </v-card-title>
   <v-card-text v-if="emailList">
   <v-data-table
         :headers="emailHeader"
         :items="emailList"
         :items-per-page="15"
         :hide-default-footer="true"
         class="elevation-1"
         @click:row="clickOnRow"
       ></v-data-table> 
   </v-card-text>       
   <v-card-text v-else>
      Oops - no emails found for {{ studentid }}
   </v-card-text>
 </v-card>   
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
export default {
    name:"StudentEmailList",
    props: ['studentid','color'],
    data: () => ({
      emailList:null,
      emailHeader: [
        //{text: 'id',       align: 'start',  value: 'subid' },
          {text: 'email',    align: 'start',  value: 'email' },
        //{text: 'impNumber',align: 'start',  value: 'impnumber' },
        //{text: 'fullname', align: 'start',  value: 'name' },
          {text: 'OptOut',   align: 'start',  value: 'description' },
          {text: 'Inserted', align: 'start',  value: 'insertdate' },
          {text: 'Changed',  align: 'start',  value: 'changedate' },
          {text: 'Note',     align: 'start',  value: 'extra' },
          {text: 'Group',    align: 'start',  value: 'grpname' },
          {text: 'SubID',    align: 'start',  value: 'subid' },
        ]
    }),
    methods:{
      clickOnRow(e) {
        console.log('emails clicked on row',e)
        this.$router.push({ name: 'emailssent', params: {subid: e.subid, editmode: false} })
      },
      getEmails() {
        if (this.studentid) {
           let sl = { task: 'plainSql'
                    , sql: `SELECT s.email, m.description, impnumber, insertdate 
                                 , changedate, extra, s.subid, IFNULL(group_concat(grpname), 'NONE') grpname 
                              FROM m_subscriber s 
                            left join m_out m on s.outid = m.outid 
                            left join m_grouplink g on s.subid = g.subid 
                            left join m_group a on a.grpid = g.grpid 
                             WHERE impnumber = ${this.studentid}
                            GROUP BY s.email, m.description, impnumber, insertdate`}
// SELECT s.email, m.description, impnumber, insertdate
//     , changedate, extra, s.subid, IFNULL(group_concat(grpname), 'NONE') grpname
//  FROM m_subscriber s 
//  left join m_out m on s.outid = m.outid 
//  left join m_grouplink g on s.subid = g.subid 
//  left join m_group a on a.grpid = g.grpid
// where impnumber < 20000
// group by  s.email, m.description, impnumber, insertdate
//     , changedate, extra, s.subid

           zmlFetch(sl, this.processAfterFetch); 
        }
      },
      processAfterFetch(response) {
        console.log(response)
          if (!response.error) {
             this.emailList= response
          } else {
              this.emailList = []
          }
      }

    },
    mounted: function() {
        console.log(this.$options.name,  this.studentid)
        if (this.studentid) {
           this.getEmails()
        }
    },
    watch: {
        studentid(n,o) {
            if (n != o) this.getEmails()
        }
    }
}
</script>