<template>
  <v-container v-if="tHeader.length && tList.length">
   <v-row >
    <v-col cols="12" v-if="tHeading">
     <h1 class="text-center grey--text"> {{ tHeading }} </h1>
    </v-col>
    <v-col cols="12">
     <v-card xcolor="deep-purple">
      <v-container fluid>
       <v-layout color="gray--text text--lighten-5">
        <v-flex>
         <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
         />
        </v-flex>
       </v-layout>
       <v-row dense>
        <v-col cols="12">
         <v-card color="blue lighten-5" class="ma-1">
           <div>
             <v-card class="text-center ma-2 pa-2" color="primary gray--text text--lighten-3">
               SL {{ bHeading }}
             </v-card>
              <v-data-table
                 v-if="tList && tHeader.length > 0"
                 :headers="tHeader"
                 :items="tList"
                 :items-per-page="itemsPerPage"
                 :search="search"
                 color="purple lighten-3"
                 @click:row="clickOnTableRow"
                 class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>ClassList Table</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                 </template>
              </v-data-table>
            </div>
          </v-card>
         </v-col>
        </v-row>
      </v-container>
     </v-card>
    </v-col>
  </v-row>

<v-dialog v-model="showEdit" :fullscreen="$vuetify.breakpoint.mobile" max-width="600" width="auto">
  <v-card>
    <v-card-title class="text-caption">
      {{ curItem.surname }}, {{ curItem.firstname }}  {{ curItem.grade }} - {{ curItem.studentid }}
    </v-card-title>
    <v-card-text>
      <quick-edit
        :arrList="editable"
        @sendback="receiveParams"
      />
    </v-card-text>
  </v-card>
</v-dialog>
</v-container>
</template>

<script>
import QuickEdit from "@/components/homework/QuickEdit.vue"
export default {
    name:"StudentList",
    components:{QuickEdit},
    props: {tList: {default:[{heading:'', value:''}]}
          , tHeading: {default:'tHeading'}
          , bHeading: {type:String, default:'bHeading'}
          , itemsPerPage: {type:Number, default:20}
    },
    data: () => ({
        curItem:{},
        search:null,
        tableLoading:false,
        showEdit:false,
        tHeader: [],
        editable: [],
        expanded:[],
        singleExpand:true
    }),
    methods:{
      receiveParams(e) {
        console.log('kammakastig receiveParms',e)
        this.$emit('changes',e, this.curItem.studentid)
      },
      loadDetails({ item }) {
        console.log('kammakastig load details',item)
      },
      clickOnTableRow(p1) {
          this.curItem = this.tList.find(ele => ele.contentid == p1.contentid)
          console.log('we clicked on tablerow in studentlist')
          this.showEdit = true
          this.$emit('bonga',this.curItem)
      },
      buildHeaders() {
        if (!this.tList || this.tList.length == 0) {
            return
        }
        this.tableLoading = true
        this.tHeader = []
        this.editable = []
        //Object.keys(this.tList[0]).forEach(name => {
        Object.entries(this.tList[0]).forEach(([name, value]) => {
          if (name == 'jdoc' || name == 'jdocstructure') return;
          this.tHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1)
                 , type:'text'
                 , value: value
                 })
          if (name != 'surname' && name != 'firstname' && name != 'grade' && name != 'studentid' && name != 'id') {
            this.editable.push({heading: name})
          }
        })
        console.log('this.editable ................', this.editable. this.tList[0])
        this.tableLoading = false
      },
    },
    mounted: function() {
    },
    // watch: {
    //     tList: {
    //         deep:true,
    //         handler() {
    //            this.buildHeaders()
    //         }
    //     }
    // }
}
</script>

