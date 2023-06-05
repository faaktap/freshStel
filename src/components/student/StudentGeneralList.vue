<template>
<div>

<base-title-expand color="white" heading="GENERAL CLASS LIST">
   <p>
    Here is a list of all people you can mark as whatever
    If there are students missing, you need to edit the list you selected at class lists.
    <br>
    You cannot add a new student here, you will need to fix your classlist.
    <br>If a student is marked as ignored, it is same as absent - no data will be saved.
   </p>
   <p>{{ info }} </p>
  </base-title-expand>

<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row >
   <span><strong> {{ listname }} </strong> <span>for</span> {{ staffSurname }}</span>
    <v-spacer />

      <v-btn icon small class="ma-2" @click="showPhotoList = !showPhotoList" color="primary" title="show Thumbnails"><v-icon>mdi-image</v-icon></v-btn>
      <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn>
    <v-back/>
 </v-toolbar>
</v-container>
<v-card>
  <v-card-text>
    <v-layout row wrap align-content-start justify-space-between class="ma-2">
    <!-- <span class="ma-2"><strong> List Functions </strong></span> -->
    <v-btn v-for="c in checkList" :key="c"
           x-small xicon
           color="primary"
           @click="reset(c)"
           class="ma-2" :title="'Mark all as ' + c">
      <v-icon small>mdi-lock-reset</v-icon> {{c}} </v-btn>
    </v-layout>
  </v-card-text>
</v-card>

<v-container class="mt-2" fluid>
 <v-row>
  <v-col cols="12" v-if="studentListReal && studentListReal.length">
   <v-card color="gray lighten-3" class="ma-2" id="x12345" elevation="0">
    <v-card-title class="heading text-center">
      <v-layout wrap justify-space-around>
      <v-card v-for="(s,i) in studentTally" :key="s.name"
            class="ml-2 text-sm-caption pa-1"
            elevation="0"
            :color="cardColor(i)"
            :title="`You have ${s.value} students marked as ${s.name}`"
      >
         {{s.name}} : {{s.value}}
      </v-card>
      <span> Total : {{ studentItem.length }} <span class="text-caption gray--text text--lighten-3"> {{ refreshKey }} </span> </span>
      </v-layout>
     </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" lg="3"
               v-for="(s,index) in studentListReal" :key="s.studentid">
           <v-card :color="studentCardColor(index)"
                  class="ma-1 pl-2"
                  @click="quickShow == false ? quickShow = s.studentid : quickShow = false">
            <v-layout justify-space-between>
             <v-flex xs3 class="ma-1" v-show="showPhotoList==true">
              <z-show name="studentphoto" :id="s.studentid" height="88" />
             </v-flex>
             <span class="mt-2 ml-2 text-caption text-sm-body-2 text-md-body-1"> {{ index+1 }}  </span>
             <span class="ma-2">
              {{ s.surname }}, {{ s.firstname}}
               <span v-if="'grade' in s" class="text-caption"> {{ s.grade }}{{ s.gclass }} </span>
             </span>
             <span class="float-right mt-3 mr-4 text-caption">
              {{ studentItem[index] }}
             </span>
            </v-layout>
          </v-card>
          <v-card v-if="quickShow == s.studentid" color="gray lighten-3" class="ma-1" elevation="6">
           <v-radio-group row dense v-model="studentItem[index]" class="ma-0 pl-5 pa-3">
            <v-radio v-for="c in checkList" :key="c"  :label="c"
                    :value="c" @click="quickShow=false"
                    class="ma-0 pa-0" />
           </v-radio-group>
          </v-card>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions class="ma-2">
      <!-- <v-btn @click="showAdd = true" class="ma-2">
        <v-icon>mdi-database-plus </v-icon>
        Add
      </v-btn> -->
      <v-spacer />
       <v-btn @click="commitChanges" class="ma-2" color="primary"><v-icon>mdi-content-save</v-icon> Commit Updates </v-btn>

     </v-card-actions>
    </v-card>
   </v-col>
  </v-row>

</v-container>
</div>
</template>

<script>
import { getters } from "@/api/store"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import ZShow from '@/components/base/ZShow.vue'
import VBack from '@/components/base/VBack.vue'
import { AttWork } from '@/components/student/AttWork.js'
import { printJSON } from "@/api/zmlPrint.js"
export default {
    name:"StudentGeneralList",
    props:["studentList"
        , "generalDetail"
        , "checkList"],
    components:{
       ZShow
      ,VBack
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
        stud:[],
        confirmSound:new Audio('sounds/Water drip.mp3'),
        refreshKey: 0
    }),
    computed: {
      info() {
        if (this.studentItem.length < 1) return ''
        return this.generalDetail
      },
      listname() {
        if (this.studentItem.length < 1) return ''
        return 'LIST : ' + this.generalDetail.listname
      },
      staffSurname() {
        if (this.studentItem.length < 1) return ''
        return this.generalDetail.staffSurname + '(' + this.getZml.login.username + ')'
      },
      studentTally() {
        if (this.studentItem.length < 1) return []
        let tally = []

        //Build zero value tally array - we fill it below
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
        //We made it computed, incase we want to add some.
        return this.studentList
      },
    },
    methods:{
      studentListPrint() {
        let p = []
        let cnt = 0
        this.studentList.forEach(e => {
          console.log(this.studentItem[cnt], this.studentItem[cnt] != 'Ignore')
          if (this.studentItem[cnt] != 'Ignore') {
             const o = e
             o.cgrade = e.grade + e.gclass
             o.status = this.studentItem[cnt]
             cnt++
             o.no = cnt
             p.push(o)
          } else {
             cnt++
          }
        })
        return p
      },
      doPrint() {
        let header = [{value:'no'},{value:'surname'},{value:'firstname'}
                    ,{value:'studentid'},{value:'cgrade'}, {value:'status'}]
        printJSON(this.studentListPrint(), header, `<center><strong> ${ this.listname } </strong> <span>for</span> ${ this.staffSurname }</span></center>`)
      },
      reset(text) {
        this.studentItem.fill(text)
        this.refreshKey++
      },
      commitChanges() {
        if (AttWork.saveGenList(this.studentListReal, this.studentItem, this.generalDetail) == 'DONE')  this.confirmSound.play()
        this.$router.back()
      },
      studentCardColor(idx) {
        //we find the order - getting it from checklist.
        let ord = this.checkList.findIndex(e => e == this.studentItem[idx])
        return this.cardColor(ord)
      },
      cardColor(ord) {
        switch (ord) {
          case 0: return "green lighten-1"
          case 1: return "blue lighten-2"
          case 2: return "gold lighten-3"
          case 3: return "red lighten-2"
          case 4: return "gold"
          case 5: return "amber lighten-1"
          case 6: return "pink"
          case 7: return "deep-purple"
          case 8: return "brown lighten-1"
          case 9: return "blue-grey lighten-4"
          default : return 'gray lighten-4'
        }
      }
     },
    mounted() {
      //console.log('GeneralClassList(mounted) : ', this.studentList.length)
      let ignoreIdx = this.checkList.findIndex(e => e.toLowerCase() == 'ignore')
      if (ignoreIdx == -1) ignoreIdx = 0
      this.studentItem = Array.from({ length: this.studentList.length }, () => (this.checkList[ignoreIdx]))
    },
    watch: {
    }
}
</script>