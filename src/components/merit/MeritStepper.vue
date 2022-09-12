<template>
<v-container fluid class="mb-2">
<v-layout align-center justify-center>
  <v-card class="ma-2" max-width="500">
    <v-card-title>
        Allocation a  merit to a student
    </v-card-title>
        <v-card xs6 class="ma-2">
         <v-card-text v-if="(getZml.login.studentid && getZml.login.type == 'student') || studentid">
            MERIT : <strong>{{ meritDescription }}</strong><br>
            FOR : <strong> {{ studentData }} </strong>
         </v-card-text>
         <v-card-text v-else>
           <student-lookup @dataEntered="studentFound"
                            :searchMore="true"
                            small
           />
         </v-card-text>
        </v-card>

        <v-divider />

        <v-card class="ma-2">
            <v-flex xs12 class="ma-2">
             <p>Provide the teacher who will evaluate this merit</p>
             <!-- p={{ persMenemonic}}<br>{{getZml.login}}<br>{{ getZml.persMenemonic }} -->
             <auto-sel-pers id="zyx4"
                            asLabel="Inspector/Teacher"
                            :initialValue="getZml.login.username"
                            :itemObj="getZml.persMenemonic"
                            v-model="persMenemonic"
             />
            </v-flex>
            <v-flex xs12 class="ma-2">
                <p>Provide the date the merit was created/issued</p><br>
                <base-date v-model="meritDte"  label="Provide the Date it happened" instructions="FA" />
            </v-flex>
        </v-card>
        <v-card-actions>
         <v-btn small color="primary" @click="save"> save </v-btn>
         <v-spacer />
         <v-btn small color="warning" @click="goBack"> Cancel </v-btn>
        </v-card-actions>
  </v-card>
</v-layout>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { mer } from "@/components/merit/merit.js"
import { infoSnackbar } from "@/api/GlobalActions"
import StudentLookup from "@/components/student/StudentLookup.vue"
import AutoSelPers from '@/components/AutoSelPers.vue'
import BaseDate from "@/components/base/BaseDate.vue"
export default {
    name: 'MeritStepper',
    props: ['meritid', 'studentid', 'description'],
    components:{
        StudentLookup
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
        persMenemonic: '',
        meritDte:Intl.DateTimeFormat('af-ZA').format(new Date())
    }},
    methods:{
        initialize(pData, pDesc, persMenemonic) {
            this.$cs.l('initialize  ', pData, pDesc,persMenemonic)
            //alert('now we get studentid and staff and date')
            this.meritDescription = pDesc
            if (!this.persMenemonic) this.persMenemonic = persMenemonic
        },
        goBack() {
            this.$router.back()
        },
        studentFound(e) {
          this.studentData = e
          this.curStudId = e.data.studentid
          this.loadStudent(e.data)

        },
        loadStudent(data) {
           this.$cs.l('loadStudent  ', data)
           this.studentData = `${data.studentid}, ${data.firstname} ${data.surname} {${data.grade})`
        },
        save() {
            if (!(this.meritDte && this.persMenemonic && this.curStudId)) {
                infoSnackbar('We need a student, a teacher, a date and a meritid')
                return
            }
            mer.add({meritid: this.meritid
                   , desc: mer.descriptionForThisSession
                   , pers: this.persMenemonic
                   , studentid: this.curStudId
                   , confirm: this.persMenemonic == this.getZml.login.username ? true : false
                   , date: this.meritDte
                   , continue:this.goBack}
            )

        },


    },
    mounted() {
        this.$cs.l('Mounted', this.$options.name, this.$route.params)
        this.meritDescription = this.description
        this.persMenemonic = this.getZml.login.username
        if (this.meritid) {
            mer.check({meritid: this.meritid, desc: this.meritDescription, continue:this.initialize})
        }
        if (this.getZml.login.studentid && this.getZml.login.type == "student") {
            this.studentData = `${this.getZml.login.studentid}, ${this.getZml.login.firstname} ${this.getZml.login.surname} {${this.getZml.login.grade})`
            this.curStudId = this.getZml.login.studentid
        } else {
            this.persMenemonic = this.getZml.login.username
            if (this.studentid) {
               this.curStudId = this.studentid
               console.error('Local Loginned in teacher:', this.persMenemonic, this.getZml.login.username)
               mer.getStudent(this.curStudId, this.loadStudent)
            } else {
               //We need to get a student from form
               console.log('OUR STUDENTID IS UNDEFILED IN MERITSTEPPER!!!!!!')
            }
        }
    },
    watch:{
        meritid(n,o) {
            this.$cs.l('meritid watch ', n, o)
        }
    }
}
</script>