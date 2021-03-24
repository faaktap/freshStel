<template>
<div    v-cloak 
        @drop.prevent="addFile" 
        @dragover.prevent
>
<v-card class="ma-2 pa-2" :color="cardColor">
    <v-card-title>
        <v-row>
         <v-col v-if="!$vuetify.breakpoint.smAndDown" cols="12" md="6" class="ma-0">
          {{ titleMessage }}
         </v-col>
         <v-col cols="12" md="6">
         <v-file-input
            v-model="inputFiles"
             show-size
             counter
             :accept="addFile" 
             label="File input"
             ref="file"
         ></v-file-input> 
         <v-btn icon 
                 v-if="inputFiles" 
                 @click="addSingleFile(inputFiles)"
                 title="Click here to load this file into the queue"
         >
         <v-icon> mdi-file-check </v-icon>
         </v-btn>
         </v-col>
        </v-row>
    </v-card-title>
    <v-card-text>
      <v-row>
       <v-col cols="12">
        <v-progress-linear
          v-show="busy"
          indeterminate
          color="grey darken-2"
        ></v-progress-linear>
       </v-col>
        <v-col cols="12">
           <v-btn v-if="files.length" 
                 @click="initiateUpload" 
                 :disabled="busy" 
                 :color="btnColor"
                  title="Click Start upload, to process these files"> 
                start upload 
           </v-btn>
         </v-col>    
         <v-col cols="12" lg="6">    
          <table border=1 v-for="f in files" :key="f.name" color="blue lighten-1">
           <tr><td width=70%>{{ f.name }}</td><td> {{ f.size | kb }} </td> <td> {{f.ext}} </td></tr>
          </table>
        </v-col>
        <v-col cols="12" lg="6">
         <v-card v-for="p in progressItems" :key="p.timeStamp"  color="blue lighten-2">
          <small> {{ p.eventPhase }} {{ p.loaded }} {{p.timeStamp}} {{ p.total }} {{ p.type }}</small>
        </v-card>
        </v-col>
       </v-row>
    </v-card-text>
</v-card>


</div>
</template>

<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch';
import { makeAWait, uploadFiles, addToQueue } from '@/api/fileUploadHelper.js'
import { infoSnackbar } from '@/api/GlobalActions';
  export default {
    name: "UploadWrapper",
    props: {titleMessage: {type:String ,default:"Drop your file(s) here"}
           ,cardColor:    {type:String, default:"blue"}
           ,extraPath:    {type:String, default:"/Test/werner"}
           ,prependName:  {type:String, default:""}
           ,btnColor:     {type:String, default:"blue"}
    },
    components: {},
    data: () => ({
        files:[],
        inputFiles:null,
        busy:false,
        progressItems:[],
        progressBar:null,
        totalSize:0,
        sofarSize:0,
    }),
    filters:{
        kb: function(value) {
            return (value / 1024).toFixed(2) + ' KB'
        }
    },
    methods:{
      async addSingleFile(e) {
        if (!e) {
            infoSnackbar('First select a file')
            return
        }
        let cheatArray = []
        cheatArray.push(e)
        await makeAWait(1000,addToQueue, cheatArray, this.files)
        this.inputFiles = null
      },
      async addFile(e) {
        await makeAWait(1000,addToQueue,e.dataTransfer.files, this.files)
      },

      async initiateUpload() {
        if (this.files.length == 0){
            infoSnackbar('Please drag some files into unput area box before doing this.')
            return
        }
        this.$emit('filesBeingUploaded',this.files)
        this.busy = true
        this.totalSize = 0
        this.sofarSize =0
        let fdet = {}
        fdet.testprop = "is this a property?"
        this.totalSize = this.files.reduce( (accum,item) => accum + item.size,0)
        await makeAWait(1000,uploadFiles,this.startUpload, this.files, this.progressProg)
      },
      progressProg(data) {
          if (data.lengthComputable) {    
                this.sofarSize += data.loaded
                this.progressBar = parseInt( ((this.sofarSize / this.totalSize) * 100), 10 );
                data.howFarAreWe = this.progressBar
          }
          this.progressItems.push(data);          
      },
      startUpload(fileData, fdet) {
         let trans = {}
         trans.extrapath =  this.extraPath
         trans.name = fdet.name
         trans.realname = this.prependName + fdet.name
         trans.prebase64 = fileData.target.result.split(',')[0];
         trans.base64 = fileData.target.result.split(',')[1];
         trans.size = fileData.total
         trans.api = zmlConfig.apiUpload; 
         trans.task = 'upload'; 
         zmlFetch(trans,this.doneWithUpload, this.errorWithUpload)
      },
      doneWithUpload(response) {
        if (response.filename == 'undefined') {
           console.log('Done with upload - but filename is missing?' , response  )
           return
        }
        //
        //do whatever you want to do after the upload.... and then delete file from list
        //
        for (let i = this.files.length - 1; i >= 0 ; i--) {
            if (response.filename == this.prependName + this.files[i].name)  {
              this.files.splice(i,1);
              this.$emit('fileUploadDone',response.filename)
            }
        }
        if (this.files.length == 0) {
           this.busy = false
           this.progressItems = []
        }
      },
      errorWithUpload(response){
          console.log("UPLOAD ERROR : ", response)
      }
    },
    mounted: function() {
      console.log('Mount UploadWrapper')
    },
    watch:{
     inputFiles(n) {
        if (n) {
           this.addSingleFile(n)
        }
      }
    }
  }
</script>