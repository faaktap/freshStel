<template>
<!--https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno=20003-->
   <v-card v-if="studentList" :color="color" elevation="2">
     <!-- <div class="d-flex flex-no-wrap justify-space-between ma-2"> -->
      <v-layout row justify-space-between align-content-space-between>
      <div>
        <v-card-title class="font-weight-light wordbreak text-justify ma-3"> <!--xxclass="headline"-->
          {{ studentList.data.surname }} {{ studentList.data.firstname }}
        </v-card-title>
        <v-card-subtitle >
            <v-simple-table class="body-1 ma-2 pa-2">
            <tr><td v-if="!$vuetify.breakpoint.smAndDown"> admin &nbsp;</td><td> {{ studentList.data.studentid }} </td></tr>
            <tr><td v-if="!$vuetify.breakpoint.smAndDown"> id  &nbsp;</td> <td>{{ studentList.data.idno }} </td></tr>
            <tr><td v-if="!$vuetify.breakpoint.smAndDown"> name  &nbsp;</td> <td>{{ studentList.data.firstname }} {{ studentList.data.surname }}</td></tr>
            </v-simple-table>

        <v-chip class="ma-2 pa-2 text-heading-2" elevation="2" >
            {{ studentList.data.grade }}
            {{ studentList.data.gclass }}
            <!-- {{ myModel.PREVIOUSSCHOOL }}  state does not always change between students. deep is true is a pain-->
        </v-chip>
        </v-card-subtitle>
        </div>
        <v-spacer />
        <v-card class="ma-2 pa-2" height="10%" color="gray lighten-2" :title="studentList.idno" @click="displayCemisInfo">        </v-card>
        <v-card class="ma-2 pa-2" height="20%" color="gray lighten-3 blue--text" max-width="30%">   {{ studentList.data.note}}     </v-card>
        <v-card class="ma-2 pa-2" height="10%" color="gray lighten-2">        </v-card>

      <v-layout column align-content-center align-end >
      <v-avatar class="ma-3" size="210" tile>
       <v-img
         :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno='+studentList.data.studentid"
         style="float-right;border-radius:40px;"
         contain>
        </v-img>
      </v-avatar>
      </v-layout>
     <!-- </div> -->

      </v-layout>
     <v-card-text>
      <v-btn small @click="showTimetable = true" title="See the students's daily program">
       <v-icon> mdi-timetable</v-icon>
        TimeTable
      </v-btn>

       <v-dialog v-model="showTimetable" max-width="900">
         <v-btn small color="primary" @click="showTimetable = false"> close </v-btn>
         <calendar-student :studentid="studentList.data.studentid" />
       </v-dialog>

      <span class="text-caption float-right">
        High school De Kuilen Hoërskool
        <br>
       {{new Date()}}
      </span>
    </v-card-text>

<v-dialog v-model="showCemis"  :fullscreen="$vuetify.breakpoint.mobile" max-width="500" xwidth="auto">
  <v-card class="ma-2 pa-2">
    <zml-close-button @btn-click="showCemis = false" />
    <v-card-title> Student Cemis Previous School & Parent Information </v-card-title>
    <v-card-subtitle> {{ myModel.PREVIOUSSCHOOL }}</v-card-subtitle>
    <v-card-text>
    <!--<v-form-base
        autocomplete="off"
        id="cemisform"
        :model="myModel"
        :col=12
        @input="log"
    > -->
    <form-model
      :passed="myModel"
    />
    </v-card-text>
  </v-card>
</v-dialog>
    </v-card>
</template>

<script>
import CalendarStudent from '@/components/CalendarStudent.vue'
import FormModel from "@/components/vfbase/FormModel.vue"
//import  from "@/components/vfbase/VFormBase"
import zmlCloseButton from '@/components/zmlCloseButton.vue'
import { zmlFetch } from '@/api/zmlFetch';
export default {
    name:"StudentNameCard",
    components:{
                 CalendarStudent
               , FormModel
               , zmlCloseButton
               },
    props: ['studentList','color'],
    data: () => ({
      showTimetable:false,
      showCemis:false,
      myModel:{}
    }),
    methods: {
      displayCemisInfo() {
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = `SELECT * from prevschool where idno = "${ this.studentList.data.idno }"`
        zmlFetch(ts, this.assignModel)
      },
      assignModel(resp) {
        this.myModel = resp[0]
        this.showCemis = true
      }
      // goToStudent() {
      //   this.$router.push("/student/"+this.studentList.data.studentid)
      // }
    },
    mounted() {
      this.$cs.l('Mounted', this.$options.name)
    },
    watch:{

    }

}
</script>