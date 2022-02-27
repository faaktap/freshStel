<template>
<div>

<v-row>
    <v-col xs-12 lg-12>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>
            De Kuilen High School Personel
        </v-toolbar-title>
        <v-spacer />
        <v-btn small @click="loadPersonelList">
           <v-icon> mdi-refresh </v-icon>
           refresh
        </v-btn>
       </v-toolbar>
    </v-col>
  </v-row>

<v-container v-if="['admin','teacher'].includes(getZml.login.type)" fluid>
  <v-layout>
      <v-col xs12 md6>
       <v-text-field
            label="Search" placeholder="Search on Surname"
            v-model="searchInfo" solo clearable
            @click:clear="searchInfo = ''"
       />

      </v-col>
      <v-col xs12 md6>
        <v-btn @click="showAs='list'">
          <v-icon> mdi-view-list </v-icon>
        </v-btn>
        <v-btn @click="showAs='card'">
          <v-icon> mdi-card </v-icon>
        </v-btn>
        <v-btn @click="showAs='picture'">
          <v-icon> mdi-image </v-icon>
        </v-btn>

      </v-col>
  </v-layout>
 <v-divider />
</v-container>
<v-container v-else>
   Your are not logged in - limited functionality
</v-container>

<v-container fluid>
  <template v-if="showAs == 'list' && ['admin','teacher'].includes(getZml.login.type)">
       <personel-name-list :staffList="filteredItems"
                           @pictureUpload="loadAPicture"
                           :allowEdit="['admin','teacher'].includes(getZml.login.type)"
                           :showAs="showAs"
        />
  </template>
  <template v-if="showAs == 'card' && ['admin','teacher'].includes(getZml.login.type)">
  <v-layout row wrap align-content-start justify-start class="ma-1">
    <v-flex xs12 md6 lg4  v-for="stf in filteredItems" :key="stf.persid">
       <personel-name-card :personelRecord="stf"
                           @pictureUpload="loadAPicture"
                           :allowEdit="['admin','teacher'].includes(getZml.login.type)"
                           :showAs="showAs"
       />
    </v-flex>
  </v-layout>
  </template>
  <template v-if="showAs == 'picture'">
  <v-layout row wrap align-content-start justify-start class="ma-1">
    <v-flex xs12 md6 lg4  v-for="stf in filteredItems" :key="stf.persid">
       <personel-name-picture :personelRecord="stf"
                           :allowEdit="['admin','teacher'].includes(getZml.login.type)"
                           :showAs="showAs"
       />
    </v-flex>
  </v-layout>
  </template>


<v-dialog v-if="personelRec"
          v-model="showAddPhoto"
          :scrollable="false"
          width="400"
          persistent color="light-grey">
   <v-card class="ma-4" >
     <v-card-title>
       Select a picture for {{personelRec.data.name}}  {{personelRec.data.surname}}
     </v-card-title>
     <v-card-text>
                    <upload-resized-image
                        @file-saved="uploadedFilename"
                        extraPath="/home/kuilieso/public_html/bib/assets/staff"
                    />
     </v-card-text>
   <v-card-actions>
     <v-btn @click="showAddPhoto = false"> Close </v-btn>
   </v-card-actions>
   </v-card>
</v-dialog>

</v-container>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import PersonelNameCard from '@/components/staff/PersonelNameCard.vue'
import PersonelNameList from '@/components/staff/PersonelNameList.vue'
import PersonelNamePicture from '@/components/staff/PersonelNamePicture.vue'
import UploadResizedImage from "@/components/UploadResizedImage.vue"
// import zmlPictureLoad from '@/components/zmlPictureLoad.vue'

export default {
 name: "PersonelInfo",
 props:{},
 components: {PersonelNameCard
           , PersonelNameList
           , PersonelNamePicture
           , UploadResizedImage
           },
 data: () => ({
  personelRec:null,
  getZml: getters.getState({ object:"gZml" }),
  showAddPhoto: false,
  personelList:[],
  searchInfo:'',
  showAs:'picture',
  newFileName:''
 }),
 computed: {
  filteredItems: function() {
    if (this.searchInfo == null) return this.personelList
        return this.personelList.filter(item => {
          if(JSON.stringify(item.data).toUpperCase().includes(this.searchInfo.toUpperCase())){
            return item
          }
    })
  }
 },
 methods: {
  loadAPicture(persRecord) {
    alert('select a picture for persRecord for ' + persRecord.data.surname)
    this.personelRec = persRecord
    this.showAddPhoto = true
  },
  personelFound(value) {
    //this.$cs.l('personel found and emitted : ', value)
    if (!value) return;
    if (!value.data) return;
    //this.$cs.l('pList = ' , value.data);
    this.personelRec = value;
  },
  ss() {
    infoSnackbar('hallo')
  },
  uploadedFilename(file) {
      // Information we get back..
      // fileName: "/home/zmlreken/test/DSC_7753.ewhR.jpg"
      // filePath: "/home/zmlreken/test/DSC_7753.ewhR.jpg"
      // filename: "DSC_7753.ewhR.jpg"
      // result: "ok"
      // size: 212875
    //Update dkhs_personel with new name...
    this.newFileName = file.filename  //we only store the filename - no path
    let ts = {};
    ts.task = 'PlainSql';
    ts.sql = `UPDATE dkhs_personel set photo = "${this.newFileName}"
               where persid = ${this.personelRec.data.persid}`
    ts.api = zmlConfig.apiDKHS
    zmlFetch(ts, this.afterUpload);
    this.showAddPhoto = false
  },
  afterUpload(response) {
    console.log('Finished with upload, doing a refresh?',response)
    let ts = {}
    ts.task = 'PlainSql'
    ts.sql = `insert into dkhs_photo values (null, 'pers', '${this.newFileName}',${this.personelRec.data.persid})`
    ts.api = zmlConfig.apiDKHS
    zmlFetch(ts, this.afterInsert, this.errorLoading)
  },
  afterInsert(response) {
    console.log('finished with insert : ', response)
  },
  loadPersonelList() {
    let ts = {};
    ts.task = 'PlainSql';
    ts.sql = `select * from dkhs_personel where room != 'WEG' or workarea != 'WEG' order by surname, name`
    ts.api = zmlConfig.apiDKHS
    zmlFetch(ts, this.afterAllStaffLoaded)
  },
  afterAllStaffLoaded(response) {
    this.personelList = []
    response.forEach(ele => {
       if (ele) {
          const data = {data:ele}
          this.personelList.push(data)
       } else {
         alert('We have a problem assigning our data?')
       }
    })
  }

 },
 mounted: function () {
    //this.$cs.l('PINF MOUNTED Max=', zmlConfig.maxUploadSize)
    this.loadPersonelList()
 }
}
</script>