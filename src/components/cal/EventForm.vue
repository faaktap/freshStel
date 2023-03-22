<template>
<v-card elevation="2" class="ma-2 pa-1 gray--text" :class="formTop">
 <zml-toggle-button v-model="toggleView" @close="$emit('close')" @save="checkAndSave" />
 <v-card-title  :style="formSpace"> Event </v-card-title>
  <v-form @submit.prevent ref="form"  :style="formSpace">
   <v-layout row wrap align-content-start justify-space-between class="ma-2 pa-0">
   <auto-sel-event-type v-model="evt.type"
                        label="Event Type"
                        :disabled="readOnly"
   />
   <v-text-field dense
                 label="event name"
                 type="text"
                 v-model="evt.name"
                 outlined
                 :disabled="readOnly"
                 :rules="reqRule"
   />
   <base-date v-model="evt.start"
              dense
              instructions="FA"
              label="start Date"
              :disabled="readOnly"
   />
   <v-text-field dense
                 label="start time" type="time"
                 v-model="evt.startTime"
                 :disabled="readOnly"
                 clearable
   />
   <base-date v-model="evt.end"
              instructions="FA"
              label="end Date"
              dense
              :disabled="readOnly"
   />
   <v-text-field dense
                 label="end time"
                 type="time"
                 v-model="evt.endTime"
                 :disabled="readOnly"
                 clearable
   />
   <base-text-area v-if="evt.id"
                   dense
                   v-model="evt.detail"
                   label="Detail" :maxlength="80" class="pb-0 ma-0"
                   :disabled="readOnly"
   />

   <!-- <p> eventDet: {{ eventDetails }} ro={{ readOnly }} <br>---local--{{ evt }}</p> -->
   <!-- <p>Ek dink die space probleem kan opgelos word, as ons button-toggle heel bo sit - soos zmlclosebutton, maar daar is regmerkie in die een, en kruis in die ander</p> -->
  </v-layout>
  </v-form>
  <!-- {{ evt.name }}
  {{ evt.name.indexOf('Per') == 0 }}
        {{ evt.name.indexOf('day') == 0 }}
        {{ evt.name.indexOf('Admin') == 0 }} -->
  <!-- <v-card-actions class="pa-0">
   <v-spacer /> <v-btn class="ma-2 pa-0" small color="primary" width="100" > Save </v-btn>
  </v-card-actions> -->
</v-card>
</template>


<script>
import zmlToggleButton from '@/components/zmlToggleButton.vue'
import BaseDate from '@/components/base/BaseDate.vue'
import BaseTextArea from '@/components/base/BaseTextArea.vue'
import AutoSelEventType from '@/components/fields/AutoSelEventType.vue'
//import { calEvents } from './CalEvents'
const required = msg => v => !!v || msg
const rules = {
  validEmail: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  reqEmail: required('E-mail is required'),
  reqText: required('At least give me something!')
}

export default {
  name: 'EventEditor',
  components: {
              zmlToggleButton
            , AutoSelEventType
//            , BaseDate
            , BaseDate
            , BaseTextArea
            },
  props:["eventDetails"],
  data: () => ({
      reqRule: [rules.reqText],
      local: 'local',
      evt:{
        start:'', end:'', startTime:'', endTime:'',  type: '', name: '', detail: '', id:''
      },
      toggleView:null
  }),
  methods:{
    checkAndSave() {
      if (this.$refs.form.validate() == false || this.evt.type == '') {
          alert('not yet - please read the messages to complete the form!')
          return
      }
      this.$cs.l(this.$options.name, 'CheckAndSave', this.evt)
      //Fix the time by adding at the back of the dates..
      if (this.evt.startTime) this.evt.start = this.evt.start + ' ' + this.evt.startTime
      if (this.evt.endTime) this.evt.end = this.evt.end + ' ' + this.evt.endTime
      this.$emit('save', this.evt)
    },
    loadNewData() {
      if (this.eventDetails.id == 0 ) {
        //For some reasone, we cannot use JSON.stringify to clone eventdetail if it's not loaded.
        this.$refs.form.reset()
        this.evt.start =  this.eventDetails.start
        this.evt.end =  this.eventDetails.end
        this.evt.startTime =  ''
        this.evt.endTime =  ''
        this.evt.name = ''
        this.evt.type = ''
      } else {
        //clone eventDetails, so we don;t link up to it...
        this.evt = JSON.parse(JSON.stringify(this.eventDetails))
        if (!this.evt.name || !this.evt.start || !this.evt.end) this.$refs.form.reset()
        //Important! Add these two for times
        this.evt.startTime = ''
        this.evt.endTime = ''
        //alert('Start EventForm: Before Assign : ' + JSON.stringify(this.evt))
      }
      this.$cs.l(this.$options.name, 'Before Time Conversion EventForm: E,S : ' , this.evt)
      try {
        // important to cut the times, before we set date to just date
        if (this.evt.start.length > 12) {
          this.evt.startTime = String(this.eventDetails.start.substr(11,5))  //convert to string to not chop minute and hour zeroes
          this.evt.start = String(this.eventDetails.start.substr(0,10))
        }
        if (this.evt.end && this.evt.end.length > 12) {
          this.evt.endTime = this.eventDetails.end.substr(11,5)
          this.evt.end = this.eventDetails.end.substr(0,10)
        }
      }
      catch(err) {
        console.log('Catch Error on timecomnversion', err)
      }
      //alert('Start EventForm: E,S : ' + JSON.stringify(this.evt))
      this.$cs.l(this.$options.name, 'After Time Conversion EventForm: E,S : ' , this.evt)
    }
  },
  computed:{
    readOnly() {
       if (!this.evt || !this.evt.length) return false
       if (this.evt.name.indexOf('Per') == 0
        || this.evt.name.indexOf('day') > -1
        || this.evt.name.indexOf('Admin') == 0
        || this.evt.name.indexOf('Break') == 0
        || this.evt.type == 'School')
         {
        return true
       }
       return false
    },
    formTop() {
        return this.$vuetify.breakpoint.mdAndUp ? 'thebox' : ''
      },
      formSpace() {
        //if (this.expand) return ''
        return this.$vuetify.breakpoint.mdAndUp  ? 'padding-right: 120px' : ''
      }

  },
  created()  {this.$cs.l('created',this.$options.name, this.eventDetails) },
  activated(){this.$cs.l('activated',this.$options.name, this.eventDetails) },
  mounted()  {
    this.$cs.l('mounted',this.$options.name, this.eventDetails)
    //On mount the eventDetails watcher does not fire...
    this.loadNewData()
  },
  watch: {
    eventDetails(n,o) {
      this.$cs.l(this.$options.name, 'details has changed!',n,o, this.eventDetails)
      this.loadNewData()
    }
  }
}
</script>

<style scoped>
div.thebox
{
  fill: currentColor;
  box-sizing: border-box;
  padding-right: 5px;
  /* background-image: url('~@/assets/Rect-Gray-Equality.svg'); */
  /* background-image: url('~@/assets/Rect-Gray-AttendanceHandInLug.svg'); */
  background-image: url('https://kuiliesonline.co.za/img/upload/Rect-Gray-CalendarAdd.svg');
  /* background-image: var(--rec-equal-badge); */
  background-size: 120px auto;
  background-repeat: repeat-y;
  background-attachment: scroll, local;
  background-origin: content-box;
  background-position: top right;
}
</style>