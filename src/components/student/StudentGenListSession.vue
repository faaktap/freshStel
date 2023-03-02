<template>
<v-container fluid>
<base-title-expand color="white" heading="GENERAL LIST VIEW SESSION">
<p>We display all filled in homework lists, etc. for a selected event here. An event is created when an session is started, and a teacher, day, period, date
  and class was selected </p>
   <p>Shall we allow them to edit? Might be a bit tricky, maybe just change status and allow delete?</p>
   {{ session }}
  </base-title-expand>

<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row >
   <span class="d-none d-sm-block text-caption"> id:{{ session.id }}  </span>
   <v-spacer/>
   <span><strong>{{ session.genlistname }}</strong> on Day <strong>{{ session.day }}</strong> Period <strong>{{ session.period }}</strong> at room <strong> {{ session.roomName }}</strong> created by <strong>{{ userDisplay }}</strong>
   </span>
    <v-spacer/>
    <v-btn icon small class="ma-2" @click="showDuplicate = !showDuplicate" title="Duplicate List for today"><v-icon>mdi-content-duplicate</v-icon></v-btn>
    <v-btn icon small class="ma-2" @click="showPhotoList = !showPhotoList" title="show Thumbnails"><v-icon>mdi-image</v-icon></v-btn>
    <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
    <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>
    <v-back/>
 </v-toolbar>
</v-container>

<v-container class="mt-2" fluid>
 <v-row>
  <v-col cols="12" v-if="studentList && studentList.length">
   <v-card v-if="showAs=='card'" color="gray lighten-3" class="ma-2" id="x12345">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" lg="3"
               v-for="s in studentList"
              :key="s.studentid">
           <v-card :color="studentCardColor(s.status)" class="ma-1 pl-2">
             <v-card-title class="text-caption">
              <v-layout justify-space-between>
               <span>{{ s.surname }}, {{ s.firstname}}<span class="ma-2" v-if="'grade' in s"> {{ s.grade }}{{ s.gclass }} </span></span>
               <span> {{ s.studentid }}  </span>
              </v-layout>
             </v-card-title>
             <v-card-text>
             <v-layout justify-space-between>
               <v-flex xs3 class="ma-1" v-show="showPhotoList==true">
                 <z-show name="studentphoto" :id="s.studentid" height="88" />
               </v-flex>
             <span class="ma-2">
               {{ s.changedate.substr(0,16) }} D{{ s.dayno }} P{{ s.period }}
             </span>
              <v-btn small :xcolor="studentCardColor(s.status)" class="ma-2" @click="edit(s.listdataid)"> {{ s.status }} </v-btn>
            </v-layout>
             </v-card-text>

          </v-card>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions class="ma-2">
      <v-spacer />
       <v-btn @click="commitChanges" class="ma-2" color="primary"><v-icon>mdi-keyboard-backspace</v-icon> Done </v-btn>
     </v-card-actions>
    </v-card>
    <v-card v-if="showAs=='list'" color="gray lighten-3" class="ma-2">
      <v-simple-table>
        <thead>
        <tr class="ma-2">
          <th class="text-left">id</th>
          <th class="text-left">surname</th>
          <th class="text-left">name</th>
          <th class="text-left">adminno</th>
          <th class="text-left">date</th><th>period</th><th>status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="s in studentList" :key="s.studentid">
          <td class="ma-2"> {{ s.listdataid }} </td>
          <td class="ma-2"> {{ s.surname}} </td>
          <td class="ma-2"> {{ s.firstname}} </td>
          <td class="ma-2"> {{ s.studentid}} </td>
          <td class="ma-2"> {{ s.changedate.substr(0,16) }} </td>
          <td class="ma-2"> {{ s.period }} </td>
          <td class="ma-2">
             <v-btn @click="edit(s.listdataid)" small class="ma-2" :color="studentCardColor(s.status)"> {{ s.status }} </v-btn>
          </td>
          <td  class="ma-2" v-show="showPhotoList==true"><z-show name="studentphoto" :id="s.studentid" height="44" /> </td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card>
   </v-col>
  </v-row>
