<template>
<v-container fluid>
 <base-tool :toolList="[]"
            toolbarName="Incoming Photos Linking System"
           :loading="loading">
            <v-btn icon @click="showResult = !showResult">
            E
           </v-btn>
           <base-button-dialog class="ma-2"
                       iconName="mdi-information"
                       buttonText=""
                       color="grey"
                       :infoText="`Anyone with this link can link a student to a photo.\
                       Just click on the photo or assign button, and you can select a student from the list.`"
                       infoTitle="Help"
           />
 </base-tool>

 <base-tool
            toolbarName="Options"
           :background="false"
            back="false"
            >

   <v-btn-toggle  color="secondary" dense group v-model="showAs" mandatory>
     <v-btn value="card"><v-icon> mdi-card </v-icon></v-btn>
     <v-btn value="table"><v-icon> mdi-image </v-icon></v-btn>
   </v-btn-toggle>
   <v-btn small @click="show='all'" class="ma-2" title="show the linked ones as well"> All </v-btn>
   <v-btn small @click="show='notlinked'" class="ma-2" title="Only show ones not linked yet"> Not Linked </v-btn>

 </base-tool>

 <v-data-table
    v-if="showAs == 'table'"
    :headers="photoListHeader"
    :items="photoListFilter"
    :items-per-page="50"
    class="elevation-2"
    @click:row="clickOnRow">
    <template v-slot:[`item.filepath`]="{ item }">
        <v-img :src="'https://kuiliesonline.co.za/' + item.filepath" height="100" contain/>
    </template>
 </v-data-table>

 <div v-if="showAs == 'card'">
   <v-layout row wrap>
      <v-card v-for="pho in photoListFilter" :key="pho.id" max-width="240">
         <v-card-title>
            {{pho.student || '??'}}
            <v-btn small @click="clickOnRow(pho)"> Assign </v-btn>
         </v-card-title>
         <v-card-text>
            <v-img :src=" 'https://kuiliesonline.co.za/' + pho.filepath" max-width="230" />
         </v-card-text>
      </v-card>
   </v-layout>
 </div>


<v-dialog v-model="showLookup"
          max-width="400"
          transition="dialog-bottom-transition"
          retain-focus
          style="overflow-y-hidden"
          >
          <!-- Show a lookuplist of studentinfo -->
  <v-card color="white">

    <v-card-title class="text-h5 grey lighten-2">

      <v-btn icon @click="showLookup = !showLookup">
        <v-icon> mdi-close</v-icon>
      </v-btn>
      Student Lookup
    </v-card-title>

    <v-card-text>
     <student-lookup class="pa-0 mt-6"
                 @dataEntered="studentFound"
                 :searchMore="searchMore"/>
    </v-card-text>
  </v-card>
</v-dialog>


<!-- Show a list of photolinks for export.. -->
<v-dialog v-model="showResult">
 <v-card color="red" v-if="showResult && csvArray && csvArray !== null">
  <front-json-to-csv :json-data="csvArray"
                     :csv-title="'csvArray title'"
                     @hideModal="showResult = false">
  </front-json-to-csv>
 </v-card>
</v-dialog>

</v-container>
</template>

<script>
import StudentLookup from '../components/student/StudentLookup.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import { zData } from "@/api/zGetBackgroundData.js"
import baseTool from '@/components/base/baseTool.vue'
import baseButtonDialog from '@/components/base/baseButtonDialog.vue'
export default {
    name:"IncomingPhotoLink",
    components:{
        FrontJsonToCsv
      , StudentLookup
      , baseTool
      , baseButtonDialog
    },
    props:{},
    data: () => ({
       loading:false,
       zData:zData,
       showResult:false,
       showLookup:false,
       searchMore:true,
       photoList:[],
       photoListHeader: [
          {text: 'id',             value: 'photolinkid' },
          {text: 'filename',       value: 'filename' },
          //{text: 'load on',        value: 'dataloaded' },
          {text: 'student',        value: 'student' },
          {text: 'filepath',        value: 'filepath' },
       ],
       photolinkid:null,
       studentid:null,
       csvArray:[],
       sqlStatement : "SELECT photolinkid,filepath,filename,p.studentid,linktype,dateloaded,description,userid "
                    + ", concat(s.firstname,' ', s.surname, ' ',s.grade) student"
                    + "  from dkhs_photolink p "
                    + "left join dkhs_student s on s.studentid = p.studentid "
                    + "order by p.studentid desc, filename",
       api:'https://kuiliesonline.co.za/api/dkhs/dkhs.php',
       show:'missing',
       showAs:'card'
    }),
    computed: {
       photoListFilter() {
          if (this.csvArray.error) return []
          if (this.show == 'all')
             return this.csvArray
          else
             return this.csvArray.filter(ele => ele.studentid == null)
       }
    },
    methods:{
      executeSql() {
          zData.loadSql(this.loading, this.sqlStatement, this.assignData, this.api)
      },
      assignData(response) {
         this.csvArray = response
         if (this.photoList.length == 0) {
            this.photoList = response
         } else {
            if (this.photoList.length == response.length) {
                this.photoList = response
            }
         }
      },
      clickOnRow(e) {
         this.$cs.l(e)
         this.showLookup = true
         this.photolinkid = e.photolinkid
         this.$cs.l('we are working with ', this.photolinkid)
      },
      studentFound(value) {
         this.showLookup = false
         this.studentid = null
         if (value.data == 'undefined') return;
         this.studentid = value.data.studentid
         if (value.data.studentid && this.photolinkid) {
            const idx = this.photoList.findIndex(e => e.photolinkid == this.photolinkid)
            if (idx != -1) {
              this.photoList[idx].student = this.studentid + ' ' + value.data.surname+ ' ' + value.data.firstname
              this.updatePhotoLink(this.photolinkid, this.studentid)
              //alert('do an update on ' + this.photolinkid + ' ' + value.data.studentid)
            }
         }
         this.photolinkid = 0
         this.studentid = 0
      },
      updatePhotoLink(linkid, studentid) {
         let sql = 'update dkhs_photolink set studentid = ' + studentid + ' where photolinkid = ' + linkid
         zData.loadSql(this.loading, sql, this.updateDone, this.api)
      },
      updateDone(response) {
        this.$cs.l('update done - ', response)
      }
    },
    mounted() {
      this.$cs.l('Start ', this.$options.name)
      if (this.csvArray.length == 0) {
          this.executeSql()
      }
    }
}

</script>