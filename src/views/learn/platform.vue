 <template>
<div>
<v-sheet color="grey lighten-5" class="ma-2">
  <v-row>
    <v-col xs-12 lg-4>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>

               <v-btn small :to="{ name: 'Material' , params:{heading:'Grade'},meta: {layout: 'AppLayoutGray' }}">
               Back </v-btn>


            Grade {{ getZml.grade }} {{ getZml.subject }} ( {{ filterShow }} ) {{filterByContent.length }}
        </v-toolbar-title>
       
       </v-toolbar>
    </v-col>
    <v-col xs-12 lg-8>
        <v-layout row wrap>
         <v-flex class="pt-3"> 
           <v-btn small @click="filter=''" :loading="loadStatus"> 
                 All Files
           </v-btn>
         </v-flex> 
         <v-flex  class="pt-3"> 
            <v-btn small 
                   @click = "filter='*'" :loading="loadStatus"> 
                 Only Folders
            </v-btn>
         </v-flex>
         <v-flex  class="pt-3"> 
            <v-btn small 
                   @click = "filter='T'" :loading="loadStatus"> 
                 Only Notes
            </v-btn>
         </v-flex>
         <v-flex  class="pt-3">
            <v-btn small @click="loadData()" :loading="loadStatus"> Refresh </v-btn>
         </v-flex>            
         <v-flex>
            <v-text-field small label="Search" v-model="search" :loading="loadSearchStatus" />
         </v-flex>


         <!--@click = "editing = !editing" --> 
         <v-flex  class="pt-3"> 
            <v-btn small 
            >
                 Test
            </v-btn>
         </v-flex>


        </v-layout>
        <!--/v-window-->
    </v-col>
    </v-row>

<!-- LIST OUR CONTENT -->    
    <v-container fluid>
       <v-layout row wrap>
        <v-flex 
         v-for="item in filterByContent" :key="item.itemid"
         flex-row
         justify-space-around
         xs-12
         >
         
         
     <v-row justify="center" class="fill-height" xalign="stretch">
        <v-col>
         <v-hover v-slot:default="{ hover }">
         <v-card  min-width="100" 
                  min-height="150"
                  :elevation="hover ? 12 : 2"
                  :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
            class= "ma-2"
            color="deep-purple lighten-5"                  
         >
{{ item }}
<!--ICON HANDLING FOR TITLE DISPLAY-->
    <v-card-title>   
      <v-btn v-if="allowEdit==true" icon @click="editItem(item)">
        <template v-if="item.type=='link'" class="display-1">
          <v-icon color="amber lighten-2"> mdi-link </v-icon>
        </template>
        <template v-if="item.type=='file'" class="display-1">
           <v-icon :color="item.description|extColor" > {{ item.description | extIcon }} </v-icon> 
        </template>
        <template v-if="item.type=='folder'" class="display-1">
          <v-icon :color="col(item.type)"> {{item.icon}} </v-icon>
        </template>
        <template v-if="item.type=='text'" class="display-1">
          <v-icon :color="col(item.type)"> {{item.icon}} </v-icon>
        </template>
      </v-btn> 
