<template>
<v-container fluid>
 <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall109.jpg"
              title="De Kuilen eBulletins"
              text=""
              breakup1="100"
              breakup2="20"
               />

 <v-card class="mx-auto" elevation="2">
       <base-tool toolbarName="Newsletters"
       icon="mdi-email-newsletter"
       :toolList="[]"
       :loading="loading"
       :background="false"
       :back="true"
     >
    <base-search class="text-uppercase"
                 :outlined=false
                 v-model="searchString"
                 @clear="searchString=''" />
     </base-tool>
  <!-- <v-btn @click="testNodes"> test </v-btn> -->
   <v-card-text v-if="emailList">
    <v-row>
      <!-- <v-flex v-for="email in emailList" :key="email.deliveryid"> -->
      <v-flex v-for="email in filterTable" :key="email.deliveryid">
         <v-card class="ma-4" color="FloralWhite" max-width="250">
          <v-responsive>
          <v-img class="ma-1" :src="thumbLookup + email.attachments[0].webLink"  >
          </v-img>
          </v-responsive>
            <v-card-subtitle
                 xclass="text-center black--text" xstyle="background-color: rgba(108, 141, 213,0.4);">
              {{email.subject}}

         <!-- <v-card-actions> -->


         <!-- </v-card-actions> -->
            </v-card-subtitle>
           <v-card-actions >
            <v-spacer  />
            <v-btn small
              @click="clickOnRow(email)">
              <v-icon> mdi-attachment </v-icon>
              More
           </v-btn>
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

   <v-dialog v-model="showList" color="green" :fullscreen="$vuetify.breakpoint.smAndDown" width="auto">
    <v-card>
      <v-card-title> Attachments
                   <span v-if="'deliveryid' in email" class="text-caption mx-2">
                     {{email.sentdate.substr(0,10)}}
                      <v-badge bordered color="green">
             <span slot="badge"> {{email.deliveryid}} </span>
           </v-badge>
           </span>
     </v-card-title>
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
    <v-btn small color="primary" to="/" class="ma-2"><v-icon class="mr-2">mdi-home</v-icon> Home </v-btn>
   </v-card-actions>
 </v-card>
</v-container>
</template>

<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
import baseTool from '@/components/base/baseTool.vue'
import baseSearch from '@/components/base/baseSearch.vue'
import HeroSection from "@/views/sections/HeroSection.vue"
export default {
    name:"EmailBulletins",
    props: ['emailSearch'],
    components:{baseTool, baseSearch, HeroSection},
    head: {
       meta: [
         { name: 'description', content: 'Werner EMAIL BULLETINS' },
       ],
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      searchString: '',
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
        emailHtml:'',
        loading:false,
        email:{},
        thumbLookup: 'https://kuiliesonline.co.za/api/thumb/?name='

    }),
    computed: {
      filterTable() {
        if (this.emailList.length == 0) return []
        if (this.searchString == '') return this.emailList
        return this.emailList.filter(e => e.subject.toLowerCase().includes(this.searchString.toLowerCase() ))
      }
    },
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
        this.loading = true
        let sl = { task: 'plainSql'
                  , sql:`SELECT html FROM m_partlink WHERE deliveryid = ${deliveryid} order by orderBy`
                  }
        zmlFetch(sl, this.htmlLoaded);
      },
      htmlLoaded(response) {
          this.loading = false
          this.emailHtml = ''
          response.forEach(e => this.emailHtml += e.html)

      },
      clickOnRow(e) {
        this.getHtml(e.deliveryid)
        this.attachments = e.attachments
        this.email = e

        if (e.attachments.length == 1) {
          this.doit(e.attachments[0])
        } else {
          this.showList = true
        }
      },
      getEmails() {
        let sl = { task: 'plainSql', sql:''}
        this.loading = true
        if (this.emailSearch) {
            sl.sql = `SELECT d.deliveryid, d.subject, group_concat(htmlfilepath,',') attachments, s.sentdate \
                      FROM m_delivery d, m_attachment a\
                        , (select deliveryid, min(sentdate) sentdate from m_emailsent group by deliveryid) s\
                      WHERE d.subject like '%${this.emailSearch}%'\
                       and d.deliveryid = a.deliveryid\
                       and  s.deliveryid = a.deliveryid\
                     group by d.deliveryid, d.subject\
                     ORDER BY d.deliveryid DESC`
        } else {
          sl.sql = `SELECT d.deliveryid, d.subject, group_concat(htmlfilepath,',') attachments, s.sentdate\
                      FROM m_delivery d, m_attachment a \
                         , (select deliveryid, min(sentdate) sentdate from m_emailsent group by deliveryid) s \
                     WHERE  d.deliveryid = a.deliveryid\
                       and  s.deliveryid = a.deliveryid\
                     group by d.deliveryid, d.subject\
                     ORDER BY d.deliveryid DESC limit 50`
        }
        zmlFetch(sl, this.processAfterFetch);

      },
      processAfterFetch(response) {
        this.loading = false
        this.emailList = []
        if (!response.error) {
           response.forEach(el => {
            if (el.attachments) {
              // We receive attachments as a comma seperated list of files(hrefs), so we split by comma, and add to array
              // then we make a filename, by taking last part of href, and store as filename,  and save href as weblink
              // then we sort it, in an attempt to get picture pdf as first array item
              // since we use the first item to display a thumbnail
              let arr = el.attachments.split(',')
              let result = []
              arr.forEach(a => {
                 if (a.length) {
                   result.push( {filename:a.split('\\').pop().split('/').pop(), webLink:a} )
                 }
               })
               result.sort((a, b) => a.filename.localeCompare(b.filename))
               el.attachments = result
            }
            this.emailList.push(el)
            });
         } else {
           this.emailList = []
        }
        //console.log('after all : ', this.emailList)
      }
    },
    mounted()  {
        console.log('mount:', this.$options.name, this.emailSearch)
        this.getEmails()
    },
    watch: {}
}
</script>