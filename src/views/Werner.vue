<template>
<v-container fluid>
<h1> Hallo World </h1>

<v-btn v-for="but in buttons" :key="but.to"
       small :to="but.to"
       class="ma-2 pa-2"
> {{ but.name || but.to}}
 </v-btn>
<v-btn small @click="afterQuick"> Load Initial Data </v-btn>

<base-title-expand  heading="Show Vars" color="blue">
<v-card>
  {{ getZml.place }}
</v-card>
<v-card>
  {{ getZml.persMenemonic }}
</v-card>
</base-title-expand> -

<!-- :initialPlaceID="testroomstart" -->
<v-card>
  <v-card-title> Choose some auto fields </v-card-title>
   <v-card-text>
      <v-layout wrap justify-space-between>
        <auto-sel-pers v-if="getZml.persMenemonic && getZml.persMenemonic.length"
                       v-model="persMen"   asLabel="Inspector/Teacher"
                       :initialValue="getZml.login.username"
                       :itemObj="getZml.persMenemonic" @objInput="persObj = $event" />
        <auto-sel-room v-if="getZml.place && getZml.place.length"
                     v-model="testroom" asLabel="Location"
                    :initialValue="testroomstart"
                    :itemObj="getZml.place"  @objInput="testroomobj = $event" />
        <auto-sel-period v-model="period"
                    label="Period"
                    @DayAndPeriod="period = $event.period; day = $event.day" />
        <auto-sel-day v-model="day"
                    label="Day"
                    @DayAndPeriod="period = $event.period; day = $event.day" />
        <auto-sel-att-list v-if="getZml.classList && getZml.classList.length"
                           v-model="classListNo" asLabel="ClassList"
                          :initialValue="classListNo" :itemObj="getZml.classList"
                          @objInput="classListObj = $event" />
      </v-layout>
   </v-card-text>
  <v-card-actions>acttio
    </v-card-actions>
</v-card>

                  trstart{{ testroomstart }}
                  troom {{ testroom }}

                  <p class="text-caption">obj = {{ testroomobj }}</p>

   persmen {{ persMen }}
   <p class="text-caption">PO : {{ persObj }}<p>
   Day:{{ day }}  Period:{{ period }}<br>
   classListNO:{{ classListNo }} <br> listObj:{{ classListObj }}

<hr>

{{ getZml.classList }}

</v-container>
</template>


<script>
import { zData } from "@/api/zGetBackgroundData.js"
import { getters } from "@/api/store";
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import AutoSelRoom from '@/components/fields/AutoSelRoom.vue'
import AutoSelPers from '@/components/fields/AutoSelPers.vue'
import AutoSelPeriod from '@/components/fields/AutoSelPeriod.vue'
import AutoSelDay from '@/components/fields/AutoSelDay.vue'
import AutoSelAttList from '@/components/fields/AutoSelAttList.vue'

export default {
    name:"Werner",
    components: {
                // ZAutoPers, ZAutoLocation, ZAutoPeriod
                 AutoSelRoom
               , AutoSelPers
               , AutoSelPeriod
               , AutoSelDay
               , AutoSelAttList
               , BaseTitleExpand
               },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        testroom:'',
        testroomstart:'1A',
        testroomobj:{},

        persMen: '',
        persObj: {surname: 'poepies'},

        period:'2',
        day:'1',

        classListNo:4772,
        classListObj:{},

        tab:{id:0
           , desc: "Attendance Class Lists"
           , workDone: 0
           , response: []
           , processor: (action,element) => {this.doSomething(action,element)}
           , sql:`SELECT * FROM hw_classlist s order by s.grade, teacher`
           , progess:false
        },
        buttons:[
            {to:"/checklog", name:"checklog"},
            {to:"/emailcheck", name:""},
            {to:"/teacherlist", name:""},
            {to:"/class", name:""},
            {to:"/tce", name:"Teacher Class Edit"},
            {to:"/testview", name:"Test View"},
            {to:"/gtlist", name:"General teacher List"},
            ],

    }),
    methods: {
      afterQuick(r) {
        zData.initialData('Really Load Latest Data',this.afterwards)
        console.log('after QUick',r)
      },
      afterwards(r) {
        this.persMen = this.getZml.login.persMenemonic
        console.log('afterward',r)
        console.log(this.persMen , this.getZml.login.persMenemonic)
      },
    },
    created() {
    },
    mounted() {
        zData.quickLoadInitialData('get from ini', this.afterQuick)



    }
}
</script>