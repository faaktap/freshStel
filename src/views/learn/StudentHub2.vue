<template>
<div>
<v-sheet color="grey lighten-5" class="ma-2">
  <v-row  >
    <v-col xs-12 lg-4>
       <v-toolbar flat 
                  color="primary" dark xclass="mb-2"
       >
        <v-toolbar-title class="body-1">
           <v-btn small 
                 :to="{ name: 'SelectGrade' , params:{heading:'Grade', gradeno: getZml.grade},meta: {layout: 'AppLayoutGray' }}"
                 title="Go back to select other subjects"
           >
              Back
           </v-btn>
            Grade {{ getZml.grade }} {{ getZml.subject }}
             ( {{ filterShow }} ) {{filterByContent.length }} item(s)
        </v-toolbar-title>
       
       </v-toolbar>
    </v-col>
    <v-col xs="12" lg="6" >
     <v-layout row wrap>
      <v-flex class="pt-3"> 
       <v-btn-toggle v-model="toggle_button_state">
         <v-btn small  @click = "filter='*'" :loading="loadStatus" title="Show Folders"> 
          <v-icon>F</v-icon>
         </v-btn>
         <v-btn small @click="filter=''" :loading="loadStatus" title="Show All Items">
          <v-icon>A</v-icon>
         </v-btn>
         <v-btn small  @click = "filter='T'" :loading="loadStatus" title="Notes"> 
          <v-icon>T</v-icon>
         </v-btn>
         <v-btn small @click="loadData()" :loading="loadStatus" title="Refresh">
          <v-icon>R</v-icon>
         </v-btn>
         </v-btn-toggle>
      </v-flex>

      <v-flex>
            <v-text-field small label="Search" v-model="search" :loading="loadSearchStatus" />
      </v-flex>

    </v-layout>
    </v-col>
    </v-row>




    <v-row>
     <v-col xs-12 lg-12 >
      <v-card v-if="filter.length > 2" class="text-xs-caption font-weight-light text-justify pa-1" > 
       <v-btn small dense v-if="filter.length > 2" class="pa-2" @click="filter='*'"> 
         Back to folders (<v-icon small >F</v-icon>)  
       </v-btn>
      </v-card>
     </v-col>
    </v-row>

    <v-container fluid class="ma-2 mt-3" >
      <v-layout row wrap>
        <v-flex 
         v-for="item in filterByContent" :key="item.itemid"
         flex-row
         justify-space-around
         xs-12
         >
          <template v-if="item.type=='folder'">
            <student-folder-display @btn-click="showItem(item)" :item="item" />
          </template>
 
           <template v-else>
           <student-item-display :btnFace="item.name" :icon="item.icon" :item="item" />
          </template>
        </v-flex>
      </v-layout>
    </v-container>
</v-sheet>


<v-dialog v-model="showNoInfoDialog" eager>
    <v-card>
        <v-card-title> We did not find any Information! </v-card-title>
        <v-card-text> 
            Information for Grade {{ getZml.grade }},  {{ getZml.subject }} is not available at the moment.
         </v-card-text>
        <v-card-actions> 
            <v-btn @click="showNoInfoDialog = !showNoInfoDialog" color="info"> close </v-btn>
            <v-btn color="primary" :to="{ name: 'SelectGrade' 
                                        , params:{heading:'Grade', gradeno: getZml.grade}
                                        , meta: {layout: 'AppLayoutGray' }}"> 
              Select another subject 
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</div>
</template>

<script>
import { getters } from "@/api/store"
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { zmlLog } from '@/api/zmlLog.js';
import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions';
import StudentItemDisplay from '@/components/learn/StudentItemDisplay'
import StudentFolderDisplay from '@/components/learn/StudentFolderDisplay'

