<template>
<div>
  <v-layout>
  <hero-section name="forDB" 
               bgpicture="https://www.zmlrekenaars.co.za/test/img/wall099.jpg" 
               title="Staff Information" 
               text=""
               breakup1="105"
               breakup2="70"
               color="blue darken-1"
               />
  <hr />
  </v-layout>

  <v-card >
      <v-card-title>
          Please enter a few characters of the staff member's surname
          <br />
          
      </v-card-title>
      <v-card-text>
        <v-layout row >
          <v-flex xs12 md6>
          <personel-lookup @dataEntered="personelFound"  />
          </v-flex>

          <v-flex v-show="personelList" xs12 md6>
          <personel-name-card :personelList="personelList" allowEdit="true" /> 
          </v-flex>
          
          <v-flex v-if="showAddPhoto" xs6>
            <zml-file-load @file-saved="uploadedFilename" />
          </v-flex>

       </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn small @click="showAddPhoto = true"> ChangePhoto </v-btn>
      </v-card-actions>
  </v-card>



<router-link :to="{ name: 'StudentInfo'}" > <v-icon> mdi-school </v-icon> </router-link>

<!--
{ "desc": "menemonic 151 Albertyn, undefined", 
"data": { "persid": "151", "username": "username", "menemonic": "menemonic"
        , "staffid": "151", "heidiid": "151", "registergrade": null, "registerclass": null
        , "subjectid": null, "gender": "male", "surname": "Albertyn", "name": "Kuyper"
        , "title": "title", "contactnumber": "084 670 8801"
        , "workarea": "teacher (ah)", "room": "35", "photo": "Kuyper_Albertyn.jpg", "workemail": "KAlbertyn@dekhs.co.za", "email": "kalbertyn73@gmail.com ", "wcgschoolsid": null, "description": "First Load", "public_preferredname": "Mnr. K. Albertyn", "public_vakke": "vakke", "public_ander": "sport, ens..", "public_history": "geskiednis", "public_email": "KAlbertyn@dekhs.co.za", "address": "14 Sonnemeisie Street, Kuilsriver, 7580", "IDNumber": "7306165079082", "changedate": "2020-07-22 17:44:16" } }
-->

</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import HeroSection from "@/views/sections/HeroSection.vue"
import PersonelLookup from '@/components/student/PersonelLookup.vue'
import PersonelNameCard from '@/components/student/PersonelNameCard.vue'
import zmlFileLoad from '@/components/zmlFileLoad.vue'
export default {
name: "PersonelInfo",
props:{},
components: {HeroSection
           , PersonelLookup 
           , PersonelNameCard          
           , zmlFileLoad
           },
data: () => ({
  personelList:null,
  getZml: getters.getState({ object:"gZml" }),
  showAddPhoto: false,
}),
methods: {
  personelFound(value) {
    console.log('personel found and emitted : ', value)
    if (!value) return;
    if (!value.data) return;
    console.log('pList = ' , value.data);
    this.personelList = value;
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
           + ' where staffid = ' + this.personelList.data.persid
    ts.api = zmlConfig.apiDKHS
    zmlFetch(ts, this.afterUpload);       
    this.showAddPhoto = false
  },
  afterUpload(response) {
      console.log('Finished with upload, doing a refresh?',response)
  },

},
mounted: function () {
    console.log('PINF MOUNTED Max=', zmlConfig.maxUploadSize)
}

}
</script>