<template>
<v-container fluid class="mb=2">
    <h2 class="heading-1 text-center">
         Allocation a  merit to a student</h2>

  <v-card class="ma-2">
        <v-card xs6 class="ma-2">
         <v-card-text v-if="getZml.login.studentid">
            MERIT : <strong>{{ meritDescription }}</strong><br>
            FOR : <strong> {{ studentData }} </strong>
         </v-card-text>
         <v-card-text v-else>
           <student-lookup @dataEntered="studentFound"
                            :searchMore="true"
                            small
           />
         </v-card-text>
         <v-card-actions>
            <v-spacer />
            <v-btn small color="warning" @click="goBack"> Cancel </v-btn>
         </v-card-actions>
        </v-card>

        <v-divider />

        <v-card class="ma-2">
            <v-flex xs4>
            TEACHER CONFIRM: {{ persSearch}}
            </v-flex>
            <v-flex xs6>
             <auto-sel-pers id="zyx4"
                            asLabel="Pers"
                            :initialValue="persMenemonic"
                            :itemObj="getZml.persMenemonic"
                            v-model="persMenemonic"
            />

            </v-flex>
        </v-card>
      <v-divider></v-divider>

        <v-card>
        ask the date and save it
        <base-date v-model="meritDte"  label="Date" instructions="FA" />
        </v-card>
        <v-card-actions>
            <v-btn @click="save"> save </v-btn>
        </v-card-actions>
  </v-card>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { mer } from "@/components/merit/merit.js"
import { infoSnackbar } from "@/api/GlobalActions"
import StudentLookup from "@/components/student/StudentLookup.vue"
//import PersonelMenemonic from '@/components/staff/PersonelMenemonic.vue'
//import PersonelLookup from '@/components/staff/PersonelLookup.vue'
import AutoSelPers from '@/components/AutoSelPers.vue'
import BaseDate from "@/components/base/BaseDate.vue"
export default {
    name: 'MeritStepper',
    props: ['meritid'],
    components:{
        StudentLookup
//       ,PersonelMenemonic
//       ,PersonelLookup
       ,AutoSelPers
       ,BaseDate
    },
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
        cStep: 1,
        meritDescription: '',
        studentData: 0,
        curStudId: 0,
        wieOmTeWys:'',
        persSearch:'MOS',
        meritDte:null
    }},
    methods:{
        initialize(pData, pDesc, persMenemonic) {
            this.$cs.l('initialize  ', pData, pDesc,persMenemonic)
            //alert('now we get studentid and staff and date')
            this.meritDescription = pDesc
            this.persMenemonic = persMenemonic
        },
        goBack() {
            this.$router.back()
        },
        persMenemonic(e) {
            console.log(e)
            console.log(e.data.menemonic)
        },
        studentFound(e) {
          this.studentData = e
          this.curStudId = e.data.studentid
          this.studentData = `${e.data.studentid}, ${e.data.firstname} ${e.data.surname} {${e.data.grade})`
        },
        save() {
            if (!(this.meritDte && this.persMenemonic && this.curStudId)) {
                infoSnackbar('We need a student, a teacher, a date and a meritid')
                return
            }
            mer.add({meritid: this.meritid
                   , desc: this.meritDescription
                   , pers: this.persMenemonic
                   , studentid: this.curStudId
                   , date: this.meritDte
                   , continue:this.goBack}
            )

        },


    },
    mounted() {
        this.$cs.l('Mounted', this.$options.name)
        if (this.meritid) {
           mer.check({meritid: this.meritid, desc: '', continue:this.initialize})
        }
        if (this.getZml.login.studentid) {
            this.studentData = `${this.getZml.login.studentid}, ${this.getZml.login.firstname} ${this.getZml.login.surname} {${this.getZml.login.grade})`
            this.curStudId = this.getZml.login.studentid
        }


    },
    watch:{
        meritid(n,o) {
            this.$cs.l('meritid watch ', n, o)
        }
    }
}
</script>