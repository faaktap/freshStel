<template>
<v-sheet color="grey lighten-5" class="ma-2">
  <v-row>
    <v-col xs-12 lg-4>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>
            <v-btn  small class="ml-1" v-if="kies" @click="kies='';search=''" color="info"> Clear </v-btn>
            <template v-if="!kies"> Every </template>
            {{ heading }} {{ kies }} 
        </v-toolbar-title>
        <v-spacer />
        <!--v-text-field dense  v-model="search" label="search" max-width="55"/-->
        <v-btn @click="editSubjects" v-if="getZml.login.type == 'teacher'"> Edit Subjects </v-btn>
       </v-toolbar>
    </v-col>
    <v-col xs-12 lg-8>
        <!--v-window flat color="primary"-->
        <v-layout wrap>
        <v-flex flex-row v-for="grp in groupnames" :key="grp.id" justify-space-around
         xs-6 >
        <v-btn  small @click="goTo(grp.id)" class="mt-4 ma-1">
            {{ grp.name }}
        </v-btn>
        </v-flex>
        <v-flex>
          <v-text-field v-model="search" label="search" />
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
    props: { heading: {default:"Grade"}, passedGradeNo: {default: 12} },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        //kies: 8,
        groupnames:[],
        content:[],
        language:null,
        kies:8,
        search:''
    }),
    async created() {
      console.log('kies, passed', this.kies, this.passedGradeNo)
      this.kies = this.passedGradeNo
    },
    activated: function () {
    },
    computed: {
       filterByGroup() {
         if (this.kies == '') {
           if (this.search.length > 2 ) {
             //do the search
                let result = []
                this.content.forEach(ele => {
                    const str = JSON.stringify(ele).toLowerCase()
                    console.log('stringify :', str)
                    if ( str.includes(this.search.toLowerCase()) ) {
                      result.push(ele)
                    }
                })
                return result

           } else {
             return this.content;
           }
         }

         let filterObj = {gid: this.kies}
         let selectedData = [...this.content].filter(o => {
           //console.log(o.gid, filterObj.gid)
           return o.gid == filterObj.gid;
            });     
         
         if (this.search.length < 3 ) {
           return(selectedData)           
         } else {
           //do search 
                let result = []
                selectedData.forEach(ele => {
                    const str = JSON.stringify(ele).toLowerCase()
                    console.log('stringify11111 :', str)
                    if ( str.includes(this.search.toLowerCase()) ) {
                      result.push(ele)
                    }
                })
                return result
         }
       },
    },
    filters: {},
    methods: {
      editSubjects() {
          infoSnackbar('not implemented yet')
      },
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
                           ,name: sub.description
                           ,nameafr: sub.beskrywing
                           ,title: sub.shortname + ' ' + grp.id
                          }
                 this.content.push(obj)
             }
          })
         })
      },
    },
    mounted: function () {
        console.log('MAT: Mounted')
        if (this.getZml.subjects.length < 2) {
          infoSnackbar("No Data to display - Have you logged in?");
          return;
        }
        if (this.heading == "Grade") {
            this.doLoadGrades()
        } else {
            this.getZml.login.gradeLastChosen = this.getZml.grade;
            let loginDetails = JSON.stringify(this.getZml.login)
            localStorage.setItem('login', loginDetails);
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
      passedGradeNo(n) {
        this.kies = n
      },
      filterByGroup() {
        if (this.filterByGroup.length == 0) {
          //infoSnackbar('no data in the folder')
        }
      }
    }
  }
</script>

