<template>
  <v-card>
    <v-card-title> EDIT PERSONEL {{ pers.surname }} </v-card-title>

    <v-card-text>
      <v-layout row wrap align-content-start justify-space-between>
       <v-flex>
        <v-card color="light-blue" class="ma-4 pa-4">
          Personal Details <v-btn small class="float-right" @click="savePers"> Save </v-btn>
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
          <v-radio-group dense v-model="pers.registergrade" row label="Register Grade" title="Do you have a class you look after?">
            <v-radio v-for="n in 5"
                    :key="n"
                    :label="`${n + 7}`"
                    :value="`${n + 7}`" />
            <v-radio label="None" value="0" />
          </v-radio-group>
        </v-flex>
        <v-flex xs12 v-if="pers.registergrade && pers.registergrade > 7">
          <v-radio-group dense v-model="pers.registerclass" row label="Register Class" title="Do you have a class you look after?">
            <v-radio v-for="n in 3" :key="'A'+n"
                     :label="`A${n}`" :value="`A${n}`" />
            <v-radio v-for="n in 8" :key="'E'+n"
                     :label="`E${n}`" :value="`E${n}`" />
          </v-radio-group>
          <v-text-field v-model="pers.registerclass"  title="vir graadhoofde?" />

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
        <v-flex  xs12 lg6 v-if="getZml.login.username=='WER'">
         <v-textarea v-model="pers.description"
                     label="Description"
                     title="Info for Werner."/>
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

      <v-layout row wrap align-content-start justify-space-between>
       <v-flex>
        <v-card color="light-blue accent-1" class="ma-4 pa-4">
          End of Form <v-btn small class="float-right" @click="savePers"> Save </v-btn>(ESC to Exit)
        </v-card>
       </v-flex>
      </v-layout>

    </v-card-actions>
  </v-card>
</template>

<script>
import { getters } from "@/api/store";
export default {
    name:"PersonelEdit",
    props:['pers'],
    data: () => ({
      getZml: getters.getState({ object:"gZml" }),
      titles:['Mnr','Mr','Mev','Me','Ms','Mej','Miss','Dr','Prof','Rev'],
      workarea:['Finance','Admin','Teacher','Support','Graadhoof','Ontvangs','Sport','Adjunk Hoof'],
     }),
    methods:{
        savePers() {
            this.$emit('savePers', this.pers)
        }
    }
}
</script>