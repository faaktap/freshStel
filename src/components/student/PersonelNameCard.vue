<template>
  <v-container  v-if="personelList">

<!--
<br/>
<br/>
<br/>
<br/>

<v-layout row wrap justify-center>

    <v-flex md6><v-btn block dark>1</v-btn></v-flex>
    <v-flex md6><v-btn block dark>2</v-btn></v-flex>
    <v-flex xs12 md6 order-md2><v-btn block dark>3</v-btn></v-flex>
    <v-flex xs10 md6 order-md1><v-btn block dark>4</v-btn></v-flex>

</v-layout>


      <v-layout row wrap>
        <v-flex xs12 md6>
          <v-card color="red"> card smAndDown = {{ $vuetify.breakpoint.smAndDown }} </v-card>
        </v-flex>
        <v-flex xs12 md6>
<v-card color="red"> card xsOnly = {{$vuetify.breakpoint.xsOnly}} </v-card>
        </v-flex>
        <v-flex xs12 md>
<v-card color="red"> card mobile = {{$vuetify.breakpoint.mobile}} </v-card>
        </v-flex>
  <v-flex xs12 md6>
<v-card color="red"> card 1 </v-card>
  </v-flex>
  <v-flex xs12 md12>
<v-card color="red"> card 100 </v-card>
  </v-flex>
      </v-layout>
-->

<!--
   <v-row><v-col col="12">
    <v-card max-width="500" class="mx-auto">
       <v-container>
         <v-row dense>
           <v-col xs12 md6 lg3>
             <v-card color="teal lighten-5">
               <div class="d-flex flex-no-wrap justify-space-between">
                 <div>
                   
                   <v-card-title class="headline" v-text="personelList.data.surname"></v-card-title>
                 <v-avatar v-if="personelList.data.photo" class="ma-3"  max-width="225">
                   <v-img :src="'https://kuiliesonline.co.za/bib/assets/staff/' + personelList.data.photo"></v-img>
                 </v-avatar>
                   
                   <v-card-subtitle >
                       {{ personelList.data.name }} , {{ personelList.data.contactnumber }} 
                   </v-card-subtitle>
                   <v-card-text>
                       Room : {{ personelList.data.room }}<br>
                       Area : {{ personelList.data.workarea }}<br>
                       Email : {{ personelList.data.workemail }}<br>
                       {{ personelList.data.changedate }}
                   </v-card-text>
                 </div>
               </div>
             </v-card>
             <v-btn v-if="allowEdit" @click="updatePersonel"> Edit Current Card </v-btn>
           </v-col>
         </v-row>
       </v-container>
    </v-card>
   </v-col></v-row>
