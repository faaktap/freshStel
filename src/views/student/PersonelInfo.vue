<template>
<div>

<v-row>
    <v-col xs-12 lg-12>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>
            Personel (click on a photo to load a new one)
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
      <v-col xs12 md6 xxxxv-if="getZml.login.username=='werner'">
        <v-btn @click="showAs='list'"> 
          <v-icon> mdi-view-list </v-icon>
        </v-btn>
        <v-btn @click="showAs='card'"> 
          <v-icon> mdi-card </v-icon>
        </v-btn>
      </v-col>
  </v-layout>
 <v-divider />
</v-container>

<v-container v-if="['admin','teacher'].includes(getZml.login.type)" fluid>
  <template v-if="showAs == 'list'">
       <personel-name-list :staffList="filteredItems" 
                           @pictureUpload="loadAPicture"
                           :allowEdit="['admin','teacher'].includes(getZml.login.type)"
                           :showAs="showAs" 
        />                    
  </template>
  <template v-if="showAs == 'card'">
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


<v-dialog v-if="personelRec" v-model="showAddPhoto" :scrollable="false" persistent color="light-grey">
   <v-card class="ma-4" >
     <v-card-title>
       Select a picture for {{personelRec.data.name}}  {{personelRec.data.surname}}
     </v-card-title>
                    <zml-picture-load v-if="personelRec" 
                                    @file-saved="uploadedFilename" 
                                    :partOfFilename="personelRec.data.name+personelRec.data.surname"
                                     extrapath="/bib/assets/staff/"
                    /> 
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
import PersonelNameCard from '@/components/student/PersonelNameCard.vue'
import PersonelNameList from '@/components/student/PersonelNameList.vue'
import zmlPictureLoad from '@/components/zmlPictureLoad.vue'

export default {
 name: "PersonelInfo",
 props:{},
 components: {PersonelNameCard
           , PersonelNameList
           , zmlPictureLoad           
           },
 data: () => ({
  personelRec:null,
  getZml: getters.getState({ object:"gZml" }),
  showAddPhoto: false,
  personelList:[],
  searchInfo:'',
  showAs:'card',
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
    console.log('personel found and emitted : ', value)
    if (!value) return;
    if (!value.data) return;
    console.log('pList = ' , value.data);
    this.personelRec = value;
  },
  ss() {
    infoSnackbar('hallo')
  },
  uploadedFilename(filename) {
    console.log(filename)
    //Update dkhs_personel with new name...
    let ts = {};
    ts.task = 'PlainSql';
    ts.sql = 'update dkhs_personel set photo = "' + filename + '"'
           + ' where persid = ' + this.personelRec.data.persid
    ts.api = zmlConfig.apiDKHS
    zmlFetch(ts, this.afterUpload);       
    this.showAddPhoto = false
  },
  afterUpload(response) {
      console.log('Finished with upload, doing a refresh?',response)
  },
  loadPersonelList() {
    let ts = {};
    ts.task = 'PlainSql';
    ts.sql = 'select * from dkhs_personel order by surname, name'
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
    console.log('PINF MOUNTED Max=', zmlConfig.maxUploadSize)
    this.loadPersonelList()
 }
}
</script>