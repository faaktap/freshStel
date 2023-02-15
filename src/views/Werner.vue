<template>
<v-container fluid>
<h1> Hallo World </h1>

<v-btn v-for="but in buttons" :key="but.to"
       small :to="but.to"
       class="ma-2 pa-2"
> {{ but.name || but.to}}
 </v-btn>
<v-btn small @click="loadInitalData"> Load Initial Data </v-btn>

<base-title-expand  heading="Test ZAutoPers" color="blue">
</base-title-expand>
<!-- Test ZAutoPers ---------------------------------
<base-title-expand  heading="Test ZAutoPers" color="blue">
  <v-card>
    <v-card-title> Playing with Z-AUTO-PERS </v-card-title>
   <v-card-text>
  <z-auto-pers v-model="persid" @objectSelected="persobj=$event" class="ma-2 pa-2" />
      </v-card-text>
      <v-card-text>
    {{ persid }} {{ persobj }}
    <hr>
     {{ apersid }} {{ apersobj }}
</v-card-text>
 <v-card-actions>
 <z-auto-pers label="another pers"
              v-model="apersid"
              class="mx-7 pr-11 mt-4"
              @objectSelected="apersobj=$event"
  />
 </v-card-actions>
 </v-card>
 <h3> persMenemonic </h3>
<p class="text-caption"> {{ persMenemonic }} </p>
</base-title-expand> -->
<!-- Test ZAutoPers END---------------------------------

<base-title-expand  heading="Test ZAutoLocation / Place" color="green">
 <z-auto-location label="another location"
              v-model="placeid"
              class="mx-7 pr-11 mt-4"
              @objectSelected="placeobj=$event"
  />
  {{ placeid }} -- {{ placeobj }}
  <br>
  {{ place }}

</base-title-expand> -->

<v-layout wrap justify-space-around>
    <!-- <z-auto-pers v-model="persid" @objectSelected="persobj=$event; placeid=persobj.room" class="ma-2 pa-2" /> {{ persid }}
    {{ persobj }}

    <z-auto-location v-model="placeid" label="Location" @objectSelected="placeobj=$event" class="ma-2 pa-2"/> {{ placeid }}
    <z-auto-period v-model="period" @DayAndPeriod="period=$event.period;day=$event.day || day" class="ma-2 pa-2"/>  p={{ period }} d={{ day}}
    <v-text-field v-model="placeid" />
<br> -->
<!-- :initialPlaceID="testroomstart" -->
    <auto-sel-room v-if="place && place.length"
                     asLabel="The Room"
                    :initialValue="testroomstart"
                    :itemObj="place"
                     v-model="testroom"
                     @objInput="testroomobj = $event"
                  /> testroom = {{ testroom }}
                  <v-text-field class="ma-2" v-model="testroomstart" label="testroomstart" outline />
                  <v-text-field class="ma-2" v-model="testroom" label="testroom" outline />
                  obj = {{ testroomobj }}


            <auto-sel-pers v-if="persMenemonic && persMenemonic.length"
                            asLabel="Inspector/Teacher"
                            :initialValue="getZml.login.username"
                            :itemObj="persMenemonic"
                            v-model="persDING"
             />
             <v-text-field class="ma-2" v-model="persDING" label="MeNeMoNiC" outline />

            <auto-sel-pers v-if="persMenemonic && persMenemonic.length"
                            asLabel="Inspector/Teacher"
                            :initialValue="persDING2"
                            :itemObj="persMenemonic"
                            v-model="persDING2"
                            @objInput="persOBJ = $event"
             />
             <v-text-field class="ma-2" v-model="persDING2" label="MeNeMoNiC - 2" outline />
             PO : {{ persOBJ }}


</v-layout>
</v-container>
</template>


<script>
import { zData } from "@/api/zGetBackgroundData.js"
import { getters } from "@/api/store";
import { ls } from "@/api/localStorage.js"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
// import ZAutoPers from '@/components/fields/ZAutoPers.vue'
// import ZAutoLocation from '@/components/fields/ZAutoLocation.vue'
// import ZAutoPeriod from '@/components/fields/ZAutoPeriod.vue'
import AutoSelRoom from '@/components/fields/AutoSelRoom.vue'
import AutoSelPers from '@/components/fields/AutoSelPers.vue'

export default {
    name:"Werner",
    components: {
                // ZAutoPers, ZAutoLocation, ZAutoPeriod
                 AutoSelRoom
               , AutoSelPers
               , BaseTitleExpand},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        //Test ZAutoPers
        persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
        persid:0,
        persobj:{},
        apersid:0,
        apersobj:{},
        //END of Test ZAutoPers

        //Test ZAutoLocation
        place: getters.getState({ object: "gZml" }).place,
        placeid: '',
        placeobj: {},
        //END ofTest ZAutoLocation

        testroom:'',
        testroomstart:'111',
        testroomobj:{},

        persDING:'',
        persDING2:'TVRB',
        persOBJ: {},

        period:'',
        day:'',
        buttons:[
            {to:"/checklog", name:"checklog"},
            {to:"/emailcheck", name:""},
            {to:"/teacherlist", name:""},
            {to:"/class", name:""},
            {to:"/tce", name:"Teacher Class Edit"},
            {to:"/testview", name:"Test View"},
            {to:"/gtlist", name:"General teacher List"},
            ]
    }),
    methods: {
        loadInitalData() {
        zData.initialData('Load Latest Data')
        ls.save('test','test')
        },
    },
    mounted() {
        this.place = ls.load('lookupPlace')
        console.log(ls.test('ditbestaannie'))
        console.log(ls.load('ditbestaannie'))
    }
}
</script>