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
        label="Personel Surname"
        :loading="loadingItems"
        autofocus>
  </v-autocomplete>
</template>


<script>
import { zmlFetch } from '@/api/zmlFetch';
export default {
   name: "PersonelLookup",
   props: {},
   data: () => ({
    searchResult: '',
    search: "",
    loadingItems: false,
    list:[{desc:"Type"}
         ,{desc:"Personel"}
         ,{desc:"Surname"}],
  }),
  mounted() { 
      //this.list = this.somedefaults;
      console.log('PL MOUNTED')
   },

  computed: {
    searchText() {
      console.log('method:searchText');
      return this.list[0] || ''
    },
    itemDisplay() {
        return "desc";
    },
  },

  methods: {
      loadNew(pSrch) {
         //Do we still have data to fullfill search criteria?
         if (this.loadingItems) { console.log('already busy'); return;}
         if (this.pSrch == '') { console.log('nothing here..'); return;}
         let found = 0;
         if (this.list.length > 0) {
             found = this.list.findIndex(elem => elem.desc.substring(0,pSrch.length) === pSrch);
         }
         console.log('loadnew : ', pSrch, found);
         if (found < 1) {
           this.loadingItems = true;
           this.loadOurListWithNewValues(pSrch);
         }
    },
    loadOurListWithNewValues(pSrch){
      let ts = {task: 'getpersonelsurname', surname:pSrch};
      zmlFetch(ts, this.listLoadDone, this.listLoadError);
    },
    listLoadDone(response){
        if (response.error) {
            this.loadingItems = false;
            return;
        }
        this.list = [];
        for (let i=0; i < response.length; i++) {
            let row = response[i];
            let obj = {desc: row.name + ' ' + row.surname + ', ' + row.email, data: response[i]};
            this.list.push(obj);
        }
        this.loadingItems = false;
    },
    listLoadError(response) {
        this.loadingItems = false;
        alert('ERROROROR ON PL:',response);
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
      this.$emit("dataEntered", v)
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