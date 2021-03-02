<template>
<div>
<v-container v-if="getZml.login.isAuthenticated">
 
 <v-toolbar color="primary">
    <v-toolbar-title> 
      <div class="d-flex flex-no-wrap justify-space-between pr-4 ">
       <div>
         View Campaigns 
       </div>
       <div>
        <v-btn   small 
         absolute top right
         title="Click here to load campaigns"  @click="loadCampaigns"> Refresh </v-btn>
       </div>
      </div>
    </v-toolbar-title>
</v-toolbar>

  <v-text-field
           v-model="search"
           append-icon="mdi-magnify"
           label="Search"
           single-line
           hide-details
   ></v-text-field>
   <v-data-table
    :headers="campaignHeader"
    :items="campaigns"
    :items-per-page="15"
    :search="search"
     class="elevation-1"
     color="blue lighten-3"
     @click:row="editCampaign"
  >
      <template v-slot:[`item.icon`]="{ item }">
        <v-icon >
        {{ item.icon }}</v-icon>
      </template>
    <template v-slot:[`footer.page-text`]>
       <v-btn icon @click="insertCampaign"> 
           <v-icon >mdi-table-plus</v-icon>
        </v-btn>
    </template>
    <template v-slot:[`item.action`]="{ item }">
        <v-btn class="mx-2" 
               icon
               :title="'Click here to open the campaign ' + item.campaignid "
               @click.stop=" onButtonClick('Show Campaign',item) ">
          <v-icon dark>mdi-vote</v-icon> 
        </v-btn>
    </template>
  </v-data-table>
</v-container>



<v-dialog v-model="showCampaignUpdate" 
          v-if="curCam" 
          xwidth="auto " 
          :fullscreen="$vuetify.breakpoint.smAndDown" >
  <v-card>
    <v-card-title>  
      <v-card color="light-blue" class="ma-4 pa-4">
       Update Function - {{ curCam.campaignname }} - {{ curCam.campaignshortname }}  - <v-icon> {{ curCam.icon }} </v-icon>
      </v-card>
    </v-card-title>
    <v-card-text>
      <v-layout row wrap align-content-start justify-space-between class="ma-2">
        <v-flex xs10 md6>
          <v-text-field v-model="curCam.campaignname" 
                        dense
                        label="Campaign Full Name"  />
        </v-flex>
        <v-flex xs10 md6>
          <v-text-field v-model="curCam.campaignshortname" 
                        dense
                        label="Shortname" />
        </v-flex>
        <v-flex xs6>
          <v-text-field v-model="curCam.icon" 
                        label="Icon" 
                        title="Icon to show" /><v-icon small> {{ curCam.icon }} </v-icon>
        </v-flex>
        <v-flex xs8 md6>
         <v-radio-group v-model="curCam.status" 
                        label="Status"  
                        dense
                        row>
           <v-radio v-for="t in ['open','vote','closed','special','other']" 
                   :key="t"  
                   :label="t"   
                   :value="t"  >
           </v-radio>
         </v-radio-group>          
        </v-flex>
        <v-flex xs8 md6>
         <v-radio-group v-model="curCam.access" 
                        label="Access"  
                        dense
                        row>
           <v-radio v-for="t in ['admin','all','other','special','student','teacher']" 
                   :key="t"  
                   :label="t"   
                   :value="t"  >
           </v-radio>
         </v-radio-group>          
        </v-flex>
        <v-flex xs12 md6>
          <v-textarea v-model="curCam.description" label="Description" 
                        title="Long text field - not used at the moment" />
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
     <v-btn @click="saveCampaign"> Save </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</div>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch.js';
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
export default {
    name:"ViewCampaigns",
    components:{},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        search:null,
        selected:null,
        showCampaignUpdate: false,
        curCam:{},
        campaigns:[],
        candidates:[],
        campaignHeader: [
          {text: 'icon',       value: 'icon' },          
          {text: 'ID',         value: 'campaignid' },
          {text: 'Name',       value: 'campaignname' },
          {text: 'ShortName',  value: 'campaignshortname' },
          {text: 'Status',     value: 'status' },
          {text: 'Access',     value: 'access' },
          {text: "edit",       value: "action", sortable: false }
        ],     
    }),
    computed:{
    },
    methods:{
      onButtonClick(task, item){
        console.log(task, item)
        this.$router.push({ path: '/candidates/'+ item.campaignid
                          , params: {campaignid: item.campaignid}
                          } )
      },
      onComplete(){
        console.log('toure complete')
      },
      onAbort(){
        console.log('toure abirte')
      },
      saveCampaign() {
        let ts = {}
        ts.data = this.curCam
        ts.task = 'savemaincampaign' 
        //ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.loadCampaigns, this.loadError)
      },
      editCampaign(value) {
        if (this.getZml.login.isAuthenticated && this.getZml.login.type != 'student') {
          this.curCam = value
          this.showCampaignUpdate = !this.showCampaignUpdate
        } else {
          infoSnackbar('You are not allowed to edit - click the button to view.')
        }
      },
      insertCampaign() {
        if (this.getZml.login.isAuthenticated && this.getZml.login.type != 'student') {
        this.curCam =  { "campaignid": "0"
                  , "campaignname": ""
                  , "campaignshortname": ""
                  , "grade": null
                  , "icon": "mdi-kettle-steam"
                  , "description": null
                  , "create_timestamp": null
                  , "update_timestamp": null
                  }
        this.showCampaignUpdate = !this.showCampaignUpdate
        } else {
          infoSnackbar('you are not allowed to insert - click the button to view.')
        }
      },
      click(what) {
           if (doStuff(this.$router,what.payload) == 0) {
             alert('we cannot handle ' + what.payload + ' yet')
            }
      },
      loadCampaigns() {
           this.showCampaignUpdate = false
           let ts = {}; 
           ts.task = 'GetCandidates'
           ts.data = this.curCam
           zmlFetch(ts, this.showData, this.loadError)
      },
      loadError(response) {
            console.log(response)
            alert(response)
      },
      showData(response) {
          this.campaigns = response['campaigns']
          this.candidates = response['candidates']
      }
    },
    activated:function() {
        console.log('ACTVI CAMPAIGN')
    },
    beforeupdate:function() {
        console.log('BEFOREUPDATE CAMPAIGN')
    },
    updated:function() {
       // console.log('UPDATE CAMPAIGN')
    },
    mounted: function() {
        console.log('MOUNT CAMPAIGN')
        this.loadCampaigns()
    }
}
</script>

