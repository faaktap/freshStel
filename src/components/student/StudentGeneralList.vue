<template>
<div>

<base-title-expand color="white" heading="GENERAL CLASS LIST">
   <p>
    Here is a list of all people you can mark as whatever
    If there are students missing, you need to edit the list you selected at class lists.
    <br>
    You can add a new student here, but it will only last for this session.
   </p>

  </base-title-expand>

<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row >
   Attendance for {{ listDetail }} <br> {{ checkList }}
    <v-spacer></v-spacer>
      <v-btn v-for="c in checkList" :key="c" small icon @click="reset(c)" class="ma-2" :title="'Mark all as ' + c"> c </v-btn>
      <v-btn icon small @click="showAdd = true" class="ma-2" title="Add a Student">
        <v-icon>mdi-database-plus </v-icon>
      </v-btn>
     <v-btn icon small class="ma-2" @click="showPhotoList = !showPhotoList" title="show Thumbnails"><v-icon>mdi-image</v-icon></v-btn>
    <v-back/>
 </v-toolbar>
</v-container>
<v-card>
  <v-card-title> List Entities </v-card-title>
  <v-card-text>
    <v-layout row wrap align-content-start justify-space-between class="ma-4">
      <p>still</p><p>to</p><p>add</p>
      <!-- <v-text-field v-model="listDetail.note"
        xs10 md6
        dense
        label="Note" />
      <v-text-field v-model="listDetail.userid"
        xs10 md6
        dense
        label="userid" />
      <v-text-field v-model="listDetail.placeid"
        xs10 md6
        dense
        label="placeid" />
      <v-text-field v-model="listDetail.listdate"
        xs10 md6
        dense
        label="listDate" /> -->
    </v-layout>
  </v-card-text>
</v-card>

<v-container class="mt-2" fluid>
 <v-row>
  <v-col cols="12" v-if="studentListReal && studentListReal.length">
   <v-card color="gray lighten-3" class="ma-2" id="x12345">
    <v-card-title v-if="'staffSurname' in listDetail" class="heading text-center">
        <v-flex class="float-right">
          <span v-for="s in studentTally" :key="s.name" class="ml-2 text-caption"> {{s.name}}:{{s.value}}, </span>
        </v-flex>
        Total : {{ studentItem.length }}
     </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" lg="3"
               v-for="(s,index) in studentListReal" :key="s.studentid">
           <v-card :color="studentCardColor(index)"
                  class="ma-1 pl-2"
                  @click="quickShow = s.studentid">
            <v-layout justify-space-between>
             <v-flex xs3 class="ma-1" v-show="showPhotoList==true">
              <z-show name="studentphoto" :id="s.studentid" height="88" />
             </v-flex>
             <span class="mt-2 ml-2 text-caption text-sm-body-2 text-md-body-1"> {{ index+1 }}  </span>
             <span class="ma-2">
              {{ s.surname }}, {{ s.firstname}} <span v-if="'grade' in s" class="text-caption"> {{ s.grade }}{{ s.gclass }} </span>
             </span>
             <span class="float-right mt-3 mr-4 text-caption">
              {{ studentItem[index] }}
             </span>
            </v-layout>
          </v-card>
            <v-card v-if="quickShow == s.studentid" color="gray lighten-3" class="ma-1" elevation="6">
            <v-radio-group dense v-model="studentItem[index]" class="ma-0 pl-5 pa-3">
            <v-radio v-for="c in checkList" :key="c"  :label="c"
                    :value="c" @click="quickShow=false"
                    class="ma-0 pa-0" />
           </v-radio-group>
          </v-card>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions class="ma-2">
      <v-btn @click="showAdd = true" class="ma-2">
        <v-icon>mdi-database-plus </v-icon>
        Add
      </v-btn>
      <v-spacer />
       <v-btn @click="commitChanges" class="ma-2" color="primary"><v-icon>mdi-content-save</v-icon> Commit Updates </v-btn>

     </v-card-actions>
    </v-card>
   </v-col>
  </v-row>

