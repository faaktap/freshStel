<template>
<v-container fluid>

<base-title-expand heading="All the photos in the system is displayed here.">
You can soon search by student or by photoname
</base-title-expand>

   <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
      <base-search @clear="search=''" v-model="search" />
      <!-- <v-text-field
        v-model="room"
        label="Location"
        outlined
        dense
        class="ma-2"
        append-icon="mdi-close"
        @click:append="room = ''" />
      <v-text-field
        v-model="period"
        label="Period"
        outlined
        dense
        class="ma-2"
        append-icon="mdi-close"
        @click:append="period = ''" /> -->
      <v-switch class="ma-2" v-model="showAwards" label="Awards" />
      <v-switch class="ma-2" v-model="showStudents" label="Students" />"
      <v-switch class="ma-2" v-model="showSkool" label="Skool" />
      <v-switch class="ma-2" v-model="showPers" label="Staff" />
      <v-switch class="ma-2" v-model="showPrefek" label="RVL" />
      <v-switch class="ma-2" v-model="showSoccer" label="Soccer" />
    </v-card>
    <v-row>
      <v-col xs12 md6>
        <v-btn @click="showAs='list'" :loading="loading">
          <v-icon> mdi-view-list </v-icon>
        </v-btn>
        <v-btn @click="showAs='card'">
          <v-icon> mdi-card </v-icon>
        </v-btn>
      </v-col>
    </v-row>



 <v-container>
    <v-row v-show="showAs == 'card'" class="text-center">
        <v-card cols="12" md="6"
          class="row wrap text-center d-flex justify-space-around ma-0 mb-2"
          v-for="item in filterPhotos"
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
              <br> {{item.grade}}{{item.gclass}}, {{item.type}} - {{ item.studentno}}
              <br>{{ item.photo }}

            </v-card-text>

           </v-card>
        </v-card>
    </v-row>


    <v-row v-show="showAs == 'list'" class="text-center">
    <v-col cols="12">
      <v-data-table
            :headers="photoListHeader"
            :items="filterPhotos"
            :items-per-page="500"
            class="elevation-2"

            :loading="loading"
            @click:row="clickOnRow"
          />
      </v-col>
    </v-row>
  </v-container>

<!-- Show a lookuplist of studentinfo -->
<v-btn @click="showResult = !showResult">
    Show Data for Export
</v-btn>

<!-- {{ filterPhotos }} -->

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


</v-container>
</template>

<script>
import BaseTitleExpand from '../components/base/BaseTitleExpand.vue'
import StudentLookup from '../components/student/StudentLookup.vue'
import { zData } from "@/api/zGetBackgroundData.js"
import BaseSearch from '@/components/base/BaseSearch';
export default {
    name:"AllPhotos",
    components:{
          BaseTitleExpand
        , StudentLookup
        , BaseSearch},
    props:['myPropNameHere'],
    data: () => ({
       search:'',
       loading:false,
       zData:zData,
       showResult:false,
       showLookup:false,
       searchMore:true,
       photoList:[],
       photoListHeader:[
          { text: "ID", align: "start", value: "uniqno" },
          { text: "Type", align: "center", value: "type" },
          { text: "Path", align: "center", value: "photo" },
          { text: "LinkNo", align: "center", value: "studentno" },
          { text: "G", align: "center", value: "grade" },
       ],
       studentid:null,
       sqlStatement : "SELECT p.uniqno, p.type, p.photo, p.studentno, s.surname, s.firstname, s.grade"
                    + " , s.gclass"
                    + " FROM dkhs_photo p"
                    + " LEFT JOIN dkhs_student s ON p.studentno=s.studentid",
       api:"https://kuiliesonline.co.za/api/candid/candidates.php",

       showAwards:false,
       showStudents:false,
       showSkool:false,
       showPers:true,
       showPrefek:false,
       showSoccer:false,
       showAs:'list'

    }),
    computed: {
       filterPhotos() {
          let workTable = []
          if (!this.showAwards && !this.showSkool &&
              !this.showStudents && !this.showPers &&
              !this.showPrefek && !this.search &&
              !this.showSoccer && !this.search) {
             return workTable
          }
          workTable = this.photoList.filter(e =>
            (!this.showAwards || e.type == 'trophy')   &&
            (!this.showStudents || e.type == '1')  &&
            (!this.showSkool || e.type == 'skool') &&
            (!this.showPers || e.type == 'pers') &&
            (!this.showSoccer || e.type == 'soccer') &&
            (!this.showPrefek || (e.type == 'terreinprefek' || e.type == 'rvl' )) &&
            (!this.search || JSON.stringify(e).toLowerCase().indexOf(this.search) > -1)
          )
          return workTable

       }
    },
    methods:{
      executeSql() {
        this.loading = true
        zData.loadSql(this.loading, this.sqlStatement, this.assignData, this.api)
      },
      assignData(response) {
         if (this.photoList.length == 0) {
            this.photoList = response
         } else {
            if (this.photoList.length == response.length) {
                this.photoList = response
            }
         }
         this.photoList.forEach(e => {
            if (e.photo.substr(0,14) == '/home/kuilieso') {
              // /home/
              // 012345
              e.photo =  e.photo.substr(14,400)
            } else if (e.photo.substr(0,1) != '/') {
              console.log(e.photo)
              e.photo =  '/bib/assets/staff/' + e.photo
            }
         });
         this.loading = false
      },
      clickOnRow(e) {
         console.log(e)
         this.showLookup = true
         alert('show form')
         ///this.photolinkid = e.photolinkid
         //console.log('we are working with ', this.photolinkid)
      },
      studentFound(value) {
         this.showLookup = false
         this.studentid = null
         if (value.data == 'undefined') return;
         this.studentid = value.data.studentid
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
      this.executeSql()
    }
}

</script>