-->
 <v-container>
            <v-row>
                <v-col lg="3" md="4" sm="6">
                    <v-card class="mb-2" tile="">
                        <v-row align="start">
                            <v-col class="shrink">
                                <v-img :src="'https://kuiliesonline.co.za/bib/assets/staff/' + personelList.data.photo" max-width="100" class="ml-3"></v-img>
                            </v-col>
                            <v-col>
                                <v-card-title class="headline pa-3" v-text="personelList.data.surname"></v-card-title>
                                <v-card-subtitle>{{ personelList.data.name }}   </v-card-subtitle>
                                <v-card-text>
                                       Cell : {{ personelList.data.contactnumber }}
                                       Room : {{ personelList.data.room }}<br>
                                       Area : {{ personelList.data.workarea }}<br>
                                       Email : {{ personelList.data.workemail }}<br>
                                      <div class="caption">{{ personelList.data.changedate }}</div>

                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-btn small v-if="allowEdit" @click="updatePersonel"> Edit Card </v-btn>
                </v-col>
            </v-row>
  </v-container>   
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
<v-dialog v-model="showPersUpdate" 
          v-if="pers" 
          xwidth="auto " :fullscreen="$vuetify.breakpoint.smAndDown" >
  <v-card>
    <v-card-title> EDIT PERSONEL {{ pers.surname }} </v-card-title>
    <v-card-text>


      <v-layout row wrap align-content-start justify-space-between>
        <v-flex>
        <v-card color="light-blue" class="ma-4 pa-4">
          Personal Details
        </v-card>
        <v-layout row wrap align-content-start justify-space-between class="ma-4">

        <v-flex xs10 md6>
          <v-text-field v-model="pers.name" 
                        dense
                        label="Name"  />
        </v-flex>
        <v-flex xs10 md6>
          <v-text-field v-model="pers.surname" 
                        dense
                        label="Surname" />
        </v-flex>
        <v-flex xs8 md6>
         <v-radio-group v-model="pers.title" 
                        label="Title"  
                        dense
                        row>
           <v-radio v-for="t in titles" :key="t"  :label="t"   :value="t"  >
           </v-radio>
         </v-radio-group>          
        </v-flex>
        <v-flex xs4>
         <v-radio-group dense v-model="pers.gender" label="Gender" row>
          <v-radio  label="Male"   value="male"  ></v-radio>
          <v-radio  label="Female"   value="female"></v-radio>
         </v-radio-group>          
        </v-flex>        
        <v-flex xs6 md6>
               <v-text-field v-model="pers.email" 
                             label="Private Email" />
        </v-flex>
        <v-flex xs6 md6>
               <v-text-field v-model="pers.contactnumber" 
                             label="Private Phone/Cell Number" />
        </v-flex>

       </v-layout>

      </v-flex>





        <v-flex>
        <v-card color="light-blue darken-1" class="ma-4 pa-4">
          School Details
        </v-card>
        <v-layout row wrap align-content-start justify-space-between class="ma-4">

        <v-flex xs3>
          <v-text-field v-model="pers.menemonic" 
                        label="School Short Name / Afkorting" 
                        title="Shortname you use on papers at school" />
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="pers.username" label="Preferred Username" 
                        title="Which username do you prefer for logon?" />
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="pers.heidiid" label="School Number" 
                        title="Do you have a staff number?" />
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="pers.room" label="Classroom/Place of work" 
                        title="Where are you situated?" />
        </v-flex>

        <v-flex xs12>
          <v-radio-group dense v-model="pers.registerclass" row label="Register Class" title="Do you have a class you look after?">
            <v-radio v-for="n in 5" :key="n" :label="`${n + 5}`" :value="`${n + 5}`" />
            <v-radio label="None" value="0" />
          </v-radio-group>
        </v-flex>
        <v-flex xs12 v-if="pers.registerclass && pers.registerclass > 5">
          <v-radio-group dense v-model="pers.registergrade" row label="Register Grade" title="Do you have a class you look after?">
            <v-radio v-for="n in 3" :key="'A'+n" 
                     :label="`A${n}`" :value="`A${n}`" />
            <v-radio v-for="n in 7" :key="'E'+n" 
                     :label="`E${n}`" :value="`E${n}`" />
          </v-radio-group>
        </v-flex>
        <v-flex xs12>
          <v-layout row wrap align-content-start justify-start class="ma-1">
            <v-flex xs10>
            <v-radio-group v-model="pers.workarea" 
                        label="Work Area"  
                        dense
                        row>
             <v-radio v-for="w in workarea" :key="w"  :label="w"   :value="w"  > </v-radio>
             </v-radio-group>          
             </v-flex>
             <v-flex xs2>
             <v-text-field v-model="pers.workarea" 
                          dense
                             label="Other" />
             </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs6 md6>
               <v-text-field v-model="pers.workemail" 
                             label="School Email" />
        </v-flex>  
        <v-flex xs6 md6>
               <v-text-field v-model="pers.wcgschoolsid" 
                             label="WCGSCHOOLS username for wifi" />
        </v-flex>                
        </v-layout>
        </v-flex>



        <v-flex>
        <v-card color="light-blue darken-3" class="ma-4 pa-4">
          PUBLIC School Details
        </v-card>
        <v-layout row wrap align-content-start justify-space-between class="ma-4">

        <v-flex xs6 md3>
               <v-text-field v-model="pers.public_preferredname" 
                             label="Name on Internet"
                             title="What should your name look like on public space?" />
        </v-flex>
        <v-flex xs6 md4>
         <v-text-field v-model="pers.public_email" 
                       label="Email on Internet" 
                       title="Which email to share on internet?" />
        </v-flex>  

        <v-flex xs12 lg6>
        <v-textarea v-model="pers.public_vakke" 
                    label="Subject and grade info we can share on the internet (optional)" 
                    dense
                    title="What do you do at school?" />
        </v-flex>

        <v-flex xs12 lg6>
         <v-textarea v-model="pers.public_ander" 
                     dense
                     label="Other (sport etc) we can use on internet" 
                     title="Do you do sport, culture, something else at school? {optional)" />
        </v-flex>
        <v-flex  xs12 lg6>
         <v-textarea v-model="pers.public_history" 
                     label="History we can display on Internet - optional" 
                     title="Something short - where you where born and where you studied."/>
        </v-flex>
        </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
       <v-btn @click="savePers"> Save </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-container>   


</template>
<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
export default {
    name:"PersonelNameCard",
    props: ['personelList','allowEdit'],
    data: () => ({
      showPersUpdate:false,
      pers:null,
      titles:['Mnr','Mr','Mev','Me','Ms','Mej','Miss','Dr','Prof','Rev'],
      workarea:['Finance','Admin','Teacher','Support','Graadhoof','Ontvangs','Sport'],
   }),
    mounted: function() {
        console.log('PNC : Mounted')
        if (this.personelList) {   
           console.log('PNC : ', this.personelList)
        } else {
           console.log('PNC : NoName')
        }
    },
    methods:{
      updatePersonel() {
        this.pers = this.personelList.data
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
        console.log('Finished with staff Update, doing a refresh?',response)
      },
    },
}
</script>

