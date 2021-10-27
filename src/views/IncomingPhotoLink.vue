<template>
<v-container fluid>

<base-title-expand heading="Incoming Student Photo Assignment">
Ask some of the personel and students to help the photographer to identify the person in the photo.
</base-title-expand>

<v-data-table
    :headers="photoListHeader"
    :items="photoList"
    :items-per-page="20"
    class="elevation-2"
    @click:row="clickOnRow">
    <!-- https://kuiliesonline.co.za/ -->
    <template v-slot:[`item.filepath`]="{ item }">
        <v-img :src="'https://kuiliesonline.co.za/' + item.filepath" height="300" contain/>
    </template>
</v-data-table>

<!-- Show a lookuplist of studentinfo -->
<v-btn @click="showResult = !showResult">
    Show Data for Export
</v-btn> 

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
import BaseTitleExpand from '../components/base/BaseTitleExpand.vue'
import StudentLookup from '../components/student/StudentLookup.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import { zData } from "@/api/zGetBackgroundData.js"
export default {
    name:"IncomingPhotoLink",
    components:{BaseTitleExpand, FrontJsonToCsv,StudentLookup},
    props:['myPropNameHere'],
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
    }),
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
         console.log(e)
         this.showLookup = true
         this.photolinkid = e.photolinkid
         console.log('we are working with ', this.photolinkid)
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
        console.log('update done - ', response)
      }
    },
    mounted() {
      console.log('Start ', this.$options.name)
      if (this.csvArray.length == 0) {
          this.executeSql()
      }
    }
}

</script>