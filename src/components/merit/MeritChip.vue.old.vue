<template>
<v-container fluid>
  <v-card>
    <v-card-actions v-if="showAdd==false">
      <v-btn  @click="showAdd = !showAdd"> Add </v-btn>
    </v-card-actions>
    <template v-else>
  <small><i>{{ anotherTreeString }}</i></small>
  <v-chip-group mandatory column>
    <v-chip v-for="tag in meritFilter(idx0)"
            :key="tag.id"
            @click="chgSubMenu(0,tag)"
            outlined
            :title="tag.info"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider color="grey darken-4" inset />
  <v-chip-group mandatory column color="primary">
    <v-chip v-for="tag in meritFilter(idx1)"
            :key="tag.id"
            @click="chgSubMenu(1,tag)"
            outlined
            :title="tag.info"
            color="grey darken-1"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider inset color="green" />
  <v-chip-group mandatory column color="grey darken-2">
    <v-chip v-for="tag in meritFilter(idx2)"
            :key="tag.id"
            @click="chgSubMenu(2,tag)"
            outlined
            :title="tag.points"


    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider inset color="green" />
  <v-chip-group mandatory column color="grey darken-3" class="ma-2 pa-2" >
    <v-chip v-for="tag in meritFilter(idx3)"
            :key="tag.id"
            @click="chgSubMenu(3,tag)"
            outlined
            :title="tag.points"
            color="grey darken-1"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <!-- <v-divider class="mb-2" inset width="40%" /> -->
  <v-btn class="ma-2 pa-2" small v-if="meritAlloc.meritid" @click="allocate"> Allocate {{ anotherTreeString }} </v-btn>
    </template>
  </v-card>
  <!-- <merit-stepper v-if="meritInfo" :meritInfo="meritInfo" /> -->
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zData } from "@/api/zGetBackgroundData.js"
import { infoSnackbar } from "@/api/GlobalActions"
import { mer } from "@/components/merit/merit.js"
//import MeritStepper from "@/components/merit/MeritStepper"
  export default {
    name: 'MeritChip',
    props:['studentid'],
    components:{
      // MeritStepper
    },
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
        showAdd:false,
        idx0: 0, //start with first menu on v-chips
        idx1: -1,
        idx2: -1,
        idx3: -1,
        idx4: -1,
        aTable: getters.getState({ object: "gZml" }).meritLevel , // we keep all data from sql here
        selArr: [],
        curTag:'',
        meritInfo:'',
        meritAlloc:''
    }},
    computed: {
       meritFilter() {
         return id => this.aTable.filter(e => {
            if (e.back == id) {
              // console.log('Tr id,back.forward',id,e.back,e.forward)
              return true
            } else {
              // console.log('Fa-',id, e.back,e.forward)
              return false
            }
            })
       },
       anotherTreeString() {
        let answer = ''
        this.selArr.forEach(s => {
          const f = this.aTable.find(f => f.id == s )
          answer += f.title + (f.forward == 0 ? '.' : ', ')
        })
        return answer

       }
    },
    methods: {
      okWereGood(pData) {
        console.log('.....We do not need description here ', mer.descriptionForThisSession, pData.meritid, this.studentid, pData)
        this.$router.push({name: 'MeritStepper' , meta: {layout: "AppLayoutDefault" }
                          ,params: {meritid: pData.meritid
                                 , description: mer.descriptionForThisSession
                                 , studentid:this.studentid}
                          })
      },
      allocate() {
        if (!this.meritAlloc.meritid) {
          infoSnackbar('Cannot do an assignment yet - select options below')
          return
        }
        let id = this.selArr[this.selArr.length-1]
        let r = this.aTable.find(f => f.id == id )
        //alert('MeritID = we need to add it to meritlink if not exist' + r.meritid + this.treeString)
        this.meritAlloc = {meritid: r.meritid, desc: this.anotherTreeString, continue:this.okWereGood}
        mer.check(this.meritAlloc)
        // now we need to wait before we call meritstepper. - continue will do that..
        return
      },
      fixLevel(level,selectedtag) {
        //We worked with level 0 to 4 (max 5 levels)
          //console.log('fixlevel if needed level=',level,'tag=',selectedtag.title)
          while (this.selArr.length > level) {
            this.selArr.pop()
            console.log('after pop we have:', this.selArr)
          }
          this.selArr.push(selectedtag.id)
      },
      chgSubMenu(i,tag) {
        // console.log('chgSubMenu  :array length and i ', i, tag)
        this.fixLevel(i,tag)
        //console.log('chgSubMenu  :after level', i, tag)
        if (tag.forward == 0) {
          //we reach a workable tag
          //infoSnackbar('we reached the end - ask for student, and do assignment here - can enter many students at a time, or import?')
          let id = this.selArr[this.selArr.length-1]
          let r = this.aTable.find(f => f.id == id )
          this.meritAlloc = {meritid: r.meritid, desc: this.anotherTreeString}
          return
        }
        this.meritAlloc = {}
        //Get the record, where our id is in back list
        let id = this.aTable [this.aTable.findIndex(e => e.id == tag.forward)]
        if (i == 0) {
            this.idx1 = id.back
            this.idx2 = -1
            this.idx3 = -1
            this.selArr = []
            this.fixLevel(i,tag)
        }
        if (i == 1) { this.idx2 = id.back }
        if (i == 2) { this.idx3 = id.back }
        if (i == 3) { this.idx4 = id.back }

        // console.log('tag = ',i, tag.id, this.idx0,this.idx1,this.idx2,this.idx3, this.idx4)

        this.curTag = tag
       },
       addLevel(i,tag) {
        // console.log('addLevel  :array length and i ', i, this.selArr.length)
        if (this.selArr.length > i) this.selArr.pop()
        this.selArr.push(tag.id)
       },
       initialize(data) {
        this.aTable = data
        this.getZml.meritLevel = data
       },
    },
    mounted() {
      this.$cs.l('Mounted', this.$options.name, 'Stud?=',this.studentid)
      if (this.getZml.meritLevel.length > 10) {
           this.aTable = this.getZml.meritLevel
      } else {
        let sqlStatement = `SELECT * from dkhs_meritlevel`
        zData.loadSql(this.loading, sqlStatement, this.initialize)
      }
    },

  }
</script>