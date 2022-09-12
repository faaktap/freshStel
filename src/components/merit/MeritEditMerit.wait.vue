<template>
<v-container fluid>
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  <v-form-base
    autocomplete="off"
    id="myform"
    :model="myModel"
    :col=12
    @click="clickOnRow"
    @blur="clickOnRow"
    >
    <template #slot-bottom-myform>
      <v-col cols="12"> <v-card class="slot"> <v-card-actions>
        <v-btn color="success" class="mr-4" @click="clickOnRow"> Save </v-btn>
        <v-spacer />
      </v-card-actions></v-card></v-col>
    </template>
  </v-form-base>
  <base-title-expand color="purple" heading="Merit Select System 1"><p>
    One way of displaying the merit system, it's a bit tricky to go back only one. So the back button start over.
    Do we want to show the learners what the points for each entry is?</p>
  </base-title-expand>
  <h2>{{ treeString }}</h2>
   <v-data-table  v-if="aTable.length"
     :headers="headers"
     :items="tableItemFilter"
     @click="meritClick"
     @dblclick:row.prevent="meritDblClick"
     mobile-breakpoint="0"
   >
    <template v-slot:[`footer.page-text`]>
       <v-btn v-if="index != 0"
             @click="index = 0"
             align="center" class="ma-2 pa-2" >
          back
      </v-btn>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <div class="float-right">
         <v-btn class="mx-1" x-small  @click="retrieveForDelete(item)">
             <v-icon small color="red" class="my-1">mdi-delete</v-icon>
             <template v-if="!$vuetify.breakpoint.mobile"> Delete </template>
         </v-btn>
         <v-btn class="mx-1" x-small  @click="retrieveForEdit(item)">
             <v-icon small color="green" class="my-1">mdi-circle-edit-outline</v-icon>
             <template v-if="!$vuetify.breakpoint.mobile"> Edit </template>
         </v-btn>
         </div>
      </template>

   </v-data-table>

  <base-title-expand color="purple" heading="Merit Select System 2">
  <p>Another way of displaying the merit system, all the info is avaible in smaller area.</p>
  </base-title-expand>

  <v-chip-group mandatory>
    <v-chip v-for="tag in meritFilter(idx0)"
            :key="tag.id"
            @click="chgSubMenu(0,tag)"
            outlined
            title="tag.info"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider />
  <v-chip-group mandatory>
    <v-chip v-for="tag in meritFilter(idx1)"
            :key="tag.id"
            @click="chgSubMenu(1,tag)"
            outlined
            title="tag.info"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider />
  <v-chip-group mandatory column>
    <v-chip v-for="tag in meritFilter(idx2)"
            :key="tag.id"
            @click="chgSubMenu(2,tag)"
            outlined
            title="tag.info"

    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>
  <v-divider />
  <v-chip-group mandatory column>
    <v-chip v-for="tag in meritFilter(idx3)"
            :key="tag.id"
            @click="chgSubMenu(3,tag)"
            outlined
            title="tag.info"
    >
     <template v-if="tag.title"> {{ tag.title }} </template>
    </v-chip>
  </v-chip-group>

<base-title-expand color="purple" heading="Some Tests">
   <v-treeview :items="tree"></v-treeview>
  {{ meritFilter(0) }}

<v-divider />
idx0={{idx0}}--{{ meritFilter(idx0) }}
<v-divider />
idx1={{idx1}}--{{ meritFilter(idx1) }}
<v-divider />
idx2={{idx2}}--{{ meritFilter(idx2) }}
<v-divider />
<v-btn @click="treeCreate()"> treeCreate </v-btn>
</base-title-expand>
</v-container>
</template>