<!---TITLE DISPLAY -->
          <div v-if="!item.editing">    {{ item.name }}    
          <div class="caption">      {{ item.folder }}   </div>
          </div>

          <div v-if="item.editing" class="px-4 pb-3 pt-3 text-subtitle-2">
              <v-text-field v-model="item.name" label="item name" />
              <v-text-field v-model="item.folder" label="folder name" />
          </div>             
    </v-card-title>


         <v-card-text>
           <v-card v-if="['link','file'].includes(item.type)" color="deep-purple lighten-5" align="center">
               This is a link or a file, what shall we put here?
           </v-card>
            <v-card v-else class="wordbreak subtitle-2 pa-2" color="purple lighten-4">  
             <div v-if="!item.editing">
               {{ item.description }}
             </div>  
            <div v-if="item.editing">
              <!--v-window>
              <v-card class="ma-2 pa-2"><v-card-title> EDIT </v-card-title>
              <v-card-text-->
               <v-textarea dense outlined v-model="item.description" label="description/name" />
               <v-text-field dense outlined v-model="item.sortorder" label="sortorder" />
               <!--v-btn @click="item.editing = !item.editing"> Cancel </v-btn>
               <v-btn @click="item.editing = !item.editing"> Save </v-btn-->
               <!--/v-card-text>
              </v-card>
              </v-window-->
             </div>           
           </v-card>
            <!-- {{ item }} -->
         </v-card-text>
         <v-card-actions>
             <v-btn small @click=displayItem(item)> Open- <v-icon small> {{item.type}} </v-icon> 
             </v-btn>
            <v-spacer/>
            <v-btn v-if="item.changed && item.changed==true"
                    @click="saveItem(item)"
                    title="Important to save your changes here!"
                    color="primary"
                    small>  save </v-btn>
             <v-btn v-if="allowEdit==true && item.type=='text'"
                    @click="editItem(item)"
                    color="primary"
                    :loading="hoekomvatdotsolank"
                    small> 
               <v-icon x-small>mdi-pen</v-icon></v-btn>

              <v-tooltip right bottom open-on-click open-on-hover> 
               <template v-slot:activator="{ on }">
                <v-card class="text-md-caption font-weight-light text-justify pa-1"  v-on="on">
                {{ item.days }} day(s) ago
                </v-card>
               </template>
               <span >          
                       cr.{{ item.create_timestamp }} 
                  <br> up.{{ item.update_timestamp }}
              </span>
              </v-tooltip>
         </v-card-actions>
         </v-card>
         </v-hover>
        </v-col>
     </v-row>
        </v-flex>
       </v-layout>
    </v-container>
</v-sheet>


<v-dialog v-model="showTextDialog">
    <v-card>
        <v-card-title> {{ theItem.name }} </v-card-title>
        <v-card-text> {{ theItem.description }} </v-card-text>
        <v-card-actions> <v-btn @click="showTextDialog = !showTextDialog"> close </v-btn></v-card-actions>
    </v-card>
</v-dialog>


<v-dialog v-model="showNoInfoDialog">
    <v-card>
        <v-card-title> We did not find any Information! </v-card-title>
        <v-card-text> 
            Information for Grade {{ getZml.grade }},  {{ getZml.subject }} is not available at the moment.
         </v-card-text>
        <v-card-actions> 
            <v-btn @click="showNoInfoDialog = !showNoInfoDialog" color="info"> close </v-btn>
            <v-btn color="primary" :to="{ name: 'Material' , params:{heading:'Grade'},meta: {layout: 'AppLayoutGray' }}"> Select another subject </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</div>
</template>

