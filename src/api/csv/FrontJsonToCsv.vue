<template>
 <v-container class="grey lighten-4" v-if="jsonData">
  <v-row no-gutters class="mb-6" >
    <v-col cols="12" class="heading-2 text-center"> 
      <v-card class="pa-2"  color="blue" >
          Click on all the columns you wish to display, print or export
      </v-card>
    </v-col>
      <!-- Col Kak Kak kakkies die 6 is twee rye, die 3 is 4 rye en die is 6 rye (12/2=6) Kak 
           EN dis belangrik om die "loop" op die col te sit - ander loop jy die checkbox BINNE in die col
      -->
    <v-col cols="6" md="3" lg="2" xl="1"    
             v-for="n in labels" 
            :key="n.id"          
    >
        <v-checkbox v-model="n.clicked"
                    hide-details
                    class="shrink mr-2"
                    :label="n.desc" >
        </v-checkbox>
    </v-col>
    <v-col cols="12">
         <v-text-field v-model="userHeader" label="Header" />
    </v-col>
  </v-row>
  <v-row no-gutters class="mb-6" >
    <v-col cols="12">
      <v-btn small class="pa-1 ma-1" @click="build"> Build </v-btn>
      <v-btn v-if="allowShowMassagedData" small class="pa-1 ma-1" @click="view"> View </v-btn>
  
  <json-to-csv v-if="finalJsonData"
              :json-data="finalJsonData"
              :labels="finalHeading"
              :show-labels="true"
              class="d-print-none"
              :csv-title="'Data List prepared by Kuilies Online'">
   <v-btn small class="pa-1 ma-1">
    Download this view for spreadsheet
   </v-btn> 
  </json-to-csv>
    </v-col>
  </v-row>
  <v-row>
   <v-col cols="12">

    <v-card v-if="showMassagedData">
     <zml-data-table :dataList="finalJsonData"
                   :userHeader="userHeader"
     />
    </v-card>
   </v-col>
  </v-row>
 </v-container>
</template>
  
<script>
import JsonToCsv from '@/api/csv/JsonToCsv.vue'
import zmlDataTable from '@/components/zmlDataTable.vue'
export default {
  name: "FrontJsonToCsv",
  components: { JsonToCsv , zmlDataTable},
  props: {
    jsonData: {
      type: Array,
      required: true
    },
    csvTitle: {
      type:String,
      default:"whatever"
    }
  },
  data: () => ({
    labels:[],
    finalHeading:{},
    finalJsonData:[],
    userHeader:"",
    allowShowMassagedData:false,
    showMassagedData:false
  }),
  destroyed () {
  },
  methods: {
    view() {
        //massage labels into v-data-table headings to display finalJson?
       this.showMassagedData = !this.showMassagedData
    },
    build() {
       this.finalJsonData = [] 
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
       this.labels.forEach(lab => {
               if (lab.clicked == true) {
                 test[lab.desc] = {title: lab.desc.toUpperCase() }
               }
       })
       this.finalHeading = test; //{...[test]}
       this.allowShowMassagedData = true
       this.showMassagedData = false
    },
    buildLabels() {
     console.log('start build labels')
     this.allowShowMassagedData = false
     this.labels = []
     this.finalHeading = {}
     this.finalJsonData = [] 
     if (this.jsonData && this.jsonData.length > 0) {
         let cnt=0
         Object.keys(this.jsonData[0]).forEach(ele => {
              this.labels.push( {id:cnt, desc:ele, clicked: false} )
              cnt ++;
         })
     }
    },
    handleClick () {
      alert('click')

    },
  },
  watch:{
      jsonData: function() {
        console.log('WATCHWATCHWATCHWATCHWATCHWATCHWATCHWATCH - FromJson - jsonData changed!!!!!!')
        this.buildLabels()
      }
  },
  mounted() {
     this.userHeader = this.csvTitle
     console.log('mount',this.$options.name, this.csvTitle)
     this.buildLabels()
  }
}
</script>
