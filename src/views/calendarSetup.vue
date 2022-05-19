<template>
<v-container>
 <v-btn @click="build" :loading="loading"> build </v-btn>
 <div v-if="list.length > 0">
   <v-data-table
        :headers="listHeader"
        :items="list"
         class="elevation-2"
        :loading="loading"
        @click:row="clickOnRow"
   />
 </div>
</v-container>
</template>


<script>
import { createDays } from '@/api/createDays.js'
export default {
  name: 'calendarSetup',
  data: () => ({
      loading:false,
      list: [],
      listHeader:[
          { text: "dayName", align: "start", value: "dayName" },
          { text: "date", align: "start", value: "date" },
          { text: "day", align: "center", value: "day" },
          { text: "school", align: "left", value: "school" },
          { text: "holiday", align: "center", value: "holiday" },
          { text: "descroption", align: "left", value: "description" },
       ],
  }),
  methods: {
      build() {
          this.loading = true
          this.list = createDays.stepIt()
          this.loading = false
      },
      clickOnRow(e) {
          console.log(e)
      }
  }
}
</script>