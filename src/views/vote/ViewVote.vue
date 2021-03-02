<template>
 <div v-if="getZml.login.isAuthenticated">    

    <h2 class="text-center">
      {{ curCam.campaignname }}</h2>
     <!--{{ curCam.campaignshortname }} {{ curCam }}<br> {{ getZml.login }}-->
    <input-box v-model="showRegisterModal"
               @dataEntered="doSomething" 
    ></input-box>

<!-- show the voting list -->
    <view-box v-model="showVoteList" 
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
            v-model="theGrades"
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

<!--          LIST OF VOTES? -->
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
        <v-btn @click="insertCandidate" class="mb-6 pa-5">
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
      theGrades: [],
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
    voteItem: function(id,status,grade) {
       console.log('VI', id, status,grade,this.getZml.voteList);
       let index = this.getZml.voteList.findIndex(p => p == id);
       /// // //this.getZml.seniorList.includes(this.theItem.rvlselid)
       if (index == -1) {
          this.getZml.voteList.push(id);
       } else {
          this.getZml.voteList.splice(index);
       }
       console.log('votes sofar:',this.getZml.voteList.length)
    },
    seniorVoteItem: function(id,status,grade) {
      //Check if the giu is logged in as a voter
       console.log('SI',id, grade,status,this.getZml.seniorList);
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
      return candidates.filter(item => this.theGrades.includes(item.gradename));
    },            
    onScroll (e) {
      if (typeof window === 'undefined') return;
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.scrollFab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
    loadOurCandidates() {
      if (this.forceReload == true) {
        this.candidateList = [];
      }
      if (!this.candidateList.length) {
        this.candidateList = [];        
        this.getZml.voteList = [];
        this.getZml.seniorList = [];
      }
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
        response.grades.forEach(item => { 
          this.gradeItems.push(item.gradename);
        });
        //this.gradeItems = [...new Set(this.gradeItems.sort())];
        this.theGrades = this.gradeItems;

        this.campaigns = response.campaigns
        let index = this.campaigns.findIndex(c => c.campaignid == this.campaignid)
        if (index == -1) {
          alert('we could not find the campaign!')
        } else {
          this.curCam = this.campaigns[index]
        }

        console.log('hozeit!', response)
        this.forceReload = false;
      } else {
          alert(response.error);
      }
    },
    loadItemError(err) {
      this.forceReload = false;
      console.log(err);
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
        infoSnackbar('Your voting list has been submitted - Well Done!');
        console.log(result);
        this.clearVoteList();
      },
      errorVoteSave(err) {
        console.log(err);
        alert('Error saving ' + err);
      },
      displayLoginData(response) {
        console.log(response)
        this.getZml.voteList = [];
        this.getZml.seniorList = [];
      },
  },
  updated: function () {
    console.log('RC:updated');
  },
  mounted: function () {
    console.log('RC:mounted - zml:', zmlConfig);
    this.loadOurCandidates();
  },
  created: function () {
    console.log('RC:created');
  },
  beforeUpdate: function() {
      //console.log("beforeUpdate")
  },
  watch: {
    getZml: {
      deep: true,
      handler() {
        if (this.getZml.login.isAuthenticated) {
           console.log('Voting is active');
        } else {
           console.log('Voting is NOT active');
        }
      }
    },
    campaignid(n,o) {
      console.log('Whatch Campaignid',n,o)
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