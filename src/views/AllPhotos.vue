<template>
<v-container fluid>

<base-title-expand heading="All the photos in the system is displayed here.">
These are not only student photos, but also photos we use elsewhere.
However, I give the option to link a photo to a student, and then the system will
use that photo as if it is that student.
Same with personel, if it is a personel/staff photo, i will treat it as such.
</base-title-expand>

<!-- -------------------------S E A R C H , S W I T C H & D I S P L A Y-------------- -->
   <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
     <!--- SEARCH -->
    <base-search @clear="search=''" v-model="search" />
    <!--- DISPLAY -->
    <v-btn class="mt-3"
            @click="showAs='list'"
            title="Show data in a list"
            :loading="loading"
    >
     <v-icon> mdi-view-list </v-icon>
    </v-btn>
    <v-btn @click="showAs='card'"
           title="Show data in a list"
           class="mt-3"
           :loading="loading"
    >
      <v-icon> mdi-card </v-icon>
    </v-btn>
   </v-card>
   <!--- SWITCH -->
   <v-card v-if="cats && cats.length"
            class="row wrap text-center d-flex justify-space-between ml-0 mt-1 mb-2 pl-1 pr-1">
         <v-card v-for="cat in cats"
                :key="cat.text"
                 class="mb-2">
           <v-switch v-model="cat.selected"
                     hide-details
                     ripple
                     class="mt-1 mr-2 mb-2 ml-2"
                    :label="cat.text" >
           </v-switch>
         </v-card>
   </v-card>



<!-- -------------------------S H O W AS C A R D  ------------------ -->
 <v-container>
    <v-row v-show="showAs == 'card'" class="text-center">
        <v-card cols="12" md="6"
          class="row wrap text-center d-flex justify-space-around ma-0 mb-2"
          v-for="item in filterPhotos"
          :key="item.uniqno"
          color="grey lighten-2"
          flat
        >

        <v-hover v-slot:default="{ hover }">
          <v-card class="pa-1 ma-1"
                  outlined tile
                  :elevation="hover ? 12 : 2"
                  :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"

          >
            <v-card-text>
                <v-img :src="'https://kuiliesonline.co.za/' + item.photo"
                       max-height="100"
                       max-width="100"
                       lazy-src="img/lazyload.png"
                       :title="'S:' + item.studentno + ' U:' + item.uniqno + ' ' + item.photo"
                       class="float-left"
                       contain rounded />
                       <v-card style="word-wrap:break-word" class="float-right" width="150" elevation="0">
              {{item.surname}}, {{item.firstname}}
               {{item.grade}} {{item.gclass}}, {{item.type}} - {{ item.studentno}}
               <!-- get filename, and take extension out -->
              {{ item.photo.split('/').pop().split('.').slice(-2).shift()}}
                       </v-card>

            </v-card-text>
           </v-card>
        </v-hover>

        </v-card>
    </v-row>

<!-- -------------------------S H O W AS L I S T ------------------ -->
    <v-row v-show="showAs == 'list'" class="text-center">
    <v-col cols="12">
      <v-data-table
            :headers="photoListHeader"
            :items="filterPhotos"
            :search="search"
            :items-per-page="500"
            class="elevation-2"
            :loading="loading"
            @click:row="clickOnRow"
          />
      </v-col>
    </v-row>
  </v-container>

<!-- Show a lookuplist of studentinfo -->
<v-btn class="ma-2" @click="showResult = !showResult">
    Export
</v-btn>

<v-btn class="ma-2" @click="showAddPhoto = true"> Add new Photo? </v-btn>
<!-- {{ filterPhotos }} -->


<!-- --------------------- E D I T -------------------- -->
<v-dialog v-model="showEdit"
          transition="dialog-bottom-transition"
          retain-focus
          style="overflow-y-hidden">
  <v-card color="white">
    <v-card-title class="text-h5 grey lighten-2">
      Edit Photo information
    </v-card-title>
    <v-card-text>
       <v-flex xs12>
         <v-radio-group v-model="editRecord.type"
                        label="Category"
                        dense
                        row>
           <v-radio v-for="c in cats" :key="c.text"  :label="c.text"   :value="c.text"  >
           </v-radio>
         </v-radio-group>
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field v-model="editRecord.studentno" label="LinkNumber" />
        </v-flex>
    </v-card-text>
    <v-card-actions>
        <v-btn @click="showEdit = !showEdit">close</v-btn>
        <v-btn @click="showEdit = !showEdit">save</v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>


<v-dialog v-model="showAddPhoto" scrollable xpersistent color="light-grey">
   <v-card class="ma-4">
     <v-card-title>
       Select a picture or photo
     </v-card-title>
     <v-card-text>
       <v-flex xs12>
         <v-radio-group v-model="fileUploadCategory"
                        label="Category"
                        dense
                        row>
           <v-radio v-for="c in cats" :key="c.text"  :label="c.text"   :value="c.text"  >
           </v-radio>
         </v-radio-group>
        </v-flex>
                    <upload-resized-image
                        @file-saved="uploadedFilename"
                        extraPath="/home/kuilieso/public_html/bib/assets/upload"
                    />
     </v-card-text>
   <v-card-actions>
     <v-btn @click="showAddPhoto = false"> Close </v-btn>
   </v-card-actions>
   </v-card>
