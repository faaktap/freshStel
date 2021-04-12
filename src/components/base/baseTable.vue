<template>
  <v-container v-if="tHeader.length && tList.length">
   <v-row>
    <v-col cols="12">
     <h1 class="text-center grey--text"> {{ tHeading }} </h1>
    </v-col>
    <v-col cols="12">   
     <v-card color="deep-purple">
       <v-container fluid>
         <v-layout color="gray--text text--lighten-5">
         <v-flex>
        <v-text-field
           
           v-model="search"
           append-icon="mdi-magnify"
           label="Search"
           single-line
           hide-details
         >
         </v-text-field>
         </v-flex>
         </v-layout>
         <v-row dense>
           <v-col cols="12">
             <v-card color="blue lighten-5" class="ma-1">
              <div>
                  <v-card class="text-center ma-2 pa-2" color="primary gray--text text--lighten-3"> {{ bHeading }} </v-card>
                <v-data-table
                 v-if="tList && tHeader.length > 0"
                 :headers="tHeader"
                 :items="tList"
                 :items-per-page="5"
                 :search="search"
                  class="elevation-1"
                 color="purple lighten-3"
                 multi-sort
                >
                </v-data-table> 
               </div>
              </v-card>
           </v-col>
         </v-row>
       </v-container>
     </v-card>
    </v-col>
  </v-row>
 </v-container>   
</template>


<script>
export default {
    name:"BaseTable",
    props: ['tList', 'tHeading', 'bHeading'],
    data: () => ({
        curItem:{},
        search:null,
        tableLoading:false,
        tHeader: []      
    }),
    methods:{
      buildHeaders() {
        if (!this.tList || this.tList.length == 0) {
            console.log('list not passed yet')
            return
        }
        this.tableLoading = true
        this.tHeader = []
        Object.keys(this.tList[0]).forEach(name => {
            this.tHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1)
                 , value: name} )
        })
        console.log('HEADERS : ', this.tHeader)
        this.tableLoading = false
      },
    },
    mounted: function() {
        console.log('BTable : Mount')
    },
    watch: {
        tList: {
            deep:true,
            handler() {
               this.buildHeaders()
            }
        }
    }
}
</script>

