<template>
<v-container fluid class="play">
<v-layout v-if="functionList"
          row wrap justify-space-between
          class="ma-1 pa-1"
>
    <base-search  id="thesearch"
                  style="flex-grow: 8"
                  v-show="functionSearch"
                  class="ma-2 text-uppercase"
                  v-model="search"
                  @clear="search=''"
    />

    <v-card outlined
            :class="small ? 'ma-1 pa-0' : 'ma-2 pa-2'"
            v-for="l in searchList" :key="l.functionid"
    >

      <v-btn v-if="!info"
             text
            :title="l.description"
            :x-small="small"
            :small="!small"
             @click="loadPage(l)"
      >
        <v-icon :color="cardColor(l.functionaccess)" class="mr-2">{{ l.icon }}</v-icon>
         {{ l.functionname }}
      </v-btn>

      <v-card-text v-else :class="small ? 'ma-1 pa-0' : 'ma-2 pa-2'">
        <!-- here we show imore info about the button -->
        <v-btn
           :x-small="small" :small="!small"
           :title="l.tip"
           @click="loadPage(l)"
        >
         <v-icon :color="cardColor(l.functionaccess)" class="mr-2"> {{ l.icon }}</v-icon>
         {{ l.functionname }}
        </v-btn>

        <p class="text-center ma-2 pa-2">
         <span class="text-h5 ma-2 pa-2">{{ l.shortname }} </span>
         <br>
         <i  v-show="l.description"><small>Title:</small>{{ l.description }}</i><br>
         <span v-show="l.tip"><small>Tip:</small>{{ l.tip }}</span>
        </p>


      </v-card-text>

   </v-card>
</v-layout>
</v-container>
</template>

<script>
import { getters } from "@/api/store";
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
import { doStuff } from '@/api/buttons'
import { ls } from "@/api/localStorage.js"
import baseSearch from '@/components/base/baseSearch.vue'
export default {
  name: "MenuListNew",
  props: ['info','small', 'type', 'functionSearch'],
  components:{baseSearch},
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      showMore:false,
      buttons: false,
      loading:false,
      search:''
  }),
  computed:{
    searchList() {
        if (!this.search) return this.functionList
        return this.filterByValue(this.functionList, this.search)
        //return this.filterByValue(this.getZml.functions, this.search)
    },
    functionList() {
        if(!this.getZml.functions.length) return []
        if (this.type == 'all') return this.getZml.functions
        if (this.type == 'admin') this.getZml.functions.filter(e => e.functionaccess == 'teacher' || e.functionaccess == 'admin')
        return this.getZml.functions.filter(e => e.functionaccess == this.type)
    },
    studentList() {
        if(!this.getZml.functions.length) return []
        return this.getZml.functions.filter(e => e.functionaccess == 'student')
    },
    teacherList() {
        if(!this.getZml.functions.length) return []
        return this.getZml.functions.filter(e => e.functionaccess == 'teacher' || e.functionaccess == 'admin')
    },
    adminList() {
        if(!this.getZml.functions.length) return []
        return this.getZml.functions.filter(e => e.functionaccess == 'admin')
    }

  },
  methods:{
       filterStringArray(array, value) {
          return array.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
       }    ,
       filterByValue(array, string) {
        //Clean out any null values
        const good = array.map((obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null)));
        //filter on array, with some and includes
        let ret = good.filter(o => {
             return Object.keys(o).some(k => {
                return o[k].toLowerCase().includes(string.toLowerCase() )
              })
        })
        return ret
       },
       showInfo(des) {
        infoSnackbar(des)
       },
       cardColor(type) {
           switch (type) {
               case 'teacher' : return "purple lighten-2"
               case 'student' : return "blue lighten-1"
               case 'admin' : return "green darken-2"
               default : return "orange darken-2"
           }
       },
       loadPage(what) {
           //console.log(what)
            if (doStuff(this.$router,what.payload) == 0) {
                //console.log(what)
                if (what.payload.substr(0,4).toLowerCase() == 'http') {
                    window.open(what.payload,'_' + 'ko_external')
                }
            }
        },
   },
   mounted() {
    this.$cs.l('Mounted',this.$options.name)
   },

   created() {
    this.$cs.l('Created',this.$options.name)
    if (this.getZml.functions.length == 0) {
       errorSnackbar('function not loaded yet!')
       this.getZml.functions = ls.load('zmlFuncs')
    }
   },
   watch:{
       baseSearch() {
        document.getElementById("theSearch").focus()
       },
       functionSearch() {
        if (this.functionSearch == false) this.search = ''
       }
   }
};
</script>

<style scoped>
      .play {
       background-color: rgb(38, 81, 131);
       opacity: 0.8;
       xxbackground-image:  linear-gradient(30deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(150deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(30deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(150deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(60deg, #444cf777 25%, transparent 25.5%, transparent 75%, #444cf777 75%, #444cf777), linear-gradient(60deg, #444cf777 25%, transparent 25.5%, transparent 75%, #444cf777 75%, #444cf777);
      }
      .bgcontainer {
        height: 100vh;
        width: 50%;
        background-color: #ea4335;
        transition: all 0.70s ease-in-out;
      }
      .bgcontainer:hover{
        width: 100%
      }
      .weird {
       background-color: #e5e5f7;
       opacity: 0.8;
       background-image:  linear-gradient(30deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(150deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(30deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(150deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(60deg, #444cf777 25%, transparent 25.5%, transparent 75%, #444cf777 75%, #444cf777), linear-gradient(60deg, #444cf777 25%, transparent 25.5%, transparent 75%, #444cf777 75%, #444cf777);
       background-size: 20px 35px;
       background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
      }
</style>