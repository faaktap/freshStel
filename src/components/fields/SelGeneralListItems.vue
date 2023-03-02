<template>
    <v-layout wrap justify-space-around>
        <auto-sel-pers v-if="getZml.persMenemonic && getZml.persMenemonic.length"
              asLabel="Inspector/Teacher"
              v-model="p.persMen"
              :initialValue="p.persMen"
              :itemObj="getZml.persMenemonic"
              @input="changePers"
              @objInput="p.persObj = $event; changePers($event)" />
        <auto-sel-room v-if="getZml.place && getZml.place.length"
              class="mx-1"
              asLabel="Location"
              v-model="p.roomName"
              :initialValue="p.roomName"
              :itemObj="getZml.place"
              @input="change"
              @objInput="p.roomObj = $event; change($event)" />
        <auto-sel-day v-model="p.day"
              label="Day"
              :teacher="findTeacher"
              class="mx-1"
              @input="change"
              @DayAndPeriod="p.period = $event.period; p.day = $event.day; change($event)" />
        <auto-sel-period v-model="p.period"
              label="Period"
              class="mx-1"
              :teacher="findTeacher"
              @input="change"
              @DayAndPeriod="p.period = $event.period; p.day = $event.day; change($event)" />
        <auto-sel-att-list v-if="getZml.classList && getZml.classList.length"
              asLabel="ClassList"
              class="mx-1"
              v-model="p.classListID"
              :initialValue="p.classListID"
              :itemObj="getZml.classList"
              @input="change"
              @objInput="p.classListObj = $event; change($event)" />
        <auto-sel-gen-list v-model="p.questionID"
              asLabel="Question List" :initialValue="p.questionID"
              @input="change"
              @objInput="p.questionObj = $event; change($event)"
        />
    </v-layout>
</template>


<script>
import { getters } from "@/api/store";
import AutoSelRoom from '@/components/fields/AutoSelRoom.vue'
import AutoSelPers from '@/components/fields/AutoSelPers.vue'
import AutoSelPeriod from '@/components/fields/AutoSelPeriod.vue'
import AutoSelDay from '@/components/fields/AutoSelDay.vue'
import AutoSelAttList from '@/components/fields/AutoSelAttList.vue'
import AutoSelGenList from '@/components/fields/AutoSelGenList.vue'

export default {
    name:"SelGeneralListItems",
    components: {
        AutoSelRoom
      , AutoSelPers
      , AutoSelPeriod
      , AutoSelDay
      , AutoSelAttList
      , AutoSelGenList
    },
    props:{
      initialValues:{type:Object, required:false},
      },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      p: {roomName: ''
         ,roomObj: ''
         ,persMen: ''
         ,persObj: ''
         ,classListID: ''
         ,classListObj:{}
         ,questionID: ''
         ,questionObj: {}
         ,period: ''
         ,day: ''
      },
    }),
    computed: {
      findTeacher() {
            console.log('findTeacher', this.p.persObj)
            if (this.p.persObj == null || !this.p.persObj.user_name) return this.getZml.login.username
            return this.p.persObj.user_name
      }
    },
    methods: {
      changePers() {
            console.log('change Pers!!!!', this.findTeacher)
            //console.log('roomname', this.p.persObj)
            if (this.p.persObj !== null && this.p.persObj !== undefined && 'room' in this.p.persObj) {
               this.p.roomName = this.p.persObj.room
               //console.log(this.p.persObj.room)
            }
            //console.log('changed????', this.p.roomName , this.p.persObj)
      },
      change(e) {
            if (e == undefined) return
            //each time a change come in, we send the whole object back
            console.log('CHange', this.$options.name,e)
            this.$emit('input', this.p)
      }
    },
    created() {
      console.log('Create', this.$options.name)
      if (this.initialValues) this.p = this.initialValues
    },
    mounted() {
      console.log('Mount', this.$options.name)

      console.log(this.$options.name,this.initialValues)
    },
    watch: {
    }
}
</script>