</v-container>
<v-dialog v-model="showEditDialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="300" scrollable >
  <v-card class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
    <v-card-title class="text-center"> Change status for
      <p class="text-center text--primary">{{ slRec.surname }}</p>
    </v-card-title>
    <v-card-text>
      <span>{{ slRec.firstname }}
      {{ slRec.listDatadate }}, <span class="text-caption">{{ slRec.grade }}{{ slRec.gclass }}</span></span>
      <v-radio-group dense v-model="slRec.status" class="ma-0 pl-5 pa-3">
            <v-radio v-for="c in checkList" :key="c"  :label="c"
                    :value="c"
                    class="ma-0 pa-0" />
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-btn small class="ma-2" @click="showEditDialog = false"> ignore </v-btn>
      <v-spacer />
      <v-btn small class="ma-2" color="primary" @click="save"> save </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="showDuplicate" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="400" scrollable>
  <v-card class="ma-2 pa-2">
    <v-card-title class="text-center justify-center" > Allow you to duplicate List </v-card-title>
    <v-card-subtitle class="text-center text-body-1 pink--text text--accent-2"> wil ask for period and day </v-card-subtitle>
    <v-card-text>
      Will then copy current status for all students to new list for today, so that you can update status.
      Ideal for measuring progress. See Visualize attendance under Student Lookup for idea.
      <p>Still in progress</p>
    </v-card-text>
  </v-card>
</v-dialog>

</v-container>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch.js'
import { getters } from "@/api/store"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import ZShow from '@/components/base/ZShow.vue'
import VBack from '@/components/base/VBack.vue'
import { AttWork } from '@/components/student/AttWork.js'
import { infoSnackbar } from '@/api/GlobalActions';
import { util } from '@/api/util.js'

export default {
    name:"StudentlistDataSession",
    props:["sessionid"],
    components:{
       ZShow
      ,VBack
      ,BaseTitleExpand
    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        studentList:[],
        showPhotoList:null,
        showListPrint:false,
        classListHeader:'',
        quickShow: false,
        refreshKey: 0,
        showAs: 'card',
        detail:'',
        showEditDialog:false,
        showDuplicate: false,
        slRec:{ listdataid:0, userid:'', placeid:'', period:'', dayno:'', studentid:''
              , sessionid:'', changedate:'', status:'', schoolno:'', surname:'',firtname:'', grade:'', gclass:''},
        checkList: ["Present","Absent", "Late", "Ignore"],
        originalStatus: '',
        session: {roomName: '', day: '', period: '', genlistname: '', id:0 }
    }),
    computed: {
      userDisplay() {
        if (this.studentList.length == 0) return "unknown"
        if (this.getZml.persMenemonic && this.getZml.persMenemonic.length) {
           let x = this.getZml.persMenemonic.findIndex(e => e.userid == this.studentList[0].userid)
           return this.getZml.persMenemonic[x].user_name
        } else {
          return "userid:" + this.studentList[0].userid
        }
      },
      studentTally() {
        if (this.studentList.length < 1) return []
        let tally = []
        this.studentList.forEach(e => {
          let idx = tally.findIndex(t => t.status == e.status)
          if (idx == -1 ) {
            tally.push({status:e.status, value:0})
            idx = tally.findIndex(t => t.status == e.status)
          }
          tally[idx].value += 1
        });
        return tally
      },
    },
    methods:{
      studentCardColor(status) {
        //we find the order - getting it from checklist.
        let ord = this.checkList.findIndex(e => e == status)
        return util.uniqueColor(ord) //this.doColor(ord)
      },
      save() {
         if (this.originalStatus == this.slRec.status) {
           console.log('no status change')
         } else {
           infoSnackbar('Updating....')
           AttWork.updateGenList(this.slRec)
         }
         this.showEditDialog = false
      },
      edit(listdataid) {
        this.slRec = this.studentList.find(e => e.listdataid == listdataid)
        //get the listData, and allow to change..
        if (this.slRec &&  'listdataid' in this.slRec) {
          this.showEditDialog = true
          this.originalStatus = this.slRec.status
        } else {
          console.log('some error on find slRec=', this.slRec,'SL=', this.studentList)
        }
      },
      commitChanges() {
         this.$router.back()
      },
      refresh() {
        let ts = {task: 'PlainSql',
               sql: `SELECT * \
               from dkhs_genlistdata a, dkhs_student s \
               where a.sessionid = '${this.sessionid}'\
                 and s.studentid = a.studentid`
             }
        zmlFetch(ts, this.loadlistDataData, this.errorLoading)
      },
      loadlistDataData(response) {
        this.loading = false
        this.studentList = response
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong loading general list student data:'+ err.error)
        console.log(err)
      },
     },
    mounted() {
      console.log('GenListViewSes(mounted) : ', this.sessionid)
      this.refresh()
       //External.4.3.Handbooks-20011
       //Room . Day . Per . listname - unique
       this.session =  util.sessionSplit( this.sessionid )
       // now we have the listname, this is scary - we assume we will find one object, and get the questions
       this.checkList = this.getZml.tickList.find(e => e.name == this.session.genlistname).questions

    },
    watch: {
    }
}
</script>