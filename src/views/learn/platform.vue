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
            <v-btn small @click="loadData()" :loading="loadStatus"> Refresh </v-btn>
         </v-flex>            
         <v-flex>
            <v-text-field small label="Search" v-model="search" :loading="loadSearchStatus" />
         </v-flex>


         <v-flex  class="pt-3"> 
            <v-btn small 
                   @click = "loadStatus = !loadStatus" > 
                 Load Status Displa
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
         <v-card-title>   
          <template v-if="item.type=='link'">
            <v-icon> mdi-link </v-icon>{{ item.name }} 
          </template>
          <template v-else>
              <v-icon :color="col(item.type)"> {{item.icon}} </v-icon>{{ item.name }} 
          </template>  
          <p class="caption"> {{ item.folder }}</p>
         </v-card-title>
         <v-card-text>
           <v-card v-if="['link','file'].includes(item.type)" color="deep-purple lighten-5" align="center">
             <!--v-img responsive contain src="img/CleanDKHS.png" max-height="50" max-width="50" /-->
           </v-card>
           <v-card v-else class="wordbreak subtitle-2 pa-2" color="purple lighten-4">  
               {{ item.description }}
            </v-card>
         </v-card-text>
         <v-card-actions>
             <v-btn small @click=displayItem(item)> Open- <v-icon small> {{item.type}} </v-icon> 
             </v-btn>
             <v-btn v-if="allowEdit==true && item.type=='text'"
                    @click="editItem"> 
               <v-icon>mdi-table-edit</v-icon> edit
            </v-btn>
            <v-spacer/>

            <v-hover v-slot:default="{ hover }">
              <v-card class="text-md-caption font-weight-light text-justify pa-2"
                      :elevation="hover ? 12 : 2"
                       :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}">
                {{ item.days }} day ago
              <div v-if="hover">
                       {{ item.create_timestamp.substr(2,8) }}c 
                  <br> {{ item.update_timestamp.substr(2,8) }}u
              </div>
            </v-card>
            </v-hover>
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
//import AutoList from '@/components/learn/AutoList';
//import PlatformItem from "@/components/learn/PlatformItem"
export default {
    name: "Platform",
    //components: {AutoList},
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
        search:'s',
        loadStatus: false,
        loadSearchStatus: false,
    }),
    activated: function () {
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

        }
    },
    methods:{
        dateDiff(dategiven){
          let ymd = dategiven.split('-');
          let o = new Date(ymd[0], ymd[1]-1, ymd[2]);
          let c = new Date();
          alert(o-c)

        },
        searchExt(filetype){
            infoSnackbar('search for files on filtype ' + filetype)
        },
        editItem() {
            infoSnackbar('Editing from here - not available yet.')
        },
        col(type) {
            switch (type) {
                case 'folder': return "purple"
                case 'link': return "green"
                case 'text': return "red"
                case 'file': return "primary"
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