<script>
import { getters } from "@/api/store"
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { infoSnackbar } from '@/api/GlobalActions';
//import contentEdit from '@/components/learn/contentEdit';
//import PlatformItem from "@/components/learn/PlatformItem"
export default {
    name: "Platform",
    components: {},
    props: {  },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        hover:null,
        showTextDialog:false,
        showNoInfoDialog:false,
        theItem:{},
        contents: [{itemid:1, heading:'wertnwer'}
                       ,{itemid:2, heading:'wertnwer'}
                       ,{itemid:3, heading:'sdfftnwer'}
                       ,{itemid:4, heading:'seWWtnwer'}
                       ,{itemid:5, heading:'AS dtnwer'}
                       ],
        filter:'',
        feedme:null,
        embedDialog:false,
        allowEdit: false,
        showEdit: false,
        search:'s',
        loadStatus: false,
        loadSearchStatus: false,
        hoekomvatdotsolank: false,
    }),
    activated: function () {
    },
    filters: {
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
               ]
         const ext = filename.substr(5).split('.').pop().toLowerCase()
         const index = i.findIndex(p => p.ext == ext)
         if (index > 0 ) {
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
                return this.contents.filter(a => a.type == 'folder')
              }
              if (this.filter == 'T')  {
                return this.contents.filter(a => a.type == 'text')
              }
              if (this.filter.length > 1)  {
                  return this.contents.filter(a => a.folder == this.filter && a.type != 'folder')
              }
            } else {
                let result = []
                this.contents.forEach(ele => {
                    const str = JSON.stringify(ele).toLowerCase
                    if ( str.includes(this.search.toLowerCase) ) {
                      result.push(ele)
                    }
                })
                return result
            }
            return this.contents[0] 
        },
    },
    methods:{
        zmltest(e) {
          console.log('WE RECEIVEEDEDEDEHDEKUHDIUKEHDKEHDED',e)
          this.showEdit = false
        },
        saveItem(item) {
            this.hoekomvatdotsolank = true;
            alert('it is going to be tricky to save this....');
            console.log(item)
            zmlFetch({task:'dumpit', api:zmlConfig.apiDKHS, item:item} ,this.doneWithIt)
            //after successfuill save...
            item.changed = false
            item.editing = false
            
        },
        doneWithIt(response) {
          this.hoekomvatdotsolank = false;
          console.log(response)
        },
        editItem(item) {
            this.hoekomvatdotsolank = true;
            if (item.editing) {
              //Stop Editing (maybe not saved yet)
              item.editing = false
              item.changed = false
            } else {
              //Start Editing 
              item.editing = true
            }
            item.changed = true
            this.hoekomvatdotsolank = false;
            console.log(item)
        },
        col(type) {
            switch (type) {
                case 'folder': return "purple"
                case 'link': return "green"
                case 'text': return "red"
                case 'file': return "pink darken-2"
            }
            return "pink lighten-1"
        },
        filterChange() {
           if (this.filter == '') {
               this.filter = '*'
           } else {
               this.filter = ''
           }
        },
        subjectChanged(stuff) {
            this.getZml.subjectid = stuff.subjectid
            this.getZml.subject = stuff.subjectafrname
            this.loadData()
        },
        loadSubjects(response) {
          this.loadStatus = false
          this.getZml.subjects = response
          this.loadData()
        },
        loadData() {
           if (this.getZml.subject > 0 || this.getZml.grade > 0) {
              //infoSnackbar('loading ' + this.getZml.grade + ' ' + this.getZml.subject)
           } else {
              infoSnackbar('Grade or Subject is blank - Assume 8, 2')
              this.getZml.grade = 8
              this.getZml.subjectid = 2
           }
           let ts = {};
           this.contents = []
           ts.sql = 'SELECT *, DATEDIFF(now(), update_timestamp) days '
                  + 'FROM dkhs_lcontent WHERE grade = ' + this.getZml.grade
                  + ' and subjectid = ' + this.getZml.subjectid
                  + ' order by sortorder, name';
           ts.task = 'PlainSql';
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
                  this.$router.push({ name: 'Material' , params:{heading:"Grade"},meta: {layout: "AppLayoutGray" }});
                }
            } else {
                this.contents = response;
                this.contents.forEach(item =>{
                     item.img = ''
                     if (item.type == 'file' && item.description.substr(0,4) == 'load') {
                         let ext = item.description.substr(5).split('.').pop().toLowerCase()
                         if ( ['png','jpg'].includes(ext)) {
                           item.img = 'https://www.kuiliesonline.co.za/' + item.description.substr(5)
                         }
                     }

                })
                 
            }
        },
        displayItem(curitem) {
            console.log('clicked on displayItem')
          if (curitem.type == 'text') {
              this.theItem = curitem
              this.showTextDialog = true
          } else if (curitem.type == 'folder') {
              //infoSnackbar('View all content inside a folder' + curitem.folder)  
              this.filter = curitem.folder
         } else if (curitem.type == 'link') {              
              let newHref = curitem.description
              window.open(newHref, "_blank")
          } else {
              /*
              let GR = this.getZml.grade.toString()
              GR = 'GR' + GR.padStart(2, '0')
              const idx = this.getZml.subjects.findIndex(ele => ele.subjectid == curitem.subjectid)
              const subjectpath = this.getZml.subjects[idx].subjectdesc
              let newHref = "https://www.kuiliesonline.co.za"
              newHref += "/Subjects/" + GR
              newHref += "/" + subjectpath
              newHref += "/" + curitem.folder
              newHref += "/" + curitem.name
              */
              let curFile = curitem.description.substr(5)
              let newHref = "https://www.kuiliesonline.co.za/" + curFile
              window.open(newHref, "_blank")
          }
        }
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