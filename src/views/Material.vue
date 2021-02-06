<template>
<v-sheet color="grey lighten-5" class="ma-2">
  <v-row>
    <v-col xs-12 lg-4>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>
            <v-btn  small class="ml-1" v-if="kies" @click="kies=''" color="info"> Clear </v-btn>
            {{ heading }} {{ kies }}
            
        </v-toolbar-title>
       </v-toolbar>
    </v-col>
    <v-col xs-12 lg-8>
        <!--v-window flat color="primary"-->
        <v-layout row wrap>
        <v-flex flex-row v-for="grp in groupnames" :key="grp.id" justify-space-around
         xs-6 >
        <v-btn  small @click="goTo(grp.id)" class="mt-4 ma-2">
            {{ grp.name }}
        </v-btn>
        </v-flex>
        </v-layout>
        <!--/v-window-->
    </v-col>
    </v-row>
    <v-container fluid>
       <v-layout row wrap>
        <v-flex 
         v-for="item in filterByGroup" :key="item.itemid"
         flex-row
         justify-space-around
         xs-12
         >
         <material-item :item="item" :heading="heading" />

        </v-flex>
       </v-layout>
    </v-container>

</v-sheet>
</template>

<script>
import { getters } from "@/api/store"
import MaterialItem from "@/components/MaterialItem"
//import { zmlConfig } from '@/api/constants.js';
//import { zmlFetch } from '@/api/zmlFetch.js';
  export default {
    name: "Material",
    components: ( {MaterialItem} ),
    props: { heading: {default:"Grade"} },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        kies: '',
        groupnames:[],
        content:[]
    }),
    activated: function () {
    },
    computed: {
       filterByGroup() {
         console.log('kies = ', this.kies)
         if (this.kies == '') {
          return this.content;
         }
         let filterObj = {gid: this.kies}
         console.log('filterObj = ', filterObj)
         let selectedData = [...this.content]
         for (const grp in filterObj) {
           // For each property, filter the selected data to matching objects
           selectedData = selectedData.filter(o => o[grp] === filterObj[grp]);
         }
         // Use your filtered data
         return(selectedData)
       },
    },
    filters: {},
    methods: {
      goTo(where) {
        this.kies = where;
      },
      doLoadGrades() {
        this.groupnames = [{id:8,name: 'G08'}
                    ,{id:9,name: 'G09'}
                    ,{id:10,name: 'G10'}
                    ,{id:11,name: 'G11'}
                    ,{id:12,name: 'G12'}
                    ]
        this.groupnames.forEach(grp => {
          this.getZml.subjects.forEach(sub => {
             if (sub.subjectid > 0 && sub.subjectid < 98) {
                 let obj = {gid: grp.id
                           ,id: sub.subjectid
                           ,name: sub.subjectengname
                           ,title: sub.subjectname + ' ' + grp.id
                          }
                 this.content.push(obj)
             }
          })
         })
      },
      doLoadSubjects() {
         alert('Wait a bit....')
      },
      doLoadOther() {
        this.groupnames = [{id:8,name: 'AFR'}
                    ,{id:9,name: 'ENG'}
                    ,{id:10,name: 'KAKA'}
                    ,{id:11,name: 'DODO LEA'}
                    ,{id:12,name: 'FISIESE WETENSKAP'}
                    ]
        this.content = [{gid:8  ,id:1  ,name:'Boek1'}
                 ,{gid:9  ,id:2  ,name:'Folder 2 '}
                 ,{gid:9  ,id:3  ,name:'Een of ander ander lang ding'}
                 ,{gid:9  ,id:4  ,name:'nog iets'}
                 ,{gid:10 ,id:10 ,name:'Etc 2'}
                 ,{gid:11 ,id:11 ,name:'Etc 33'}
                 ,{gid:12 ,id:12 ,name:'Etc 44'}
        ]
      }
    },
    mounted: function () {
        alert('lenght of subjects = ', this.getZml.subjects.length)
        if (this.heading == "Grade") {
            this.doLoadGrades()
        } else if (this.heading == "G08") {
            this.doLoadSubjects()
        } else {
            this.doLoadOther()
        }
    },
    watch: { 
    }
  }
</script>