<script>
import { zData } from "@/api/zGetBackgroundData.js"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import { infoSnackbar } from "@/api/GlobalActions"
import VFormBase from "@/components/vfbase/VFormBase"
  export default {
    name: 'MeritMenu',
    components:{ BaseTitleExpand, VFormBase },
    data () {
      return {
        index: 0,  //start with first menu, on v-datatable
        idx0: 0, //start with first menu on v-chips
        idx1: -1,
        idx2: -1,
        idx3: -1,
        aTable: [], // we keep all data from sql here
        treeString: '', //display our selection
        headers: [{ text:"the name", value: "title", align: "left"},
                 //{ text:"back", value: "back", align: "left"},
                 //{ text:"forward", value: "forward", align: "left"},
                 { text:"the info", value: "description", align: "left"},
                 { text:"action", value: "action", align: "left"}],
        test: [],
        tree: [],
        myModel: {
         title:null,
         description:null,
        },
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
       tableItemFilter() {
        // console.log('iFilt=', this.index)
        if (!this.aTable.length) return []
          return this.aTable.filter(e => {
                    if (e.back == this.index) { return true } else { return false }
                 })
       },
    },
    methods: {
      clickOnRow(e1,e2) {
        this.$cs.l('clicked on row inside row', e1,e2)
      },

      retrieveForDelete(i) {
        this.myModel.description = i.description
        this.myModel.title = i.title
        console.log('del:',i)
        },
      retrieveForEdit(i) {
        console.log('edit',i)
        this.myModel.description = i.description
        this.myModel.title = i.title
        },
      chgSubMenu(i,tag) {
        if (tag.forward == 0) {
          //we reach a workable tag
          infoSnackbar('we reached the end - ask for student, and do assignment here - can enter many students at a time, or import?')
        }
        //Get the record, where our id is in back list
        let id = this.aTable [this.aTable.findIndex(e => e.id == tag.forward)]

        if (i == 0) { this.idx1 = id.back; this.idx2 = -1; this.idx3 = -1 }
        if (i == 1) {
          this.idx2 = id.back
        }
        if (i == 2) {
          this.idx3 = id.back
        }
        console.log('tag = ',i, tag.id, this.idx0,this.idx1,this.idx2,this.idx3)


      },
       backClick() {
         this.treeString = ''
       },
       meritDblClick(e,i) {
        //going forward
        this.treeString += i.item.title + ', '
        if (i.item.forward == 0) {
          infoSnackbar('we reached the end - ask for student, and do assignment here - can enter many students at a time, or import?')
          return
        }
        let id = this.aTable [this.aTable.findIndex(e => e.id == i.item.forward)]
        if (id == -1) alert('we have a problem with out indexes')
        this.index = id.back
       },
       meritClick(e) {
        console.log(e)
       },
       initialize(data) {
        this.aTable = data
       },
       treeCreate() {
        this.test = []
        this.aTable.forEach(e => {
          if (this.test.length == 0) {
            this.test.push({id:e.back, name:e.title+' '+e.id, children:[{id: e.id, back: e.back, forward: e.forward, name: e.title}]})
            return
          }
          let found = false
          this.test.forEach(ee => {
            if (ee.id == e.back) {
              // We found a grp that will work, add it as a child
              ee.children.push({id: e.id, back: e.back, forward: e.forward, name: e.title})
              found = true
              return
            }
          })
          if (found == true) return
          this.test.push({id:e.back, name:e.title + ' ' + e.id, children:[{id: e.id, back: e.back, forward: e.forward, name: e.title}]})
        })
        this.tree = []
        this.aTable.forEach(e => {
          if (e.back == 0) {
            this.tree.push({id: e.id, back: e.back, forward: e.forward, name:e.title, children:[]})
          }
        })
        this.tree.forEach(t => {
          console.log(t.forward)
          // we need to get the children where t.forward(100) is eq to back
          let b = this.test.findIndex(e => e.id === t.forward)
          console.log(b, t.forward, t.back, t.id, 'idx=',b)
          if (b == -1) console.log('we did not find it!!!!!')
          t.children.push(...this.test[b].children)

        })

       }
    }
  }
</script>
