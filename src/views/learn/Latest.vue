<template>
<v-container fluid>
 <base-tool :toolbarName="`File activity in the past ${previousDays || 0} days.`"
           :loading="loading"
 >

  <v-btn-toggle v-model="toggleGradeDisplay">
    <base-tool-button>
     <template v-if="!$vuetify.breakpoint.smAndDown">Grade </template> 8
    </base-tool-button>
    <base-tool-button>         Grade 9        </base-tool-button>
    <base-tool-button>        Grade 10        </base-tool-button>
    <base-tool-button>        Grade 11        </base-tool-button>
    <base-tool-button>        Grade 12        </base-tool-button>
  </v-btn-toggle>
  <v-btn text x-small @click="showAll"><v-icon> A</v-icon> </v-btn>
 </base-tool>
      <v-text-field filled dense
              class="ma-2"
              v-model="search"
              append-icon="mdi-close"
              clearable
              single-line hide-details
              prepend-icon="mdi-magnify"
              placeholder="search"
      />
      <v-data-table
           :headers="tHeader"
           :items="tableFilter"
           :items-per-page="120"
           :search="search"
            group-by="subject"
            xxxgroup-by="grade"
            hide-default-footer
            class="elevation-2"
            color="purple lighten-3"
            :loading="loading"
            @click:row="clickOnTableRow"
      >
      </v-data-table>
 </v-container>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import baseTool from '@/components/base/baseTool.vue'
export default {
    components: {
      BaseToolButton,
      baseTool
    },
    props: ['days'],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        timerHandle:null,
        dataSequence:false,
        tData:[],
        tAllData:[],
        tHeader:[{ text:'Grade',value:'grade'}
                ,{ text:'Subject', value: 'subject'}
                ,{ text:'Name', value: 'name'}
                //,{ text:'PPAth', value: 'ppath'}
                ,{ text:'Size', value: 'size'}
                ,{ text:'ext', value: 'ext'}
                ,{ text:'Date', value: 'date'}
                //,{ text:'Type', value: 'type'}
                //,{ text:'Path', value: 'path'}
                ],
        previousDays:null,
        search:'',
        toggleGradeDisplay:3,
        loading: false,
       }
   },
   computed: {
     grade() {
       let filterGrade = this.toggleGradeDisplay + 8

       filterGrade = ('0' + filterGrade).slice(-2)
       return 'GR' + filterGrade.toString()
     },
     tableFilter() {
       return this.tData.filter(e => e.grade == this.grade)
     }
   },
   methods: {
    showAll() {
      this.tData = this.tAllData
    },
     loadData() {
      this.loading = true
      let ts = {}
      ts.api = 'https://kuiliesonline.co.za/api/file/zmlDir.php'
      ts.path = '/home/kuilieso/public_html/Subjects'
      ts.task = 'read'
      this.loading = true
      zmlFetch(ts, this.processData, this.loadError);
     },
     loadError(error) {
       this.$cs.l('load files:', error)
       this.loading = false
       alert('we cannot read the data - error in processing')
     },
     processData(response) {
      let filter = response.filter(function (e) {
            return e.type != 'FOLDER' || e.size;
      })

      this.tData = filter.filter(function (e) {
            return !e.path.includes('TEACHER');
      })
      filter = this.tData.filter(function (e) {
            return !e.path.includes('.Trash');
      })
      //this.$cs.l(filter.length)
      this.tData = filter.filter(function (e) {
            return !e.path.includes('WERNER');
      })
      //this.$cs.l(this.tData.length)
      this.loading = false
      this.tData.forEach(e => {
         //console.log('tData - e', e)
         if (e.ppath == false ) return   //happens if there is a file in the root. (Subjects)
         let pos1 = e.ppath.indexOf("/");
         let pos2 = e.ppath.indexOf("/", pos1 + 1);
         e.grade = e.ppath.slice(0,pos1)
         e.subject = e.ppath.slice(pos1+1,pos2)
         //console.log(e.grade, e.subject, pos1, pos2)
      });
      this.tData = filter
      this.tData.sort((a,b) => b.date.localeCompare(a.date));
      //this.$cs.l('Latest Full Set - SORTED:',this.tData)
      this.tAllData = this.tData

      filter = this.tData.filter(function (e) {
            return e.date.includes('2023') || e.date.includes('2022-12');
      })
      this.tData = filter

      this.loading = false
     },
     clickOnTableRow(p1) {
        //Take this findfolder out, since we understand file contentid in latest.vue
        //sh.contentData('findfolder', this.callSH, p1)
        this.callSH(p1.ppath)
     },
     callSH(cid) {
        // this.$router.push({name: 'folder'
        //                    ,params:{folder:cid}
        //                    ,meta: {layout: "AppLayoutGray" }});
       this.$router.push({path: '/folder/'+cid})
     }
   },
   mounted() {
       //we pass the days as a parameter on route ie: /latest/5
       //If no param is passed, we default to 4
       this.previousDays = this.days || 4
       this.loadData()
       this.toggleGradeDisplay = this.getZml.login.grade.match(/\d+/)[0] - 8
   },

}
</script>
