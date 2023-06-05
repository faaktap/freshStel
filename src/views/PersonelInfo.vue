<template>
<!-- custom filters on v-data-table search explained... https://www.front.id/en/articles/vuetify-achieve-multiple-filtering-data-table-component-->
<div>

<base-tool v-if="['admin','teacher'].includes(getZml.login.type)"
            toolbarName="De Kuilen High School Personel"
           :background="false"
            >
          <v-btn small @click="showAs='list'" class="mr-2" title="Show as a list">
                        <v-icon> mdi-view-list </v-icon>          </v-btn>
          <v-btn small  @click="showAs='card'"  class="mr-2">
                       <v-icon> mdi-card </v-icon>          </v-btn>
          <v-btn small @click="showAs='picture'"  class="mr-2" title="Show only picture">
                       <v-icon> mdi-image </v-icon>          </v-btn>
          <v-btn small @click="loadPersonelList" class="mr-2" title="refresh - reflect new changes">
                       <v-icon> mdi-refresh </v-icon>          </v-btn>

<v-btn small v-if="personelList.length"
        title="Trying to get images to print"
        @click="doPrint()"
    >
     T
  </v-btn>
</base-tool>

<v-container fluid>
  <v-layout>
      <v-col xs12 md6>
       <v-text-field
            label="Search" placeholder="Search on Surname"
            v-model="searchInfo" solo clearable
            @click:clear="searchInfo = ''"
       />
      </v-col>
  </v-layout>
 <v-divider />
</v-container>
<!-- <v-container v-else>
   Your are not logged in - limited functionality
</v-container> -->

<v-container fluid>

  <!--v-simple-table >
    <tr><th>Public Name</th><th>Name</th><th>Surname</th><th>Picture Path</th><th>Class</th><th>WorkArea</th></tr>
    <tr v-for="d in personelList" :key="d.data.persid">
      <td>{{d.data.public_preferredname}} </td>
      <td>{{d.data.name}}</td>
      <td>{{d.data.surname}}</td>
      <td>https://kuiliesonline.co.za/bib/assets/staff/{{d.data.photo}}</td>
      <td>{{d.data.room}}</td>
      <td>{{d.data.workarea}}</td>
    </tr>
  </v-simple-table-->

  <template v-if="showAs == 'list' && ['admin','teacher'].includes(getZml.login.type)">
       <personel-name-list :staffList="filteredItems"
                           @pictureUpload="loadAPicture"
                           :allowEdit="['admin','teacher'].includes(getZml.login.type)"
                           :showAs="showAs"
        />
  </template>
  <template v-if="showAs == 'card' && ['admin','teacher'].includes(getZml.login.type)">
  <v-layout row wrap align-content-start justify-start>
    <v-flex xs12 md6 lg4  v-for="stf in filteredItems" :key="stf.persid">
       <personel-name-card :personelRecord="stf"
                           @pictureUpload="loadAPicture"
                           :allowEdit="['admin','teacher'].includes(getZml.login.type)"
                           :showAs="showAs"
                           class="ma-2 pa-2"
       />
    </v-flex>
  </v-layout>
  </template>
  <template v-if="showAs == 'picture'">
  <v-layout row wrap align-content-start justify-start class="ma-2">
    <v-flex  v-for="stf in filteredItems" :key="stf.persid" class="ma-1">
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
import { printJSON } from "@/api/zmlPrint.js"
import baseTool from '@/components/base/baseTool.vue'

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
           , baseTool
           },
 data: () => ({
  showPrint:false,
  personelRec:null,
  getZml: getters.getState({ object:"gZml" }),
  showAddPhoto: false,
  personelList:[],
  searchInfo:'',
  showAs:'picture',
  newFileName:'',
  loading:false,
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
      doPrint() {
         let head = [{text:'id', value:'data.persid'}
                    ,{text:"surname", value:'data.surname'}
                    ,{text:"name", value:"data.name"}
                    ,{text:"room", value:"data.room"}
                    ,{text:"workarea", value:"data.workarea"}
                    ,{text:"phone", value:"data.contactnumber"}
                    ]
        printJSON(this.personelList, head, 'Pers List : ')
      },
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
    this.loading = true
    let ts = {}
    ts.task = 'PlainSql'
    ts.sql = `insert into dkhs_photo values (null, 'pers', '${this.newFileName}',${this.personelRec.data.persid})`
    ts.api = zmlConfig.apiDKHS
    zmlFetch(ts, this.afterInsert, this.errorLoading)
  },
  afterInsert(response) {
    console.log('finished with insert : ', response)
    this.loading = false
  },
  loadPersonelList() {
    this.loading = true
    let ts = {};
    ts.task = 'PlainSql';
    ts.sql = `select * from dkhs_personel where room != 'WEG' or workarea != 'WEG' order by surname, name`
    //ts.sql = `select * from dkhs_personel  order by surname, name`
    ts.api = zmlConfig.apiDKHS
    zmlFetch(ts, this.afterAllStaffLoaded)
  },
  afterAllStaffLoaded(response) {
    this.personelList = []
    this.loading = false
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