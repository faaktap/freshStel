<template>
<v-container fluid>

<base-title-expand heading="Incoming Student Photo Assignment">
Ask some of the personel and students to help the photographer to identify the person in the photo.
</base-title-expand>

 <v-container>
    <v-row class="text-center">
        <v-card cols="12" md="6" 
          class="row wrap text-center d-flex justify-space-around ma-0 mb-2"
          v-for="(item) in photoList"
          :key="item.uniqno"
          color="grey lighten-2"
          flat
          tile>
          <v-card class="pa-1 ma-1" 
                  outlined tile> 
            <v-card-text>
                <v-img :src="'https://kuiliesonline.co.za/' + item.photo"
                       max-height="100"
                       max-width="100"
                       lazy-src="img/lazyload.png"
                       :title="'S:' + item.studentno + ' U:' + item.uniqno + ' ' + item.photo"
                       contain rounded />     
              {{item.surname}},<br> {{item.firstname}}
              <br> {{item.grade}}{{item.gclass}}, {{item.type}} 
              
            </v-card-text>

           </v-card>
        </v-card>
    </v-row>
  </v-container>

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
    name:"AllPhotos",
    components:{
          BaseTitleExpand
        , FrontJsonToCsv
        , StudentLookup},
    props:['myPropNameHere'],
    data: () => ({
       loading:false,
       zData:zData,
       showResult:false,
       showLookup:false,
       searchMore:true,
       photoList:[],
       studentid:null,
       csvArray:[],
       sqlStatement : "SELECT p.uniqno, p.type, p.photo, p.studentno, s.surname, s.firstname, s.grade"
                    + " , s.gclass"
                    + " FROM dkhs_photo p"
                    + " LEFT JOIN dkhs_student s ON p.studentno=s.studentid",
       api:"https://kuiliesonline.co.za/api/candid/candidates.php",
    }),
    computed: {
        
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
         console.log(e)
         this.showLookup = true
         ///this.photolinkid = e.photolinkid
         //console.log('we are working with ', this.photolinkid)
      },
      studentFound(value) {
         this.showLookup = false
         this.studentid = null
         if (value.data == 'undefined') return;
         this.studentid = value.data.studentid
         /*
         if (value.data.studentid) {
         }
         this.studentid = 0
         */
      },
      updatePhoto(linkid, studentid) {
          console.log(linkid, studentid)
         //let sql = 'update dkhs_photolink set studentid = ' + studentid + ' where photolinkid = ' + linkid
         //zData.loadSql(this.loading, sql, this.updateDone, this.api)
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