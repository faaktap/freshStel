<template>
  <v-autocomplete 
        v-model="searchResult"
        :value="searchText" 
        :search-input.sync="search" 
        :items="list"
        :item-text="itemDisplay" 
        item-value="desc" 
        return-object 
        outlined
        dense
        label="Student Surname"
        :loading="loadingItems"
        autofocus>
   <v-dialog v-model="loadids">
    <v-layout><v-card>
     <v-card-title> Add a list of ID's to allocate</v-card-title>
     <v-card-text>
      <v-textarea v-model=IDList />
     </v-card-text>
     <v-card-actions>
       <v-btn @click="submitIDList"> ClickMe </v-btn>
     </v-card-actions>
     </v-card></v-layout>
    </v-dialog>
  </v-autocomplete>
</template>


<script>
import { zmlFetch } from '@/api/zmlFetch';
export default {
   name: "StudentLookup",
   props: {
     searchMore: {type: Boolean, default:false}
   },
   data: () => ({
    searchResult: '',
    search: "",
    loadingItems: false,
    list:[{desc:"Type"}
         ,{desc:"Student"}
         ,{desc:"Surname"}],
    loadids:false,
    IDList:"Add a list of ID's in here"
  }),
  mounted() { 
      //this.list = this.somedefaults;

   },

  computed: {
    searchText() {
      return this.list[0] || ''
    },
    itemDisplay() {
        return "desc";
    },
  },

  methods: {
      submitIDList() {
          this.$emit("idsEntered", this.IDList);
          this.loadingItems = false;
          this.loadids = false;
      },
      loadNew(pSrch) {
         //Do we still have data to fullfill search criteria?
         if (this.loadingItems) { console.log('already busy'); return;}
         if (this.pSrch == '') { console.log('nothing here..'); return;}
         let found = 0;
         if (this.list.length > 0) {
             found = this.list.findIndex(elem => elem.desc.substring(0,pSrch.length) === pSrch);
         }
         if (found < 1) {
           this.loadingItems = true;
           this.loadOurListWithNewValues(pSrch);
         }
    },
    loadOurListWithNewValues(pSrch){
      let ts = {}
      if (this.searchMore) {
        ts = {task: 'getstudentother', like:pSrch};
      } else {
        ts = {task: 'getstudentsurname', surname:pSrch};
      }
      zmlFetch(ts, this.listLoadDone, this.listLoadError);
    },
    listLoadDone(response){
        this.list = [];
        for (let i=0; i < response.length; i++) {
            let row = response[i];
            let obj = {}
            if (this.searchMore) {
               obj = {desc: row.studentid + ' ' + row.grade + ' ' + row.gclass + ' ' + row.idno + ' ' + row.surname + ', ' + row.firstname, data: response[i]};
            } else {
               obj = {desc: row.grade + ' ' + row.idno + ' ' + row.surname + ', ' + row.firstname, data: response[i]};
            }
            this.list.push(obj);
        }
        this.loadingItems = false;
    },
    listLoadError(response) {
        this.loadingItems = false;
        alert(response);
    },
    magic() {
      this.loadids = true;
    },
    debounce(fn, delay) {
      let timeOutId;
      return function(...args) {
        if(timeOutId) {
          clearTimeout(timeOutId);
        }
        timeOutId = setTimeout(() => {
          fn(...args);
        },delay);
      }
    },
  },

  watch: {
    searchResult(v) {
      if (this.searchResult.data) this.$emit("dataEntered", v);
    },
    search(n, o) {
      // at some point search is set to null
      // reset it to the old value
      if (n === null) this.search = o;
      if (this.search[0] == ':') { this.search = ''; this.magic(); return; }
      if (n && n.length > 2 && this.loadingItems == 0) {
          //this.debounce(this.loadNew, 200)(n, this);
          this.loadNew(n);
      }
    }
  }
}
</script>