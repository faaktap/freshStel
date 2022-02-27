<template>
 <v-card class="mx-auto" elevation="2">
   <v-card-title class="headline ma-1"> Email Bulletins </v-card-title>
   <v-card-text v-if="emailList">
   <v-data-table
      :headers="emailHeader"
      :items="emailList"
      :items-per-page="15"
      :hide-default-footer="true"
      class="elevation-1"
      @click:row="clickOnRow"
    />
   </v-card-text>
   <v-card-text v-else>
      Oops - no emails bulletins found
   </v-card-text>
 </v-card>
</template>

<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
export default {
    name:"EmailBulletins",
    props: ['emailSearch'],
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      emailList:[],
      emailHeader: [
          {text: 'id',       align: 'start',  value: 'deliveryid' },
          {text: 'subject',    align: 'start',  value: 'subject' },
          //{text: 'files',    align: 'start',  value: 'attachments' },
          {text: 'link1',    align: 'start',  value: 'link1' },
          {text: 'link2',    align: 'start',  value: 'link2' },
        ]
    }),
    methods:{
      clickOnRow(e) {
        console.log('emails clicked on row',e)
      },
      getEmails() {
        let sl = { task: 'plainSql'
                 , sql: `SELECT d.deliveryid, d.subject, group_concat(htmlfilepath,',') attachments
                           FROM m_delivery d, m_attachment a
                          WHERE d.subject like '%${this.emailSearch}%'
                             and d.deliveryid = a.deliveryid
                          group by d.deliveryid, d.subject
                          ORDER BY d.deliveryid DESC`}
        zmlFetch(sl, this.processAfterFetch);

      },
      processAfterFetch(response) {
        console.log('response = ', response)
        this.emailList = []
        if (!response.error) {
          response.forEach(el => {
            if (el.attachments) {
               console.log('2',el.attachments)
               let arr = el.attachments.split(',')
               let cnt = 0
               arr.forEach(a => {
                 if (a.length) {
                   cnt++;
                   const filename = a.split('\\').pop().split('/').pop();
                   el['link'+cnt] = filename
                 }
               })
            }
            this.emailList.push(el)
          });
         } else {
              this.emailList = []
        }
      }
    },
    mounted: function() {
        console.log(this.$options.name, this.emailSearch)
        if (this.emailSearch) {
           this.getEmails()
        }
    },
    watch: {}
}
</script>