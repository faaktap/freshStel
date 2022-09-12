<template>
<!-- SEE ZMLDATATABLE for Printing zml-data-table- --->
 <v-container class="grey lighten-4" v-if="jsonData" fluid>
  <v-card color="white darken-1">
   <v-row no-gutters class="mb-6" >
    <!-- <v-col cols="1" class="heading-2 text-center">
      <v-btn class="float-left" icon title="select all" >
        <v-icon  color="green"> mdi-marker-check" </v-icon>
      </v-btn>
    </v-col> -->
    <v-col cols="12" class="heading-2 text-center">
      <v-card class="pa-2"  color="blue" >
          Click on all the columns you wish to display, print or export
      </v-card>
    </v-col>
    <!--v-col cols="1">
      <v-btn class="float-right" icon small title="select all" >
        <v-icon> mdi-checkbox-blank" </v-icon>
       </v-btn>
    </v-col-->

    <v-col cols="6" md="3" lg="2" xl="1"
           class="mx-2 pb-2"
           v-for="n in labels"
          :key="n.id"
    >
        <v-checkbox v-model="n.clicked"
                    hide-details
                    class="shrink mr-2"
                    :label="n.desc" >
        </v-checkbox>
    </v-col>
</v-row>
   </v-card>


<v-row>
  <v-col cols="12" md="6">
    <v-text-field v-model="userHeader" label="Heading/List Name" />
  </v-col>
  <v-col cols="12" md="6">
    <v-btn small @click="$emit('hideModal')" class="pa-1 ma-1 float-right"> Close </v-btn>
    <v-btn small class="float-right pa-1 ma-1" @click="activatePrint += 1"> Print </v-btn>
    <json-to-csv v-if="finalJsonData.length"
              :json-data="finalJsonData"
              :labels="finalHeading"
              :show-labels="true"
              class="d-print-none float-right"
              :csv-title="'Data List prepared by DKLearn'"
              >
      <v-btn small class="pa-1 ma-1">    Download    </v-btn>
    </json-to-csv>
  </v-col>
</v-row>

  <v-row>
   <v-col cols="12">
    <v-card v-if="finalJsonData.length">
     <zml-data-table
        :dataList="finalJsonData"
        :userHeader="userHeader"
        :doPrint="activatePrint"
        :footer="footer"
        :small="small"
     />
    </v-card>
   </v-col>
  </v-row>
 </v-container>
</template>

<script>
import JsonToCsv from '@/api/csv/JsonToCsv.vue'
import zmlDataTable from '@/components/zmlDataTable.vue'
import { ls } from "@/api/localStorage.js"
export default {
  name: "FrontJsonToCsv",
  components: {
    JsonToCsv
   ,zmlDataTable
  },
  props: {
    jsonData: {type: Array, required: true },
    csvTitle: {type: String, default:'whatever'},
    footer: {type: String, default:''},
    small: {type: Boolean, default: false},
    unique: {type: String, default:''},
  },
  data: () => ({
    labels:[],
    finalHeading:{},
    finalJsonData:[],
    userHeader:"",
    activatePrint:0,
  }),
  destroyed () {
  },
  methods: {
    build() {
      console.log(this.$options.name,' clicked for build')
       this.finalJsonData = []
       console.log(this.$options.name,'BUILD 1')
       this.jsonData.forEach(data => {
           let obj = {}
           this.labels.forEach(lab => {
               if (lab.clicked == true) {
                 obj[lab.desc] = data[lab.desc]
               }
           });
           this.finalJsonData.push(obj)
       })
       let test = {}
       console.log(this.$options.name,'BUILD 2')
       this.labels.forEach(lab => {
               if (lab.clicked == true) {
                 test[lab.desc] = {title: lab.desc.toUpperCase() }
               } /* else {  hide vir undef
                 test[lab.desc] = ''
               }*/
       })
       console.log(this.$options.name,'BUILD 3')
       this.finalHeading = test; //{...[test]}
       console.log(this.$options.name,'saving if : ' , this.unique)
       if (this.unique) {
          console.log('this.uniqe is true')
           // ls.save(this.unique, this.labels)
       }
       console.log(this.$options.name,'BUILD 4')
    },
    buildLabels() {
     console.log('building new labels')
     this.labels = []
     this.finalHeading = {}
     this.finalJsonData = []
     if (this.jsonData && this.jsonData.length > 0) {
         let cnt=0
         Object.keys(this.jsonData[0]).forEach(ele => {
              //if (cnt == 0 || ele.includes('id') || ele.includes('sortorder')) {
              if (ele.includes('id') || ele.includes('sortorder')) {
                this.labels.push( {id:cnt, desc:ele, clicked: false} ) //UNTICK or HIDE FIELD with ID in it
              } else {
                this.labels.push( {id:cnt, desc:ele, clicked: true} )
              }
              cnt ++;
         })
     }
    },
  },
  mounted() {
    console.log('mount', this.$options.name, this.csvTitle,this.small, this.unique)
    console.log('check if statement : ', this.unique , ls.test('zml'+this.unique))
    // if (this.unique && ls.test('zml'+this.unique)) {
    //   console.log('loading unique : ', 'zml' + this.unique,ls.load(this.unique))
    //   this.labels = ls.load(this.unique)
    // } else {
    //   console.log('Ask for buildlabels .. unique = ', this.unique)
       this.buildLabels()
    // }
    this.userHeader = this.csvTitle

  },
  watch:{
      // unique: function() {
      //   console.log(this.$options.name,'loading if : ' , this.unique)
      //   if (this.unique && ls.test(this.unique)) this.labels = ls.load(this.unique)
      // },
      jsonData: function() {
        this.buildLabels()
      },
      labels: {
        deep: true,
        handler(n,o) {
          console.log('labels handler: new',n,'old',o)
          this.build()
          console.log('build watch done')
        }
      }
  },
}
</script>
