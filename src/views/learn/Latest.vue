<template>
  <div>
    <v-toolbar  dense  row  wrap>
    <v-spacer></v-spacer>
    <v-btn-toggle dense v-model="toggleDisplay">
        <base-tool-button class="mr-2">
           <template v-if="!$vuetify.breakpoint.smAndDown">Grade </template> 8
        </base-tool-button>
        <base-tool-button class="mr-2">
         Grade 9
        </base-tool-button>
        <base-tool-button class="mr-2">
        Grade 10
        </base-tool-button>
        <base-tool-button class="mr-2">
        Grade 11
        </base-tool-button>
        <base-tool-button class="mr-2">
        Grade 12
        </base-tool-button>
      </v-btn-toggle>

         </v-toolbar>

      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
      <h1> File activity in the past month </h1>
            <v-text-field filled dense
                    class="ma-2"
                    v-model="search"
                    append-icon="mdi-close"
                   @click:append="search = ''"
                    placeholder="search"/>

            <v-data-table
                 :headers="tHeader"
                 :items="tableFilter"
                 :items-per-page="120"
                 :search="search"
                  xxxgroup-by="grade"
                  hide-default-footer
                  xxxhide-default-header
                  class="elevation-2"
                  color="purple lighten-3"
                  @click:row="clickOnTableRow"
            >
            </v-data-table>
  </div>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
export default {
    components: {BaseToolButton

    },
    props: ['days'],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        tData:[],
        tHeader:[{ text:'Grade',value:'grade'}
                ,{ text:'Subject', value: 'subject'}
                ,{ text:'Name', value: 'name'}
                //,{ text:'PPAth', value: 'ppath'}
                //,{ text:'Size', value: 'size'}
                //,{ text:'ext', value: 'ext'}
                ,{ text:'Date', value: 'date'}
                //,{ text:'Type', value: 'type'}
                //,{ text:'Path', value: 'path'}
                ],
        previousDays:null,
        search:'',
        toggleDisplay:1
       }
   },
   computed: {
     grade() {
       let filterGrade = this.toggleDisplay + 8

       filterGrade = ('0' + filterGrade).slice(-2)
       return 'GR' + filterGrade.toString()
     },
     tableFilter() {
       return this.tData.filter(e => e.grade == this.grade)
     }
   },
   methods: {
     loadData() {
      this.progress = true;
      let ts = {}
      ts.api = 'https://kuiliesonline.co.za/api/file/zmlDir.php'
      ts.task = 'read'
      zmlFetch(ts, this.processData, this.loadError);
     },
     loadError(error) {
       console.log('load files:', error)
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
      console.log(filter.length)
      this.tData = filter.filter(function (e) {
            return !e.path.includes('WERNER');
      })
      console.log(this.tData.length)
      this.progress = false
      this.tData.forEach(e => {
         let pos1 = e.ppath.indexOf("/");
         let pos2 = e.ppath.indexOf("/", pos1 + 1);
         e.grade = e.ppath.slice(0,pos1)
         e.subject = e.ppath.slice(pos1+1,pos2)
         console.log(e.grade, e.subject, pos1, pos2)
      });
      this.tData = filter
      this.tData.sort((a,b) => b.date.localeCompare(a.date));
      console.log('Latest Full Set - SORTED:',this.tData)
      this.progress = false
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
       ////this.$cscs.l'icons',this.$vuetify.icons)
   },

}
</script>
