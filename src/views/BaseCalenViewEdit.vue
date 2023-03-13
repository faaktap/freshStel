<template>
  <v-container fluid>
    <h1>asdfasdfasdfsdF</h1>
    <zml-data-table v-if="getZml.baseCalendar.length" :dataList="getZml.baseCalendar" userHeader="base Calendar" />
    <v-card v-else>
      There is no data in base Cal
    </v-card>
  </v-container>
</template>

<script>
import { getters } from  "@/api/store"
import { zData } from '@/api/zGetBackgroundData.js';
import zmlDataTable from '@/components/zmlDataTable.vue'
export default {
    name:"BaseCalenViewEdit",
    components: {
      zmlDataTable
    },
    props: [],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
    }},
   computed: {
   },
   created() {

   },
   mounted() {
    console.log('Mounted', this.$options.name)
    zData.baseCalendarData('load from baseCalenView and Edit')
   },
   methods: {
   }
}
</script>
