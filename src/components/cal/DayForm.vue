<template>
<v-card elevation="2" class="ma-2 pa-1 gray--text text--accent-2" color="blue-grey lighten-5" >
 <zml-toggle-button v-model="toggleView" @close="$emit('close')" @save="checkAndSave" />
 <v-card-title class="mb-2">
    DayForm
 </v-card-title>
 <v-card-subtitle  v-if="$vuetify.breakpoint.mdAndUp">
     Quarter {{ day.quarter }} Week {{ day.week }}
 </v-card-subtitle>
  <v-form @submit.prevent ref="form" class="ma-2 pa-2">
   <!-- <v-layout row wrap align-content-start justify-space-between class="ma-2 pa-0"> -->
   <v-text-field dense
                 label="Full Date" type="date"
                 v-model="day.fulldate"
                 disabled
   />
   <v-text-field dense
                 label="Day Name" type="text"
                 v-model="day.day_name"
                 disabled
   />
   <v-radio-group v-model="day.holiday_flag" label="Holiday" dense row>
      <v-radio  label="No"  value="f"  />
      <v-radio  label="Yes" value="t"  />
   </v-radio-group>
   <v-radio-group v-model="day.weekend" label="Weekend" dense row>
      <v-radio  label="No"  value="0"  />
      <v-radio  label="Yes" value="1"  />
   </v-radio-group>
   <v-select
          v-model="day.dayno"
          :items="dayNo"
          label="School Day Number"
          title="0 for Sat and Sun and Holiday2 for Day 2, 10 for Day 10, etc"
          hint="0 for Sat and Sun and Holiday2 for Day 2, 10 for Day 10, etc"
          item-text="daytype"
          item-value="id"
   /> {{ day.dayno }}
   <v-select
          v-model="day.dayOfWeek"
          :items="periodTypes"
          label="Period List to Use"
          item-text="description"
          item-value="dow"
          title="What periodlist should we use"
   />
  <!-- </v-layout> -->
 </v-form>
 <!-- {{ day }} {{ periodTypes}} -->
</v-card>
</template>


<script>
import { zmlFetch } from '@/api/zmlFetch';
import zmlToggleButton from '@/components/zmlToggleButton.vue'
export default {
  name: 'DayEditor',
  components: {
        zmlToggleButton
            },
  props:["dayDetails"],
  data: () => ({
      day:{
        idDate:'20230412', fulldate:'2023-04-12', quarter:'', week:'', day_name:'Monday', holiday_flag:0, weekend:1,  dayno: '9',dayOfWeek:6
      },
      periodTypes:[
        //SELECT description, dow FROM `dkhs_dayperiod` group by description, dow order by dow
          {dow:2, description:'Monday'}
         ,{dow:6, description:'Friday'}
         ,{dow:8, description:'Hall Days'}
         ,{dow:10, description:'Test Day 2023'}
      ],
      toggleView: '',
      dayNo:[ {id:'0', daytype: 'Weekend'}  ,{id:'1',daytype: 'Day 1'}
            , {id:'2',daytype: 'Day 2'}  ,{id:'3',daytype: 'Day 3'}
            , {id:'4',daytype: 'Day 4'}  ,{id:'5',daytype: 'Day 5'}
            , {id:'6',daytype: 'Day 6'}  ,{id:'7',daytype: 'Day 7'}
            , {id:'8',daytype: 'Day 8'}  ,{id:'9',daytype: 'Day 9'}
            , {id:'10' ,daytype: 'Day 10'}
            ]
  }),
  methods:{
    checkAndSave() {
      //alert('check and save' + JSON.stringify(this.day) )
      let ts = {}
      ts.sql = 'update dkhs_date set dayno = :dayno, holiday_flag = :holiday_flag, weekend = :weekend, dayOfWeek = :dayOfWeek where idDate = :idDate'
      ts.task = 'PlainSql'
      ts.data = {idDate:this.day.idDate}
      ts.data.bind = {idDate: this.day.idDate, dayno:this.day.dayno}
      ts.data.bind.weekend = this.day.weekend
      ts.data.bind.holiday_flag = this.day.holiday_flag
      ts.data.bind.dayOfWeek = this.day.dayOfWeek
      zmlFetch(ts, this.updateDone)
    },
    updateDone(resp) {
      //alert('saved ok?' + JSON.stringify(resp) )
      this.$emit('close')
    },
    loadNewData() {
      if (this.dayDetails == '')  return
      if (this.dayDetails == this.day.fulldate)  return
      this.$cs.l(this.$options.name, 'loadNewData')
      let ts = {}
      ts.task = 'PlainSql'
      ts.sql = `select * from dkhs_date where fulldate =  '${this.dayDetails}'`
      zmlFetch(ts, this.loadDay)
      ts.sql = `SELECT description, dow FROM dkhs_dayperiod group by description, dow order by dow`
      zmlFetch(ts, this.loadPeriodType)
    },
    loadPeriodType(resp) {
      this.periodTypes = resp
    },
    loadDay(resp) {
      this.day = resp[0]
      this.$cs.l('calday:',resp)
    }
  },
  computed:{},
  created()  {console.log('created',this.$options.name, this.dayDetails) },
  activated(){console.log('activated',this.$options.name, this.dayDetails) },
  mounted()  {
    console.log('mounted',this.$options.name, this.dayDetails)
    //On mount the eventDetails watcher does not fire...
    this.loadNewData()
  },
  watch: {
    dayDetails(n,o) {
      console.log(this.$options.name, 'details has changed!',n,o, this.dayDetails)
      this.loadNewData()
    }
  }
}
</script>