export default {
    name: "StudentHub",
    components: {StudentItemDisplay, StudentFolderDisplay},
    props: ['currentSubjectID','grade'   ],
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        toggle_button_state:null,
        showTextDialog:false,
        showNoInfoDialog:false,
        theItem:{},
        contents: [{itemid:1, heading:'wertnwer'}
                       ,{itemid:2, heading:'wertnwer'}
                       ,{itemid:3, heading:'sdfftnwer'}
                       ,{itemid:4, heading:'seWWtnwer'}
                       ,{itemid:5, heading:'AS dtnwer'}
                       ],
        filter:'*',
        embedDialog:false,
        search:'',
        loadStatus: false,
        loadSearchStatus: false,
        currentImage:'',        
    }),
    activated: function () {
    },
    methods:{
        loadSubjects(response) {
          //this.$cs.l('ssssssssssssssssssssssssssssssssssssssssssss')
          this.loadStatus = false
          this.getZml.subjects = response
          this.loadData()
        },
        loadData() {
           //this.$cs.l('............loadData - sub,grade', this.currentSubjectID , this.grade)
           if (this.currentSubjectID > 0 && this.grade > 0) {
              zmlLog(this.getZml.login.username , "Platform", this.grade + ' ' + this.currentSubjectID)
           } else {
              infoSnackbar('Grade or Subject is blank - Assume 8, 2')
           }
           let ts = {};
           this.contents = []
           ts.task = 'getlcontent'
           ts.data = {}
           ts.data.login = this.getZml.login
           ts.data.subjectid = this.currentSubjectID
           ts.data.grade = this.grade
           ts.api = zmlConfig.apiDKHS
           zmlConfig.cl(ts);
           this.loadStatus = true
           zmlFetch(ts, this.showData);
        },
        showData(response) {
            this.loadStatus = false
            if (response.error && response.error.length > 5) {
                if (response.error.substr(0,7) == 'no rows') {
                   this.showNoInfoDialog = true
                } else {
                  infoSnackbar('loading err ' + response.error.substr(0,30))
                  //zml//this.$router.push({ name: 'SelectGrade' , params:{heading:"Grade", gradeno: this.getZml.grade},meta: {layout: "AppLayoutGray" }});
                }
            } else {
                this.contents = response;
                this.contents.forEach(item =>{
                    item.img = ''
                    item.expand = false
                    if (item.type == 'file' && item.description.substr(0,4) == 'load') {
                          item.img = 'https://www.kuiliesonline.co.za/' + item.description.substr(5)
                    }                     
                })
            }
        },
//------------------------------ShowItem and DisplayItem - one in window, one outside
        showItem(curitem) {
          switch (curitem.type) {
            case 'text': 
              this.theItem = curitem
              this.showTextDialog = true
              break
            case 'folder':      
              //this.$cs.l('clicked on folder : ', this.filter)       
              //this.filter = curitem.folder
              this.filter = curitem.name
              break
            case 'link':
              //this.$cs.l('OPENING LINK : ' , curitem.description)
              window.open(curitem.description, "_blank")              
              break
            case 'file':
              this.currentImage = zmlConfig.localPath + curitem.description.substr(5)
              //this.$cs.l('item to view : ' , this.currentImage)
              this.showViewerDialog = true
               break
            default:
              alert('what?')
          }
        },
        displayItem(curitem) {
          //this.$cs.l('Display Item ' , curitem)
          switch (curitem.type) {
            case 'text': 
                this.theItem = curitem
                this.showTextDialog = true
                break
            case 'folder'    :
              //infoSnackbar('View all content inside a folder' + curitem.folder)  
              this.filter = curitem.folder
              break
            case 'link': 
              //this.$cs.l('OPENING LINK : ' , curitem.description)
              window.open(curitem.description, "_blank")
              break
            case 'file':
              window.open("https://www.kuiliesonline.co.za/" + curitem.description.substr(5)
                        , "_blank")
              break
            default:
              errorSnackbar('We do not understand:', curitem.type)  
          }
        }
    },
    filters: {
       icn : function (days) {
         //show color based on amount of days
         if (days < 8)  return "deep-purple accent-"+days
         return "green"
       },
    },
    computed: {
        filterShow() {
            switch (this.filter){
               case '': return "Showing all"
               case '*': return "Showing Folders"
               default:  return "Folder :" + this.filter;
            } 
        },
        filterByContent() {
            //this.$cs.l('FilterByContent : ' , this.filter, this.search)
            if (this.search.length < 3 ) {
              if (this.filter == '')   {
                return this.contents 
              }
              if (this.filter == '*')  {
                return this.contents.filter(a => 
                  a.type == 'folder' && a.name == a.folder
                  )
              }
              if (this.filter == 'T')  {
                return this.contents.filter(a => a.type == 'text')
              }
              if (this.filter.length > 1)  {
                  //this.$cs.l('start with ', this.filter)
                  let arr = []
                  this.contents.forEach((a, index) => {
                    //this.$cs.l(a.folder, '==', this.filter, '&&', a.type, '!= folder', index)
                    if (a.folder == this.filter ) {
                       if (a.name != this.filter ) arr.push(this.contents[index])
                    } else {
                       //skip
                    }
                  })
                  //this.$cs.l('we have :', arr.length, ' for ', this.filter)
                  return arr;
              }
            } else {
                let result = []
                this.contents.forEach(ele => {
                    const str = JSON.stringify(ele).toLowerCase()
                    if ( str.includes(this.search.toLowerCase()) ) {
                      result.push(ele)
                    }
                })
                return result
            }
            return this.contents[0] 
        },
    },
    mounted: function () {
      //this.$cs.l('Start...........................',this.$options.name,this.getZml.login.type)
      
      this.getZml.subjectid  = this.currentSubjectID
      this.getZml.grade = this.grade
      infoSnackbar('Coming in with ', this.currentSubjectID, this.grade)
      if (this.getZml.login.type == 'student' || this.getZml.login.type == 'guest') {
          this.allowEdit = false
      } else {
          this.allowEdit = true
      }
      if (this.getZml.subjects.length > 2) {
        this.loadData()
      } else {
         this.loadStatus = true
         let ts = {}
         ts.api = zmlConfig.apiDKHS
         ts.task = 'getlsubjects'         
         zmlFetch(ts, this.loadSubjects, this.loadError)
      }
    }
  }
</script>  
<style scoped>
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}
</style>