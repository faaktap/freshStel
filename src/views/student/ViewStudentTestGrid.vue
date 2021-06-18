<template>
<div ref="myref">
<v-container fluid>
<v-row>
 <v-col cols="12" sm="6">
  <grade-display-short displaySize="medium" />
 </v-col>
 <v-col cols="12" sm="6">
   <subject-display-short />
</v-col>
</v-row>
</v-container>


<v-row>
<v-col>
  <h4>Folder Select </h4>
    <folder-select grade=8 
                   subjectid=10 
                  @selected="selectFolder"> 
    </folder-select>
    selectedFolder : {{ selectFolder }}
</v-col>
</v-row>

<v-expansion-panels>
 <v-expansion-panel>    
  <v-expansion-panel-header>
     <v-btn @click="showFolders = !showFolders"    > Show Folders </v-btn>
  </v-expansion-panel-header>
  <v-expansion-panel-content>
   <h1> Showing Folder List (v-dialog)</h1>
   <v-window v-show="showFolders==true" color="light-blue">
    <front-json-to-csv v-if="folders"
                   :json-data="contentFolders"
                   :csv-title="'My Test csv title'">
     <v-btn>
      Download with custom title
     </v-btn> 
    </front-json-to-csv>
   </v-window>
  </v-expansion-panel-content>
 </v-expansion-panel>
</v-expansion-panels>

<v-row>
 <v-col cols="12">
 <h1> Display Student Content </h1>
 <v-card class="ma-3 pa-4">
  <div class="student-container">
   <div class="Photo">
      <v-img :src="st.photo" cover></v-img>
  </div>
  <div class="Surname">
      <h2> {{ st.surname }} </h2>
  </div>
  <div class="Name">
      <h3> {{ st.firstname }} </h3>
  </div>
  <div class="Grade">
      <h3>G{{ st.grade }}</h3>
  </div>
  <div class="Class">
      <h3>{{ st.class }}</h3>
  </div>
  <div class="Studentid">
      <h4>{{ st.studentid }}</h4>
  </div>
  <div class="EMails text-left">
      <h5> EMails </h5>
      <div v-for="(e,i) in st.emails" :key="i" class="pl-7">
          {{i+1}} {{ e }}<br><v-divider />
      </div>
  </div>
  <div class="TeacherName pa-1">
      <p>Register Class : <strong>{{ st.teacher }}</strong>  Room: 117</p>
  </div>
  <div class="Lastline text-center">
      {{ st.note }}
  </div>
 </div>
 <v-btn @click="showRefs"> showRefs </v-btn>
</v-card>
 </v-col>
</v-row>

</div>
</template>


<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import FolderSelect from '@/components/learn/FolderSelect.vue'
import SubjectDisplayShort from '@/components/learn/SubjectDisplayShort.vue'
import GradeDisplayShort from '@/components/learn/GradeDisplayShort.vue'
import { zData } from "@/api/zGetBackgroundData.js"
export default {
name: "ViewStudentTestGrid",
props:{},
components: {FrontJsonToCsv
          , FolderSelect
          , SubjectDisplayShort
          , GradeDisplayShort
          },    
data: () => ({
    getZml: getters.getState({ object: "gZml" }),
    folders:[],
    contentFolders:[],
    showFolders:false,
    showRootFolders:true,
    st:   {studentid:'12345678',
           firstname:'A FirstName',
           surname:'The Surname',
           teacher:'Mr T. Eacherch',
           grade:'9',
           class:'A5',
           emails:['email1@co.com','email2@za.com','email3@co.za'],
           photo:'someplace.jpg',
           note:'Last Import 2021-02-02'
          },
  //getZml: getters.getState({ object:"gZml" }),
}),
methods:{
    selectFolder(f) {
        alert('select folder ' + f)
    },
    showRefs() {
        //this.$cs.l(this.$refs)
        let componentHTML = this.$el.innerHTML
        console.log(componentHTML)
        //this.$cs.l(this.$refs.myref.innerHTML)
    },
    loadContent() {
          zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.afterFolders);
          zmlFetch({task: 'getcontentfolders',api: zmlConfig.apiDKHS}, this.afterContentFolders);
    },
    afterFolders(response) {
          this.folders = response;
    },    
    afterContentFolders(response) {
          this.contentFolders = response;
    },    
},
computed:{
      //Display a list of folders on dropdown
      folderFilter() {
        let tempT = []
        let ignore = false
          this.contentFolders.forEach(item => {
          ignore = false;
          if (item.grade != this.getZml.grade || 
             item.subjectid != this.getZml.subjectid ||
             item.sortorder == 0) {
             ignore = true
          }
          if (this.showRootFolders) {
              if (item.name != item.folder) {
                  ignore = true
              }
          }
          if (!ignore) {
             let newitem = item
             tempT.push(  newitem );
          }
        })
        return tempT
      },
},
mounted: function() {
       zData.initialData('Load Subject Data')
       this.getZml.grade = 8
       this.getZml.subjectid = 10    
       this.loadContent()
}
}

</script>

<style scoped>
.student-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "Photo Photo Surname Surname Surname Surname Surname"
    "Photo Photo Name Name Name Name Name"
    "Photo Photo Grade Class Studentid Studentid Studentid"
    "EMails EMails EMails EMails EMails EMails EMails"
    "EMails EMails EMails EMails EMails EMails EMails"
    "TeacherName TeacherName TeacherName TeacherName TeacherName TeacherName TeacherName"
    "Lastline Lastline Lastline Lastline Lastline Lastline Lastline";
}
.Photo { grid-area: Photo; }
.Surname { grid-area: Surname; }
.Name { grid-area: Name; }
.Grade { grid-area: Grade; }
.Class { grid-area: Class; }
.Studentid { grid-area: Studentid; }
.EMails { grid-area: EMails; }
.TeacherName { grid-area: TeacherName; }
.Lastline { grid-area: Lastline; }
</style>