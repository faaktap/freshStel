<template>
  <v-container fluid v-if="tHeader.length && tList.length">
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
             @input="$emit('search', search)"
             append-icon="mdi-magnify"
             label="Search"
             single-line
             hide-details
          />
         </v-flex>
         </v-layout>
         <v-row dense>
           <!-- <v-btn x-small @click="fontsize -= 1"> - {{ fontsize }} </v-btn>
           <v-btn x-small @click="fontsize += 1"> + {{ fontsize }} </v-btn> -->
           <v-col cols="12">
             <v-card color="blue lighten-5" class="ma-1">
              <div>
                <v-card class="text-center ma-2 pa-2" color="primary gray--text text--lighten-3"> {{ bHeading }} </v-card>
                <v-data-table
                 v-if="tList && tHeader.length > 0"
                 :headers="tHeader"
                 :items="tListFilter"
                 :items-per-page="itemsPerPage"

                  class="elevation-1 mytable"
                 color="purple lighten-3"
                 :style="'font-size:' + fontsize + 'px  !important'"
                 multi-sort
                 @click:row="clickOnTableRow"
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
//import { util } from "@/api/util.js"
export default {
    name:"BaseTable",
    //props: ['tList', 'tHeading', 'bHeading'],
    props: {tList:    {}
          , tHeading: { default:'tHeading'}
          , bHeading: {type:String, default:'bHeading'}
          , itemsPerPage: {type:Number, default:20}
    },
    data: () => ({
        curItem:{},
        search:null,
        tableLoading:false,
        tHeader: [],
        fontsize:12
    }),
    computed: {
      tListFilter() {
        // if (this.search) {
        //    let x = util.findMultipleSearch(this.tList, this.search)
        //    console.log('thgis is x now.', x, !x, !!x)
        //    //return x
        // }
        return this.tList
      }
    },
    methods:{
      fontchange() {
        this.fontsize -= 1
      },
      clickOnTableRow(p1) {
          let trow = this.tList.find(ele => ele.contentid == p1.contentid)
          this.$emit('bonga',trow)
      },
      buildHeaders() {
        if (!this.tList || this.tList.length == 0) {
            return
        }
        this.tableLoading = true
        this.tHeader = []
        Object.keys(this.tList[0]).forEach(name => {
          if (name == 'gclass' || name == 'jdoc' || name == 'jdocstructure') return;
            this.tHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1)
                 , type:'text'
                 , value: name
                 })
        })
        this.tableLoading = false
      },
    },
    mounted: function() {
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

<style scoped>
/*
.mytable {
    font-size: 0.575rem;
    height: 33px;

}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
    font-size: 0.575rem;
    height: 33px;
}
*/
</style>