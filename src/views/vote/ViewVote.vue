<template>


 <div>    
<v-row>
    <v-col xs-12 lg-12>
       <v-toolbar flat color="primary" dark class="mb-4">
        <v-toolbar-title>
            {{ curCam.campaignname }}
        </v-toolbar-title>
        <v-spacer />
 <v-btn small @click="refreshCandidates"> <v-icon> mdi-refresh </v-icon> refresh </v-btn>
       </v-toolbar>
    </v-col>
  </v-row>
  
     
    <input-box v-if="getZml.login.isAuthenticated"
               v-model="showRegisterModal"
               @dataEntered="doSomething" 
    ></input-box>

<!-- show the voting list -->
    <view-box v-if="getZml.login.isAuthenticated"
              v-model="showVoteList" 
             @reset="clearVoteList"
             @submit="submitVoteList" 
             :candidateList="candidateList">
    </view-box>


<!--  SELECT the GRADE and SEARCH on SURNAME -->
    <v-container fluid v-if="getZml.login.isAuthenticated">   
     <v-row align="center">
      <v-col xs12 md6>
          <v-select
            label="Grades"
            v-model="gradesSelected"
            :items="gradeItems"
            chips
            deletable-chips
            multiple
            solo
            clearable=""
            hint="Select a grade"
            placeholder="filter on grade"
          ></v-select>
      </v-col>
      <v-col xs12 md6>
       <v-text-field
            label="Search" placeholder="Search on Surname"
            v-model="searchInfo" solo clearable
            @click:clear="searchInfo = ''"></v-text-field>
           
      </v-col>

<!--          LIST OF VOTES? 
xxxxx {{ campaignid }}  {{ curCam.status }} {{getZml.voteList}} && {{ getZml.voteList.length}} -->
      <v-col xs12 v-if="curCam.status=='vote' && getZml.voteList && getZml.voteList.length > 0">
        <v-badge overlap
                :visibility="getZml.voteList.length" 
                 title="Prefect Votes">
         <span slot="badge">{{ getZml.voteList.length }}</span>
         <v-icon large color="grey lighten-1">mdi-vote</v-icon>         
        </v-badge>
        <v-badge overlap :visibility="getZml.seniorList.length" title="Senior Council Votes">
         <span slot="badge">{{ getZml.seniorList.length }}</span>
         <v-icon large color="grey lighten-1">mdi-vote-outline</v-icon>         
        </v-badge>
        <v-btn fab @click="viewVoteList">
            <v-icon large color="grey lighten-1">mdi-vote-outline</v-icon>
        </v-btn>
      </v-col>

<!-- ALLOW INSERT IF STATUS IS OPEN -->      
      <v-col xs12 v-if="curCam.status=='open'">
        <v-btn @click="insertCandidate" class="mb-5 pa-1">
            <v-icon large color="grey lighten-1">mdi-badge-account-outline</v-icon> Add Yourself as Candidate
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

<!--                  LIST OF CANDIDATES -->
  <v-container fluid> 
   <v-layout row wrap>
    <v-btn v-scroll="onScroll"  v-show="scrollFab"  fab dark  fixed bottom right color="primary" @click="toTop">
    <v-icon>mdi-arrow-up-circle</v-icon>
    </v-btn>      
    <v-flex 
      v-for="candidateItem in filteredItems" 
      :key="candidateItem.rvlselid"      
      flex-row
      justify-space-around
      xs-12
      > 

      <candidate-item 
           :theItem="candidateItem"
           @voteing="voteItem"
           @seniorvoteing="seniorVoteItem"
      />

    </v-flex>
   </v-layout>  
   
  </v-container>   
 </div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";   
