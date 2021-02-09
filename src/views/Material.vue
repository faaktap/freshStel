<template>
<v-sheet color="grey lighten-5" class="ma-2">
  <v-row>
    <v-col xs-12 lg-4>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>
            <v-btn  small class="ml-1" v-if="kies" @click="kies=''" color="info"> Clear </v-btn>
            <template v-if="!kies"> Every </template>
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
         <material-item language="A" :item="item" :heading="heading" />

        </v-flex>
       </v-layout>
    </v-container>
</v-sheet>
</template>

<script>
import { getters } from "@/api/store"
import MaterialItem from "@/components/MaterialItem"
import router from "@/router"
import { infoSnackbar } from '@/api/GlobalActions';
export default {
    name: "Material",
    components: ( {MaterialItem} ),
    props: { heading: {default:"Grade"} },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        kies: 8,
        groupnames:[],
        content:[],
        language:null,
    }),
    activated: function () {
    },
    computed: {
       filterByGroup() {
         if (this.kies == '') {
          return this.content;
         }
         let filterObj = {gid: this.kies}
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
                           ,nameafr: sub.subjectafrname
                           ,title: sub.subjectname + ' ' + grp.id
                          }
                 this.content.push(obj)
             }
          })
         })
      },
    },
    mounted: function () {
        if (this.getZml.subjects.length < 2) {
          infoSnackbar("No Data to display - Have you logged in?");
          return;
        }
        if (this.heading == "Grade") {
            this.doLoadGrades()
        } else {
            router.push({name:'Platform' 
                       ,params:{currentSubjectID:this.getZml.subjectid, grade:this.getZml.grade}
                       ,meta: {layout: "AppLayoutGray" }})

            //Here we could push to current tree (files layout), or we could list lcontent
            /*
            router.push({name:'LearnTree' 
                       ,params:{currentSubjectID:this.getZml.subjectid, grade:this.getZml.grade}
                       ,meta: {layout: "AppLayoutGray" }})
            */
        }
    },
    watch: { 
    }
  }
</script>

