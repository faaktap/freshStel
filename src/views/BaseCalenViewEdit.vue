<template>
  <v-container fluid>
    <h1>Calendar ViewF</h1>
    <v-card class="mb-3">
    <v-layout row wrap align-content-start justify-space-around>
    <base-date v-model="selectedDate" instructions="FA" />
    <v-switch hide-details inset v-model="hideSunday"
             :label="`hide Sunday: ${hideSunday.toString()}`" />
    <v-switch hide-details inset  v-model="hideSaturday" dense
             :label="`hide Saturday: ${hideSaturday.toString()}`"  />
    </v-layout>
    </v-card>
    <v-layout row wrap align-content-start justify-space-between>
      <v-card v-for="d in dateFilter" :key="d.idDate"
              width="200px"
              class="ma-2 pa-2"
              elevation="4"
              :color="caColor(d)"
              @click="showMore(d)"
      >
      Day:<strong>{{ d.dayno }}</strong> <span class="float-right"> [ {{ d.fulldate }} ] </span><br>
      {{ d.day_name }}
      <span class="float-right"> <strong>P{{ d.dayOfWeek }}</strong>: {{d.holiday_flag == 't' ? 'H' : ''}}
      {{d.weekend == '1' || d.day_name == 'Sunday' ? 'W' : ''}} </span>
      </v-card>
    </v-layout>
    <!-- <zml-data-table v-if="getZml.baseCalendar.length" :dataList="dateFilter" userHeader="base Calendar" /> -->

  </v-container>
</template>

<script>
import { getters } from  "@/api/store"
import { zData } from '@/api/zGetBackgroundData.js';
//import zmlDataTable from '@/components/zmlDataTable.vue'
import BaseDate from '@/components/base/BaseDate.vue'
export default {
    name:"BaseCalenViewEdit",
    components: {
      BaseDate
    },
    props:{
      seldate:{type:String, default:''}
    },
    data: () => ({
        getZml: getters.getState({ object:"gZml" }),
        selectedDate: '',
        hideSaturday: false,
        hideSunday: false,
    }),
    computed: {
     dateFilter() {
      if (this.getZml.baseCalendar.length == 0) return []
      return this.getZml.baseCalendar.filter(e => {
        if ( (this.hideSaturday && e.day_name == 'Saturday') || (this.hideSunday && e.day_name == 'Sunday')) return false
        if ( e.fulldate.indexOf(this.selectedDate.substring(0,7)) > -1) return true
       })
     }
    },
    methods: {
     showMore(d) {
      alert(JSON.stringify(d))
     },
     caColor(d) {
      let color = d.holiday_flag == 'f' ? 'blue' : 'indigo'
      if (d.weekend == '1') color = 'green darken-5'
      if (d.day_name == 'Sunday') color = 'orange darken-5'
      if (color=='blue') color =  color + ' lighten-' + d.dayno
      return color
     },
    },
    created() {
    },
    mounted() {
     console.log('Mounted', this.$options.name)
     zData.baseCalendarData('load from baseCalenView and Edit')
     if (this.seldate) this.selectedDate = this.seldate
     if (!this.selectedDate) {
       let today = new Date()
       this.selectedDate = today.toISOString().split('T')[0]
     }
   }
}
</script>
