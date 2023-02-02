<template>
<v-card class="ma-0 pa-0"  v-if="personelRecord" elevation="0" color="">
 <!-- See https://grid.layoutit.com/ for gridlayouts -->
 <v-card v-if="allowEdit=='true'">
  <v-layout row wrap align-content-start justify-space-around>
    <v-flex>
      <v-card color="blue accent-1" class="ma-2 pa-5">
        Actions
        <v-btn small class="float-right" @click="updatePersonel">
         Edit
        </v-btn>
      </v-card>
    </v-flex>
  </v-layout>
 </v-card>

  <!-- rgba(105, 199, 71, 0.3) -->
  <!-- rgb(205, 127, 50) -->
 <v-card max-width="210" class="ma-2 text-center"
        color="rgba(185, 156, 49, 0.9)"
        style="border-radius:50px">
  <v-card-text class="text-center">
   <div class="Photo"
       @click="$emit('pictureUpload', personelRecord)"
   >
   <v-img v-if="personelRecord.data.photo"
          :src="'https://kuiliesonline.co.za/bib/assets/staff/' + personelRecord.data.photo + '?'+Math.random()"
           max-width="220"
           position="center center"
           class="ma-2 text-center"
           contain
           style="border-radius:50px">
   </v-img>
   </div>
  <div class="Surname headline green--text text--darken-3">
    <!-- {{ personelRecord.data.surname }},
    {{ personelRecord.data.name }} -->
    {{ personelRecord.data.public_preferredname }}
  </div>
  <!--div class="line"><v-divider
                       class="mx-4"
                       vertical
                      ></v-divider>
  </div-->

  </v-card-text>
 </v-card>


 <v-dialog v-model="showPersUpdate"
          v-if="showPersUpdate && pers"
          xwidth="auto " :fullscreen="$vuetify.breakpoint.smAndDown" >
  <personel-edit @savePers="savePers" :pers="pers.data">   </personel-edit>
 </v-dialog>

<!--
{ "desc": "menemonic 151 Albertyn, undefined",
"data": { "persid": "151", "username": "username", "menemonic": "menemonic"
        , "staffid": "151", "heidiid": "151", "registergrade": null, "registerclass": null
        , "subjectid": null, "gender": "male"
        , "surname": "Albertyn"
        , "name": "Kuyper"
        , "title": "title"
        , "contactnumber": "084 670 8801"
, "workarea": "teacher (ah)"
, "room": "35"
, "photo": "Kuyper_Albertyn.jpg"
, "workemail": "KAlbertyn@dekhs.co.za"
, "email": "kalbertyn73@gmail.com ", "wcgschoolsid": null, "description": "First Load"
, "public_preferredname": "Mnr. K. Albertyn", "public_vakke": "vakke"
, "public_ander": "sport, ens..", "public_history": "geskiednis", "public_email": "KAlbertyn@dekhs.co.za"
, "address": "14 Sonnemeisie Street, Kuilsriver, 7580"
, "IDNumber": "7306165079082", "changedate": "2020-07-22 17:44:16" } }
-->

 </v-card>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import PersonelEdit from '@/components/staff/PersonelEdit';
export default {
    name:"PersonelNamePicture",
    components:{PersonelEdit},
    props: ['personelRecord','allowEdit'],
    data: () => ({
      showPersUpdate:false,
      pers:null,
      titles:['Mnr','Mr','Mev','Me','Ms','Mej','Miss','Dr','Prof','Rev'],
      workarea:['Finance','Admin','Teacher','Support','Graadhoof','Ontvangs','Sport'],
   }),
    mounted: function() {

    },
    methods:{
      updatePersonel() {
        this.pers = this.personelRecord
        this.showPersUpdate = true
      },
      savePers() {
        let ts = {};
        ts.task = 'updateStaff';
        ts.data = this.pers
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.afterUpload);
        this.showPersUpdate = false
      },
      afterUpload(response) {
        console.log('Finished with staff Update, you could do a refresh?',response)
      },
    },
}
</script>

<style scoped>

#fileInput {
  display: none;
}

</style>