<template>
<v-container fluid>
    <small><i>{{ treeString }}</i></small> {{ selArr }}
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
  <v-divider color="yellow" />
  <v-chip-group mandatory column>
    <v-chip v-for="tag in meritFilter(idx1)"
            :key="tag.id"
            @click="chgSubMenu(1,tag)"
            outlined
            :title="tag.info"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider inset color="yellow" />
  <v-chip-group mandatory column>
    <v-chip v-for="tag in meritFilter(idx2)"
            :key="tag.id"
            @click="chgSubMenu(2,tag)"
            outlined
            :title="tag.points"

    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider inset color="yellow" />
  <v-chip-group mandatory column>
    <v-chip v-for="tag in meritFilter(idx3)"
            :key="tag.id"
            @click="chgSubMenu(3,tag)"
            outlined
            :title="tag.points"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider inset color="yellow" />
  {{ treeString.slice(-1)}}
  <v-btn v-if="treeString.slice(-1) == '.'"> Allocate </v-btn>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zData } from "@/api/zGetBackgroundData.js"
import { infoSnackbar } from "@/api/GlobalActions"
  export default {
    name: 'MeritMenu',
    components:{},
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
        idx0: 0, //start with first menu on v-chips
        idx1: -1,
        idx2: -1,
        idx3: -1,
        idx4: -1,
        aTable: getters.getState({ object: "gZml" }).meritLevel , // we keep all data from sql here
        treeString: '', //display our selection
        selArr: [],
        headers: [{ text:"the name", value: "title", align: "left"},
                 //{ text:"back", value: "back", align: "left"},
                 //{ text:"forward", value: "forward", align: "left"},
                 { text:"the info", value: "description", align: "left"},
                 { text:"action", value: "action", align: "left"}],
    }},
    mounted() {
        let sqlStatement = `SELECT * from dkhs_meritlevel`
        zData.loadSql(this.loading, sqlStatement, this.initialize)
    },
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
    },
    methods: {
      chgSubMenu(i,tag) {
        this.addLevel(i,tag)
        if (tag.forward == 0) {
          //we reach a workable tag
          infoSnackbar('we reached the end - ask for student, and do assignment here - can enter many students at a time, or import?')
          return
        }
        //Get the record, where our id is in back list
        let id = this.aTable [this.aTable.findIndex(e => e.id == tag.forward)]
        if (i == 0) {
            this.idx1 = id.back
            this.idx2 = -1
            this.idx3 = -1
            this.selArr = []
            this.addLevel(i,tag)
        }
        if (i == 1) { this.idx2 = id.back }
        if (i == 2) { this.idx3 = id.back }
        if (i == 3) { this.idx4 = id.back }

        console.log('tag = ',i, tag.id, this.idx0,this.idx1,this.idx2,this.idx3, this.idx4)

       },
       addLevel(i,tag) {
        console.log('array length and i ', i, this.selArr.length)
        if (this.selArr.length > i) this.selArr.pop()
        this.selArr.push(tag.id)
        this.treeString = ''
        this.selArr.forEach(e => {
            const f = this.aTable.find(f => f.id == e )
            this.treeString += f.title + (f.forward == 0 ? '.' : ', ')
        })

        console.log('pushed')
       },
       meritClick(e) {
        console.log(e)
       },
       initialize(data) {
        if (this.getZml.meritLevel.length < 10) {
           this.aTable = data
        } else {
           this.aTable = this.getZml.meritLevel
        }
       },
    }
  }
</script>
