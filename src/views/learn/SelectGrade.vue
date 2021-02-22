<template>

<v-sheet color="grey lighten-5" class="ma-2">
  <v-row>
    <v-col xs-12 lg-12>
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
  </v-row>
  <v-row>
    <v-col xs-12 lg-12>
        <v-layout wrap>
        <v-flex v-for="grp in groupnames" :key="grp.id" justify-space-around
         xs-6 >
         <template v-if="grp.id == gradeno">
            <v-btn  small @click="goTo(grp.id)" class="mt-4 ma-1" disabled color="red">
            {{ grp.name }} **
            </v-btn>            
          </template>
          <template v-else>
            <v-btn  small @click="goTo(grp.id)" class="mt-4 ma-1" color="primary">
            {{ grp.name }} 
             </v-btn>            
          </template>
        </v-flex>
        <v-flex>
          <v-text-field 
              v-model="search" 
              label="search" 
              clearable
              hint="search on subject" />
        </v-flex>
        <v-flex>
            <v-btn @click="bOrs = !bOrs" small icon > .. </v-btn>
        </v-flex>
        </v-layout>
    </v-col>
<!------------------------ DISPLAY ALL SUBJECTS  ------------------>
  </v-row>
    <v-container fluid>
       <v-layout row wrap>
        <v-flex 
         v-for="item in filterByGroup" :key="item.itemid"
         flex-row
         justify-space-around
         xs-12
         >
         
         <subject-display v-if="bOrs" language="E" :item="item" :heading="heading" />
         <subject-display2 v-else  language="E" :item="item" :heading="heading" />

        </v-flex>
       </v-layout>
    </v-container>
</v-sheet>
</template>

<script>
import { getters } from "@/api/store"
import SubjectDisplay from "@/components/learn/SubjectDisplay"
import SubjectDisplay2 from "@/components/learn/SubjectDisplay2"
import router from "@/router"
import { infoSnackbar } from '@/api/GlobalActions';
export default {
    name: "Material",
    components: ( {SubjectDisplay,SubjectDisplay2} ),
    props: [ 'heading', 'gradeno' ],
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        //kies: 8,
        groupnames:[],
        content:[],
        language:null,
        bOrs:false,
        kies:null,
        search:''
    }),
    async created() {
      this.kies = this.gradeno
    },
    activated: function () {
    },
    computed: {
      seegridType() {
        return this.x
      },
      filterByGroup() {
         if (this.kies == '') {
           if (this.search.length > 2 ) {
             //do the search
                let result = []
                this.content.forEach(ele => {
                    const str = JSON.stringify(ele).toLowerCase()
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
           return o.gid == filterObj.gid;
            });     
         
         if (this.search.length < 2 ) {
           return(selectedData)           
         } else {
           //do search 
                let result = []
                selectedData.forEach(ele => {
                    const str = JSON.stringify(ele).toLowerCase()
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
        router.push({ name: 'SelectGrade'  
                    , params:{heading:"Grade", gradeno:where }
                    , meta: {layout: "AppLayoutGray" }});  
      },
      doLoadGrades() {
        this.groupnames = [{id:8,name: 'Grade 8'}
                          ,{id:9,name: 'Grade 9'}
                          ,{id:10,name: 'Grade 10'}
                          ,{id:11,name: 'Grade 11'}
                          ,{id:12,name: 'Grade 12'}
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
            console.log('PUSH FOR PLATFORM!!!')
            router.push({name:'StudentHub' 
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
      filterByGroup() {
        if (this.filterByGroup.length == 0) {
          //infoSnackbar('no data in the folder')
        }
      }
    }
  }
</script>

