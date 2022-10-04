<template>
 <v-card class="mx-auto" elevation="2">
   <v-card-title class="headline ma-1"> Email Bulletins </v-card-title>
   <v-card-text v-if="emailList">
    <v-row>
      <v-flex v-for="email in emailList" :key="email.deliveryid">
         <v-card class="ma-4" color="#939D44">
         <v-card-subtitle> {{email.subject}} </v-card-subtitle>
         <v-card-actions>
           <v-btn small
              @click="clickOnRow(email)">
              <v-icon> mdi-attachment </v-icon>
              Read
           </v-btn>
           <v-badge bordered color="green">
             <span slot="badge"> {{email.deliveryid}} </span>
           </v-badge>
           <v-spacer />
           {{email.sentdate.substr(0,10)}}
         </v-card-actions>
         </v-card>
      </v-flex>
    </v-row>
   <!-- <v-data-table
      :headers="emailHeader"
      :items="emailList"
      :items-per-page="15"
      :hide-default-footer="true"
      class="elevation-1"
      @click:row="clickOnRow"
    >
   </v-data-table> -->
   </v-card-text>
   <v-card-text v-else>
      Oops - no emails bulletins found
   </v-card-text>

   <v-dialog v-model="showEmail" :fullscreen="$vuetify.breakpoint.mobile" width="auto">
     <v-card class="ma-2 pa-2">
       <v-card-title>
           <v-spacer />
           <v-btn icon @click="showEmail = false"><v-icon> mdi-window-close </v-icon>
           </v-btn>
       </v-card-title>
       <v-card-text  v-html="emailHtml" />
       <v-card-actions>
        <v-btn ripple small @click="showEmail = false">
          <v-icon> mdi-window-close </v-icon>
          Close
        </v-btn>
       </v-card-actions>
     </v-card>
   </v-dialog>

   <v-dialog v-model="showList" color="green" :fullscreen="$vuetify.breakpoint.mobile" width="auto">
    <v-card>
      <v-card-title> {{ attachments }} </v-card-title>
      <v-card-text>
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
      <v-list>
        <v-list-item v-for="(a,i) in attachments" :key="i"
                     v-bind="attrs" v-on="on">
          <v-list-item-title  @click="doit(a)" >
           <v-icon> mdi-file</v-icon> {{a.filename}}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      </template>
    </v-menu>
    </v-card-text>
    </v-card>
   </v-dialog>
   <v-card-actions>
    <v-spacer />
    <v-btn color="primary" to="/"> Home </v-btn>
   </v-card-actions>
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
        ],
        showList:false,
        showEmail:false,
        attachments:[],
        emailHtml:''

    }),
    methods:{
      doit(a) {
        if (a.webLink) {
           this.showList = false
           window.open(a.webLink,'_' + 'ko_external')
        } else {
           this.showEmail = true
        }
      },
      getHtml(deliveryid) {
        let sl = { task: 'plainSql'
                  , sql:`SELECT html FROM m_partlink WHERE deliveryid = ${deliveryid} order by orderBy`
                  }
        zmlFetch(sl, this.htmlLoaded);
      },
      htmlLoaded(response) {
          this.emailHtml = ''
          response.forEach(e => this.emailHtml += e.html)
          //console.log(this.emailHtml)

      },
      clickOnRow(e) {
        this.getHtml(e.deliveryid)
        this.attachments = []
        this.attachments.push( {filename:'Email', webLink:''} )
        if (e.attachments) {
           let arr = e.attachments.split(',')
           arr.forEach(a => {
                 if (a.length) {
                   this.attachments.push( {filename:a.split('\\').pop().split('/').pop(), webLink:a} )
                 }
               })
        }
        this.showList = true
      },
      getEmails() {
        let sl = { task: 'plainSql', sql:''}
        if (this.emailSearch) {
           sl.sql = `SELECT d.deliveryid, d.subject, group_concat(htmlfilepath,',') attachments, s.sentdate
                      FROM m_delivery d, m_attachment a\
                        , (select deliveryid, min(sentdate) sentdate from m_emailsent group by deliveryid) s\
                      WHERE d.subject like '%${this.emailSearch}%'
                       and d.deliveryid = a.deliveryid
                       and  s.deliveryid = a.deliveryid
                     group by d.deliveryid, d.subject
                     ORDER BY d.deliveryid DESC`
        } else {
          sl.sql = `SELECT d.deliveryid, d.subject, group_concat(htmlfilepath,',') attachments, s.sentdate\
                      FROM m_delivery d, m_attachment a \
                         , (select deliveryid, min(sentdate) sentdate from m_emailsent group by deliveryid) s\
                     WHERE  d.deliveryid = a.deliveryid\
                       and  s.deliveryid = a.deliveryid\
                     group by d.deliveryid, d.subject\
                     ORDER BY d.deliveryid DESC`
        }
        zmlFetch(sl, this.processAfterFetch);

      },
      processAfterFetch(response) {
        this.emailList = []
        if (!response.error) {
           response.forEach(el => { this.emailList.push(el) });
         } else {
           this.emailList = []
        }
      }
    },
    mounted()  {
        console.log(this.$options.name, this.emailSearch)
        if (this.emailSearch) {
           this.getEmails()
        }
    },
    watch: {}
}
</script>