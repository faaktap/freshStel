<template>
<v-container  v-if="personelRecord">
 <!-- See https://grid.layoutit.com/ for gridlayouts -->

 <v-card v-if="allowEdit=='true'">
  <v-layout row wrap align-content-start justify-space-between>
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

 <v-card max-height="400" class="ma-2">
  <v-card-text class="staff-container">
   <div class="Photo"
       @click="$emit('pictureUpload', personelRecord)"
   >
   <v-img v-if="personelRecord.data.photo"
          :src="'https://kuiliesonline.co.za/bib/assets/staff/' + personelRecord.data.photo + '?'+Math.random()" 
           max-width="220" 
           position="left left"
           class="ma-2">
   </v-img>
   </div>
  <div class="Surname headline">
    {{ personelRecord.data.surname }}
  </div>
  <div class="Firstname headline">
    {{ personelRecord.data.name }} 
  </div>
  <div class="Phone subtitle-1">
       {{ personelRecord.data.contactnumber }}
       <v-divider  />
  </div>
  
  <div class="i1"><v-icon small>mdi-phone</v-icon></div>
  <div class="i2"><v-icon small>mdi-office-building</v-icon></div>
  <div class="i3"><v-icon small>mdi-function</v-icon></div>
  <div class="i4"><v-icon small>mdi-email</v-icon></div>
  <div class="i5"><v-icon small>mdi-update</v-icon></div>
  
  <div class="detail1">  021 903 5121</div>
  <div class="detail2"> {{ personelRecord.data.room }}</div>
  <div class="detail3"> {{ personelRecord.data.workarea }}</div>
  <div class="detail4"> {{ personelRecord.data.email }}</div>
  <div class="detail5"> {{ personelRecord.data.changedate }}</div>
  
  <div class="line"><v-divider
                       class="mx-4"
                       vertical
                      ></v-divider>
  </div>
  <div class="logo text-center"> 
      <!--small>DE KUILEN HS</small-->
    <v-img class="text-center" src="/img/logo.png" 
           max-width="100"
           contain
    /> 
  </div>
  
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

 </v-container>   
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import PersonelEdit from '@/components/student/PersonelEdit';
export default {
    name:"PersonelNameCard",
    components:{PersonelEdit},
    props: ['personelRecord','allowEdit'],
    data: () => ({
      showPersUpdate:false,
      pers:null,
      titles:['Mnr','Mr','Mev','Me','Ms','Mej','Miss','Dr','Prof','Rev'],
      workarea:['Finance','Admin','Teacher','Support','Graadhoof','Ontvangs','Sport'],
   }),
    mounted: function() {
    //    console.log('PNC : Mounted')
        if (this.personelRecord) {   
    //       console.log('PNC : ', this.personelRecord)
        } else {
    //       console.log('PNC : NoName')
        }
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
.staff-container {
display: grid;
  grid-template-columns: 0.8fr 0.7fr 0.6fr 0.5fr 2.4fr 1fr 1fr 1fr 2fr;
  grid-template-rows: 0.3fr 0.3fr 0.4fr 0.2fr 0.2fr 0.2fr 0.2fr 0.2fr 0.1fr;
  gap: 1px 1px;
}
.Photo { grid-area: 1 / 1 / 4 / 4; }
.i1 { grid-area: 4 / 3 / 5 / 4; }
.i2 { grid-area: 5 / 3 / 6 / 4; }
.i3 { grid-area: 6 / 3 / 7 / 4; }
.i4 { grid-area: 7 / 3 / 8 / 4; }
.i5 { grid-area: 8 / 3 / 9 / 4; }
.i6 { grid-area: 9 / 3 / 10 / 4; }
.Firstname { grid-area: 2 / 5 / 3 / 9; }
.Phone { grid-area: 3 / 5 / 4 / 9; }
.detail1 { grid-area: 4 / 5 / 5 / 9; }
.detail2 { grid-area: 5 / 5 / 6 / 9; }
.detail3 { grid-area: 6 / 5 / 7 / 9; }
.detail4 { grid-area: 7 / 5 / 8 / 9; }
.detail5 { grid-area: 8 / 5 / 9 / 9; }
.bottom { grid-area: 9 / 1 / 10 / 10; }
.line { grid-area: 1 / 4 / 4 / 5; }
.underlogo { grid-area: 4 / 9 / 9 / 10; }
.underpic { grid-area: 4 / 1 / 9 / 3; }
.logo { grid-area: 2 / 9 / 4 / 10; }
.Surname { grid-area: 1 / 5 / 2 / 10; }
</style>