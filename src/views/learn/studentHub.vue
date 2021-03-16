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
    <v-col xs-12 lg-6 >
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
      <v-btn small dense v-if="filter.length > 2" class="pa-2" @click="filter='*'"> Back to folders (<v-icon small >F</v-icon>)  </v-btn>
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
    props: {  },
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
          this.loadStatus = false
          this.getZml.subjects = response
          this.loadData()
        },
        loadData() {
           if (this.getZml.subjectid > 0 || this.getZml.grade > 0) {
              zmlLog(this.getZml.login.username , "Platform", this.getZml.grade + ' ' + this.getZml.subjectid)
           } else {
              infoSnackbar('Grade or Subject is blank - Assume 8, 2')
              this.getZml.grade = 8
              this.getZml.subjectid = 2
           }
           let ts = {};
           this.contents = []
           /*
           ts.sql = 'SELECT *, DATEDIFF(now(), update_timestamp) days '
                  + 'FROM dkhs_lcontent WHERE grade = ' + this.getZml.grade
                  + ' and subjectid = ' + this.getZml.subjectid
                  + ' and sortorder != 0'
                  + ' order by sortorder, name';
           ts.task = 'PlainSql';
           */
           ts.task = 'getlcontent'
           ts.data = {}
           ts.data.subjectid = this.getZml.subjectid
           ts.data.grade = this.getZml.grade
           ts.data.login = this.getZml.login
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
                  infoSnackbar('loading err ' + response.error.substr(0,10))
                  this.$router.push({ name: 'SelectGrade' , params:{heading:"Grade", gradeno: this.getZml.grade},meta: {layout: "AppLayoutGray" }});
                }
            } else {
                this.contents = response;
                this.contents.forEach(item =>{
                    item.img = ''
                    item.expand = false
                    if (item.type == 'file' && item.description.substr(0,4) == 'load') {
                       // let ext = item.description.substr(5).split('.').pop().toLowerCase()
                       // if ( ['gif','jpeg','png','jpg'].includes(ext)) {
                          item.img = 'https://www.kuiliesonline.co.za/' + item.description.substr(5)
                       // }
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
              console.log('clicked on folder : ', this.filter)       
              //this.filter = curitem.folder
              this.filter = curitem.name
              break
            case 'link':
              console.log('OPENING LINK : ' , curitem.description)
              window.open(curitem.description, "_blank")              
              break
            case 'file':
              this.currentImage = zmlConfig.localPath + curitem.description.substr(5)
              console.log('item to view : ' , this.currentImage)
              this.showViewerDialog = true
               break
            default:
              alert('what?')
          }
        },
        displayItem(curitem) {
          console.log('Display Item ' , curitem)
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
              console.log('OPENING LINK : ' , curitem.description)
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
       extIcon : function (filename) {
         if (!filename ) return "mdi-hospital-building"
         if (filename == 'link' || filename == 'file') return "mdi-hospital-building"
         filename = filename.toString()
         const i= [
               {ext:'html' ,icon: 'mdi-language-html5'},
               {ext:'htm'  ,icon: 'mdi-language-html5'},
               {ext:'js:'   ,icon: 'mdi-nodejs'},
               {ext:'json' ,icon: 'mdi-code-json'},
               {ext:'md'   ,icon: 'mdi-language-markdown'},
               {ext:'pdf'  ,icon: 'mdi-file-pdf'},
               {ext:'txt'  ,icon: 'mdi-file-document'},
               {ext:'xls'  ,icon: 'mdi-file-excel'},
               {ext:'xlsx' ,icon: 'mdi-file-excel'},
               {ext:'doc'  ,icon: 'mdi-file-document'},
               {ext:'docx' ,icon: 'mdi-file-document'},
               {ext:'mp4'  ,icon: 'mdi-movie'},
               {ext:'mpeg' ,icon: 'mdi-movie'},
               {ext:'mpg'  ,icon: 'mdi-movie'},
               {ext:'jpg'  ,icon: 'mdi-image'},
               {ext:'jpeg' ,icon: 'mdi-file-image'},
               {ext:'png'  ,icon: 'mdi-file-image'},
               {ext:'ppt'  ,icon: 'mdi-file-powerpoint'},
               {ext:'pptx' ,icon: 'mdi-file-powerpoint'},
               {ext:'zip'  ,icon: 'mdi-folder-zip'},
               {ext:'mp3'  ,icon: 'mdi-music-note'},
               {ext:'m4a'  ,icon: 'mdi-file-music'},
               {ext:'sql'  ,icon: 'mdi-database'},
               ]
         const ext = filename.substr(5).split('.').pop().toLowerCase()
         const index = i.findIndex(p => p.ext == ext)
         if (index >= 0 ) {
           return i[index].icon
         } else {
           return "mdi-hospital-building"
         }
       },
       extColor : function (filename) {
         if (!filename ) return "mdi-hospital-building"
         if (filename == 'link' || filename == 'file') return "mdi-hospital-building"
         filename = filename.toString()
         const i= [
               {ext:'html' ,icon: 'mdi-language-html5',    color:'blue'},
               {ext:'htm'  ,icon: 'mdi-language-html5',    color:'blue'},
               {ext:'js:'   ,icon: 'mdi-nodejs',           color:'blue'},
               {ext:'json' ,icon: 'mdi-code-json',         color:'blue'},
               {ext:'md'   ,icon: 'mdi-language-markdown', color:'blue'},
               {ext:'pdf'  ,icon: 'mdi-file-pdf',          color:'red'},
               {ext:'txt'  ,icon: 'mdi-file-document',     color:'blue'},
               {ext:'xls'  ,icon: 'mdi-file-excel',        color:'green'},
               {ext:'xlsx' ,icon: 'mdi-file-excel',        color:'green'},
               {ext:'doc'  ,icon: 'mdi-file-document',     color:'blue'},
               {ext:'docx' ,icon: 'mdi-file-document',     color:'blue'},
               {ext:'mp4'  ,icon: 'mdi-movie',             color:'indigo lighten-1'},
               {ext:'mpeg' ,icon: 'mdi-movie',             color:'indigo lighten-1'},
               {ext:'mpg'  ,icon: 'mdi-movie',             color:'indigo lighten-1'},
               {ext:'jpg'  ,icon: 'mdi-image',             color:'purple'},
               {ext:'jpeg' ,icon: 'mdi-file-image',        color:'green'},
               {ext:'png'  ,icon: 'mdi-file-image',        color:'purple'},
               {ext:'ppt'  ,icon: 'mdi-file-powerpoint',   color:'black'},
               {ext:'pptx' ,icon: 'mdi-file-powerpoint',   color:'black'},
               {ext:'zip'  ,icon: 'mdi-folder-zip',        color:'brown'},
               {ext:'mp3'  ,icon: 'mdi-music-note',        color:'orange'},
               {ext:'m4a'  ,icon: 'mdi-file-music',        color:'indigo darken-1'},
               {ext:'sql'  ,icon: 'mdi-database',          color:'green darken-3'},
               ]
         const ext = filename.substr(5).split('.').pop().toLowerCase()
         const index = i.findIndex(p => p.ext == ext)
         if (index > 0 ) {
           return i[index].color
         } else {
           return "pink"
         }
       }
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
            console.log('loading NEW DATA : ' , this.filter, this.search)
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
                  console.log('start with ', this.filter)
                  let arr = []
                  this.contents.forEach((a, index) => {
                    console.log(a.folder, '==', this.filter, '&&', a.type, '!= folder', index)
                    if (a.folder == this.filter ) {
                       if (a.name != this.filter ) arr.push(this.contents[index])
                    } else {
                       //skip
                    }
                  })
                  console.log('we have :', arr.length, ' for ', this.filter)
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
      console.log('We are in MOUNTPLAT',this.getZml.login.type)
      if (this.getZml.login.type == 'student') {
          this.allowEdit = false
      } else {
          this.allowEdit = true
      }
      if (this.getZml.subjects.length > 2) {
        this.loadData()
      } else {
         this.loadStatus = true
         zmlFetch({task: 'getsubjects'}, this.loadSubjects, this.loadError)
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