import { zmlFetch } from '@/api/zmlFetch';
import InputBox from "@/views/vote/InputBox.vue";
import DisplayItem from "@/views/vote/DisplayItem";
import ViewBox from "@/views/vote/ViewBox";
import { infoSnackbar } from '@/api/GlobalActions';
//import EmailList from '../../components/EmailList.vue';
export default {
  name: 'ViewVote',
  components: {'candidate-item':DisplayItem, InputBox, ViewBox},  
  props:['campaignid'], 
  data() {
    return {
      getZml: getters.getState({ object: "gZml" }),
      registerToVote: 'Register to Vote',
      showRegisterModal: false,
      voteAllow:true,
      showVoteList: false,
      candidateList:[],
      filterItems: [],
     gradesSelected: [],
      gradeItems: [],
      forceReload: true,
      scrollFab: false,
      good:null,
      searchInfo:'',
      awaitingSearch: false,
      campaigns:[],
      curCam:{},
    };
  }, 
  computed: {
      filteredItems: function() {
        //ZML - Thanks to 5balloons!
        //https://www.5balloons.info/combining-multiple-filters-on-list-using-computed-properties-in-vuejs/
        return this.filterCandidatesByName(this.filterCandidatesByRange(this.candidateList));
      },
  },
  methods: { 
    insertCandidate: function() {
      this.$router.push({ path: '/applicant/' + this.curCam.campaignid
                  , params: {campaignid: this.curCam.campaignid}
                  } )

    },
    viewVoteList: function() {
      this.showVoteList = !this.showVoteList; //alert('view the vote list');
    },
    voteItem: function(id) {
       //this.$cs.l('VI', id, status,grade,this.getZml.voteList);
       let index = this.getZml.voteList.findIndex(p => p == id);
       if (index == -1) {
          this.getZml.voteList.push(id);
       } else {
          this.getZml.voteList.splice(index);
       }
       this.$cs.l('votes sofar:',this.getZml.voteList.length)
    },
    seniorVoteItem: function(id) {
      //Check if the giu is logged in as a voter
       //this.$cs.l('SI',id, grade,status,this.getZml.seniorList);
       let index = this.getZml.seniorList.findIndex(p => p == id);
       if (index == -1) {
          this.getZml.seniorList.push(id);
       } else {
          this.getZml.seniorList.splice(index);
       }
    },    
    filterCandidatesByName: function(candidates) {
      return candidates.filter(candy => !candy.surname.toUpperCase().indexOf(this.searchInfo.toUpperCase()));
    },
    filterCandidatesByRange: function(candidates){
      return candidates.filter(item => this.gradesSelected.includes(item.gradename));
    },            
    onScroll (e) {
      if (typeof window === 'undefined') return;
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.scrollFab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
    refreshCandidates() {
      this.forceReload == true
      this.loadOurCandidates()
    },
    loadOurCandidates() {
      if (this.forceReload == true) {
        this.candidateList = [];
        this.gradeItems = [];
      }
      if (!this.candidateList.length) {
        this.candidateList = [];        
        this.getZml.voteList = [];
        this.getZml.seniorList = [];
      }
      //this.$cs.l('fetching candidates')
      zmlFetch({task: 'getCandidates', data: {campaignid: this.campaignid} }
               , this.loadItems
               , this.loadItemError);
    },
    loadItems(response) {
      if (!response.error) {
        //Reading grade and candidates and massage data
        this.candidateList = response.candidates;
        this.candidateList.forEach(item => { 
          //add the local path to our fotos if they have a path
          if (item.foto && item.foto[0] == '/')  
             item.foto = zmlConfig.localPath + item.foto;
          else if (item.foto ) item.foto = zmlConfig.localPath + 'dkhs/' + item.foto;
          else item.foto = zmlConfig.localPath + 'img/dkhs.jpg';
          //add a path to all our videos, since all is same folder (no path in table)
          if (item.video) item.video = zmlConfig.videoPath + item.video;
        });
        //this.gradeItems = response.grades;
        this.gradesSelected = []
        this.gradeItems = []
        response.grades.forEach(item => { 
          //if (item.gradename != 'G07') {
           this.gradeItems.push(item.gradename);
          //}
        });
        //this.gradeItems = [...new Set(this.gradeItems.sort())];
        this.gradesSelected = ["G08", "G12"];

        this.campaigns = response.campaigns
        let index = this.campaigns.findIndex(c => c.campaignid == this.campaignid)
        if (index == -1) {
          alert('we could not find the campaign!')
        } else {
          this.curCam = this.campaigns[index]
        }

        //this.$cs.l('hozeit!', response)
        this.forceReload = false;
      } else {
          alert(response.error);
      }
    },
    loadItemError(err) {
      this.forceReload = false;
      //this.$cs.l(err);
      alert(err);      
    },
    /* brougth from app */
      doSomething(data) {
          this.showRegisterModal = false;
          this.fetchID(data);
      },
      clearVoteList() {
        this.getZml.voteList = [];
        this.getZml.seniorList = [];
        this.showVoteList = 0;
        infoSnackbar('Your voting list has been cleared - start again!');
      },
      submitVoteList() {
        this.showVoteList = false;
         let task = {method: "savevote"
                  , idno: this.getZml.login.IDNo
                  , votes: this.getZml.voteList
                  , senior: this.getZml.seniorList
                  }
         zmlFetch(task,this.afterSave, this.errorVoteSave);
      },
      afterSave(result) {
        infoSnackbar('Your voting list has been submitted - Well Done!' + result);
        
        this.clearVoteList();
      },
      errorVoteSave(err) {
        alert('Error saving ' + err);
      },
      displayLoginData(response) {
        console.log(response)
        this.getZml.voteList = [];
        this.getZml.seniorList = [];
      },
  },
  updated: function () {
    
  },
  mounted: function () {
    this.loadOurCandidates();
  },
  created: function () {

  },
  beforeUpdate: function() {

  },
  watch: {
    getZml: {
      deep: true,
      handler() {
        if (this.getZml.login.isAuthenticated) {
           //this.$cs.l('Voting is active');
        } else {
           //this.$cs.l('Voting is NOT active');
        }
      }
    },
    campaignid() {
      this.loadOurCandidates();
    }
  }
}
</script>

<style>
.myGrid {
   display: flex;
   flex-flow:wrap;
   justify-content: space-between;
   align-items: stretch;
   height: 300px; 
}

.iti {
  margin: auto;
  width: 300px; 
  height: 100px; 
}
.orange { grid-area: orange }
.indigo1 { grid-area: indigo1 }
.indigo2 { grid-area: indigo2 }
.indigo3 { grid-area: indigo3 }
.red { grid-area: red }
.green { grid-area: green }
.purple { grid-area: purple }
.blue { grid-area: blue }
</style>