<v-dialog v-model="showAdd" width="450" max-width="550" :fullscreen="$vuetify.breakpoint.smAndDown">
    <v-card  class="ma-2" elevation="2">
    <v-card-title> Add Student to this list </v-card-title>
    <v-card-text>
      <student-lookup
           @dataEntered="handCapture"
           :searchMore="true"
      />
      <!-- stud = {{ stud }} -->
      <v-card v-if="'data' in stud" class="pa-2">
       Name : {{  stud.data.surname }}, {{ stud.data.firstname }}
       <br>
       Grade : {{ stud.data.grade }} {{  stud.data.gclass }}
      <v-card-actions>
        <v-btn v-if="'data' in stud" @click="addStudent" color="primary"> Add </v-btn>
        <v-spacer />
        <v-btn @click="showAdd = false"> Ignore </v-btn>
      </v-card-actions>
     <v-card-text class="text-caption ma-2" color="secondary">
      *warning : if you add a student here, it will be only for this session
     </v-card-text>

     </v-card>
     </v-card-text>
    </v-card>
</v-dialog>


</v-container>
</div>
</template>

<script>
import { getters } from "@/api/store"
import StudentLookup from '@/components/student/StudentLookup.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import ZShow from '@/components/base/ZShow.vue'
import VBack from '@/components/base/VBack.vue'
import { AttWork } from '@/components/student/AttWork.js'

export default {
    name:"StudentGeneralList",
    props:["studentList", "listDetail","checkList"],
    components:{
       ZShow
      ,VBack
      ,StudentLookup
      ,BaseTitleExpand
    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        gradeClass:{},
        showPhotoList:null,
        hover:null,
        hoverStart:null,
        showListPrint:false,
        classListHeader:'',
        studentItem: [],
        quickShow: false,
        //AttWork: AttWork
        stud:[],
        showAdd:false,
        addList:[],
        confirmSound:new Audio('sounds/Water drip.mp3'),
        refreshKey: 0
    }),
    computed: {
      studentTally() {
        console.log('StudentTally', this.refreshKey)
        if (this.studentItem.length < 1) return []
        let tally = []

        //Build zero value tally array
        this.checkList.forEach(e => tally.push({name:e, value:0} ))

        //loop thru studentItem array, and add 1 to tally for each checklist that match
        this.studentItem.forEach(e => {
          const idx = tally.findIndex(t => t.name == e)
          if (idx == -1 ) console.log('we have a problem', idx)
          //const i = tally.find(t => t.name == e)
          tally[idx].value += 1
        });
        return tally
      },
      studentListReal() {
        //this.refreshKey
        if (this.addList.length) {
          //return this.studentList.concat(this.addList) //did not work? might be refreshkey
          if (this.studentList.length) {
             return this.addList.concat(this.studentList)
          } else {
             return this.addList
          }
        } else {
          return this.studentList
        }
      }

    },
    methods:{
      reset(text) {
        this.studentItem.fill(text)
        console.log('fill=', this.studentItem)
        this.refreshKey++
      },
      commitChanges() {
        if (AttWork.saveGenList(this.studentListReal, this.studentItem, this.listDetail) == 'DONE')  this.confirmSound.play()
        this.$router.back()
      },
      studentCardColor(idx) {
        //we find the order - getting it from checklist.
        let ord = this.checkList.findIndex(e => e == this.studentItem[idx])
        //switch (this.studentItem[idx]) {
        switch (ord) {
          case 0: return "green lighten-1"
          case 1: return "blue lighten-2"
          case 2: return "pink lighten-1"
          case 3: return "red lighten-2"
          default : return 'gray lighten-4'
        }
      },
      handCapture(studentReceived) {
        console.log('handcap (received):', this.stud)
        this.stud = studentReceived
      },
      addStudent() {
        console.log('Adding in list:', this.stud.data)
        let obj = {}
        obj = this.stud.data
        this.addList.push(obj)
        this.studentItem.push(this.checkList[0])
        this.showAdd = false
      }
     },
    mounted() {
      console.log('GeneralClassList(mounted) : ', this.studentList)
      this.studentItem = Array.from({ length: this.studentList.length }, () => (this.checkList[0]))
      //console.trace()
    },
    watch: {
    }
}
</script>