</v-dialog>

</v-container>
</template>

<script>
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'

import { zData } from "@/api/zGetBackgroundData.js"
import BaseSearch from '@/components/base/BaseSearch';
import UploadResizedImage from "@/components/UploadResizedImage.vue"
import { pFetch } from '../api/zmlFetch';
export default {
    name:"AllPhotos",
    components:{
          BaseTitleExpand
        , BaseSearch
        , UploadResizedImage
    },
    props:['myPropNameHere'],
    data: () => ({
       search:'',
       loading:false,
       zData:zData,
       showResult:false,
       showEdit:false,
       editRecord:{},
       searchMore:true,
       photoList:[],
       photoListHeader:[
          { text: "ID", align: "start", value: "uniqno" },
          { text: "Type", align: "center", value: "type" },
          { text: "Path", align: "left", value: "photo" },
          { text: "LinkNo", align: "center", value: "studentno" },
          { text: "G", align: "center", value: "grade" },
       ],
       studentid:null,
       sqlStatement : "SELECT p.uniqno, p.type, p.photo, p.studentno, s.surname, s.firstname, s.grade"
                    + " , s.gclass"
                    + " FROM dkhs_photo p"
                    + " LEFT JOIN dkhs_student s ON p.studentno=s.studentid",
       api:"https://kuiliesonline.co.za/api/candid/candidates.php",
       showAs:'list',
       cats:[],
       showAddPhoto:false,
       fileUploadCategory:''

    }),
    computed: {
      filterPhotos() {
        //If the table is empty - return blank
        if (!this.photoList.length) {
          return []
        }
        //If we have any switches on, add them to onlyThese
        let onlyThese = this.cats.filter(ele => ele.selected == true)
        if (onlyThese.length == 0) {
          return []
        }
        return this.photoList.filter(ele => onlyThese.some(e => e.text == ele.type) )
      },
    },
    methods:{
      test(e1,e2) {
        // This is an example of how we can test if we are online..
        this.$cs.l(e1,e2)
        let task = {}
        pFetch(task)
        .then(response => {
        this.$cs.l(response)
        })
        .catch(err => {
            this.$cs.l(err)
            if (err == "TypeError: Failed to fetch") alert('kuilies is away')
        })
      },
      uploadedFilename(file) {
        this.$cs.l(file)
      // Information we get back..
      // fileName: "/home/zmlreken/test/DSC_7753.ewhR.jpg"
      // filePath: "/home/zmlreken/test/DSC_7753.ewhR.jpg"
      // filename: "DSC_7753.ewhR.jpg"
      // result: "ok"
      // size: 212875

      /* {result: 'ok', size: 90625
         , filename: 'ford1.n4YT.jpg'
         , filePath: '/home/kuilieso/public_html/bib/assets/upload/ford1.n4YT.jpg'
         , fileName: '/home/kuilieso/public_html/bib/assets/upload/ford1.n4YT.jpg'
      */
      // Update dkhs_photo with new name...
      // this.newFileName = file.filename
      // ....
      alert('update/add it')
      this.showAddPhoto = false
      let task = {}
      pFetch(task)
      .then(function (response) { this.$cs.l(response)})
      },
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
         let tmpArr = []
         this.photoList.forEach(e => {
            if (e.photo.substr(0,14) == '/home/kuilieso') {
              // /home/
              // 012345
              e.photo =  e.photo.substr(14,400)
            } else if (e.photo.substr(0,1) != '/') {
              e.photo =  '/bib/assets/staff/' + e.photo
            }
            tmpArr.push(e.type)
         });
         let tmpArr2 = [...new Set(tmpArr)]
         tmpArr2.forEach(e => { this.cats.push({text:e, selected:false})})
         tmpArr.length = 0
         tmpArr2.length = 0
         this.$cs.l(this.cats)
         this.cats[ Math.floor(Math.random() * (this.cats.length-1))].selected = true
         this.loading = false
      },
      clickOnRow(e) {
         this.$cs.l(e)
         this.editRecord = e
         this.showEdit = true
      },
      save() {
        this.$cs.l('we need to save', this.editRecord)
      },
      updatePhoto() {
        this.$cs.l('here we update it')
         //let sql = 'update dkhs_photolink set studentid = ' + studentid + ' where photolinkid = ' + linkid
         //zData.loadSql(this.loading, sql, this.updateDone, this.api)
      },
    },
    mounted() {
      this.$cs.l('Start ', this.$options.name)
      this.executeSql()
    }
}

</script>