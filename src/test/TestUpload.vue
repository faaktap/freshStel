<template>
<div v-cloak 
     @drop.prevent="addFile" 
     @dragover.prevent
>
<v-card class="ma-6 pa-6" color="blue">
  <v-card-title>
    {{ titleMessage }}
    <v-file-input
        v-model="inputFiles"
        :accept="addFile" 
        label="File input"
        ref="file"
    ></v-file-input> 
    <small v-if="files.length">  {{ files.length }} files </small>
    <v-btn icon 
            v-if="inputFiles" 
            @click="addSingleFile(inputFiles)"
            title="Click here to load the file into the queue"
    >
     <v-icon> mdi-file-check </v-icon>ins
    </v-btn>
  </v-card-title>
  <v-progress-linear
      v-show="busy"
      indeterminate
      color="grey darken-2"
  ></v-progress-linear>
  <v-layout>
   <v-flex>
    <div v-if="files.length"> 
      <v-btn @click="initiateUpload" :disabled="busy"> start upload </v-btn>
      <small>Click Start upload, to process these files</small>
    </div>
  </v-flex>    
  <v-flex>    
   <v-simple-table dense v-if="files.length">
     <template v-slot:default>
      <tbody>
       <tr v-for="f in files" :key="f.name" color="blue lighten-1">
        <td width=70%>{{ f.name }}</td>
        <td> {{ f.size | kb }} </td> 
        <td> {{f.ext}} </td>
       </tr>      
      </tbody>
     </template>
    </v-simple-table>
   </v-flex>

   <v-flex>
    <v-card v-for="p in progressItems" :key="p.timeStamp"  color="blue lighten-2">
     <small> {{ p.eventPhase }} {{ p.loaded }} {{p.timeStamp}} {{ p.total }} {{ p.type }}</small>
    </v-card>
   </v-flex>
  </v-layout>
  to: {{ uploadPath }}
</v-card>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch';
import { makeAWait, uploadFiles, addToQueue } from '@/api/fileUploadHelper.js'
import { infoSnackbar } from '@/api/GlobalActions';
  export default {
    name: "UploadMachine",
    props: {
        uploadPath:{default:"/Test/werner"}
    },
    components: {},
    data: () => ({
        titleMessage: "Drop your file(s) here",
        files:[],
        inputFiles:[],
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
        this.busy = true 
        let cheatArray = []
        cheatArray.push(e)
        await makeAWait(1000,addToQueue, cheatArray, this.files, this.busy)
        this.inputFiles = null
        this.busy = false
      },
      async addFile(e) {
        await makeAWait(1000,addToQueue,e.dataTransfer.files, this.files, this.busy)
      },

      async initiateUpload() {
        if (this.files.length == 0){
            infoSnackbar('Please drag some files to blue box before doing this.')
            return
        }
        if (this.uploadPath == '') {
            infoSnackbar('Please define an upload path.')
            return
        }
        this.busy = true
        this.totalSize = 0
        this.sofarSize =0

        let fdet = {}
        fdet.testprop = "is this a property?"
        this.totalSize = this.files.reduce( (accum,item) => accum + item.size,0)

        await makeAWait(1000,uploadFiles,this.startUpload, this.files, this.progressProg)
      },
      progressProg(data) {
          console.log('received data from progress : ', data)
          if (data.lengthComputable) {    
                this.sofarSize += data.loaded
                this.progressBar = parseInt( ((this.sofarSize / this.totalSize) * 100), 10 );
                data.howFarAreWe = this.progressBar
          }
          this.progressItems.push(data);    
          this.busy = false
      },
      startUpload(fileData, fdet) {
         let trans = {}
         trans.extrapath =  this.uploadPath //"/Test/werner"
         trans.name = fdet.name
         trans.realname = fdet.name
         trans.prebase64 = fileData.target.result.split(',')[0];
         trans.base64 = fileData.target.result.split(',')[1];
         trans.size = fileData.total
         trans.api = zmlConfig.apiUpload; 
         trans.task = 'upload'; 
         zmlFetch(trans,this.doneWithUpload, this.errorWithUpload)
      },
      doneWithUpload(response) {
        if (response.filename == 'undefined') {
           return
        }
        //
        //do whatever you want to do after the upload.... and then delete file from list
        //
        //here we need to add the file into lcntent if needed, or send it via emit to
        //our launching program
        this.$emit('fileUploaded', response)
        for (let i = this.files.length - 1; i >= 0 ; i--) {
            if (response.filename == this.files[i].name)  {
              this.files.splice(i,1);
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
    watch:{
        
        inputFiles(n) {
            if (n) {
                this.addSingleFile(n)
            }
        }
        
    }
  }
</script>