<template>

<v-sheet color="grey lighten-5" class="ma-2">
  <v-row>
    <v-col xs-12 lg-12>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>
            <v-btn  small class="ml-1" v-if="kies" @click="kies='';search='';getZml.grade=''" color="info"> Clear </v-btn>
            <template v-if="!kies"> Every </template> 
            {{ heading }} {{ kies }}
        </v-toolbar-title>
        <v-spacer />
        <!--v-text-field dense  v-model="search" label="search" max-width="55"/-->
        
       </v-toolbar>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" lg="12">
        <v-layout wrap>
          <grade-display-short displaySize="medium" @input=goTo />    
        <!--v-flex v-for="gr in grades" :key="gr.id" justify-space-around
         xs-6 >
         <template v-if="gr.id == gradeno">
            <v-btn  small @click="goTo(grp.id)" class="mt-4 ma-1" disabled color="red">
            {{ gr.name }} **
            </v-btn>            
          </template>
          <template v-else>
            <v-btn  small @click="goTo(gr.id)" class="mt-4 ma-1" color="primary">
            {{ gr.name }} 
             </v-btn>            
          </template>
        </v-flex-->
        <v-flex>
          <v-text-field 
              v-if="!bOrs && getZml.grade"
              v-model="search" 
              label="search" 
              clearable
              hint="search on subject" />
        </v-flex>
        <v-flex>
            <v-btn title="Different View" @click="bOrs = !bOrs" small icon > .. </v-btn>
        </v-flex>
        </v-layout>
    </v-col>
<!------------------------ DISPLAY ALL SUBJECTS  ------------------>
  </v-row>
  <v-row v-if="bOrs && getZml.grade" >
    <v-col cols="12">
      <subject-display-short 
         @clickedsubject=clickedOnSubject() />
    </v-col>
  </v-row>

    <v-container fluid v-if="!bOrs && getZml.grade">
       <v-layout row wrap>
        <v-flex 
         v-for="item in subjectsFilter" :key="item.itemid"
         flex-row
         justify-space-around
         xs-12
         >
         <subject-display2   language="E" :item="item" :heading="heading" />

        </v-flex>
       </v-layout>
    </v-container>
</v-sheet>
</template>

<script>
import { getters } from "@/api/store"
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
//import SubjectDisplay from "@/components/learn/SubjectDisplay"
import SubjectDisplay2 from "@/components/learn/SubjectDisplay2"
import SubjectDisplayShort from '@/components/learn/SubjectDisplayShort'
import router from "@/router"
import { infoSnackbar  } from '@/api/GlobalActions'; //,timeoutPromise
import GradeDisplayShort from '@/components/learn/GradeDisplayShort.vue'
export default {
    name: "Material",
    components: { //SubjectDisplay
                   SubjectDisplay2
                 , SubjectDisplayShort
                 , GradeDisplayShort
                },
    props: [ 'heading', 'gradeno' ],
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        content:[],
        latest:[],
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
      subjectsFilter() {
        //this.$cs.l('subjectFilter',this.kies, this.latest.length, this.content.length)
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
         //this.$cs.l('size now..', selectedData.length)
         if (this.search.length < 2 ) {
           //make it only updated here...
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
      loadLatestChangesOnSubjects() {
        let ts = {}
        ts.task = 'getLatestContentBySubject'
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.latestSubjects, this.loadError)
      },
      latestSubjects(response) {
        response.forEach(ele => {
          this.latest.push(ele)
        })
        //this.$cs.l('Done with latest', this.latest.length, response)
        this.doLoadSubjects()
      },
      goTo(where) {
        this.kies = where;
        //this.$cs.l('GO----TO',where)
        this.getZml.grade = where
        router.push({ name: 'SelectGrade'  
                    , params:{heading:"Grade", gradeno:where }
                    , meta: {layout: "AppLayoutGray" }});  
      },
      clickedOnSubject() {
        this.$router.push({name:'StudentHub' 
                     , params:{currentSubjectID:this.getZml.subjectid, grade:this.getZml.grade}
                     , meta: {layout: "AppLayoutGray" }})
      },
      doLoadSubjects() {
        //this.$cs.l('loading subjects', this.latest.length)
        this.getZml.grades.forEach(grp => {
          this.getZml.subjects.forEach(sub => {
             if (sub.subjectid > 0 && sub.subjectid < 400) {
                 let obj = {gid: grp.id
                           ,id: sub.subjectid
                           ,name: sub.description
                           ,nameafr: sub.beskrywing
                           ,title: sub.shortname + ' ' + grp.id
                          }
                  if (this.latest.length) {
                    let idx = this.latest.findIndex(x => 
                    x.id == obj.id && grp.id == x.grade
                    ////this.$cs.l(`xx = $(x.id) == $(obj.id) && $(grp.id) == $(x.grade)`)
                    )
                    //this.$cs.l(idx)
                    if (idx != -1) this.content.push(obj)
                  } else {
                    this.content.push(obj)
                  }
                  
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
        //this.$cs.l('What is heading????', this.heading)
        if (this.heading == "Grade") {
            //this.$cs.l('We have a grade!')
            //this.$cs.l('load latest changes and subjects..')
            this.loadLatestChangesOnSubjects()
        } else {
            this.getZml.login.gradeLastChosen = this.getZml.grade;
            let loginDetails = JSON.stringify(this.getZml.login)
            localStorage.setItem('login', loginDetails);
            //this.$cs.l('PUSH FOR PLATFORM!!!')
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
        //this.$cs.l('MAT: Mounted')
    },
    watch: { 
    }
  }
</script>

