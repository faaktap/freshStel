<template>
<div    v-cloak 
        @drop.prevent="addFile" 
        @dragover.prevent
>
<v-card class="ma-6 pa-6" color="blue">
    <v-card-title>
        {{ titleMessage }}
    </v-card-title>
    <v-progress-linear
      v-show="busy"
      indeterminate
      color="grey darken-2"
    ></v-progress-linear>
    <v-layout>
        <v-flex>
    <v-card v-for="f in files" :key="f.name" color="blue lighten-1">
        {{ f.name }} {{ f.size | kb }} <br />
    </v-card>
        </v-flex>
        <v-flex>
   
    <v-card v-for="p in progressItems" :key="p.timeStamp"  color="blue lighten-2">
       <small> {{ p.eventPhase }} {{ p.loaded }} {{p.timeStamp}} {{ p.total }} {{ p.type }}</small>
    </v-card>
        </v-flex>
    </v-layout>

</v-card>
<v-btn @click="starttheUpload" :disabled="busy"> start upload </v-btn>

</div>
</template>

<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch';
import { makeAWait, uploadFiles, addToQueue } from './fileUploadHelper.js'
import { infoSnackbar } from '@/api/GlobalActions';
  export default {
    name: "test",
    props: [],
    components: {},
    data: () => ({
        titleMessage: "Drop your file(s) here",
        files:[],
        busy:false,
        progressItems:[],
        progressBar:null,
        totalSize:0,
    }),
    filters:{
        kb: function(value) {
            return (value / 1024).toFixed(2) + ' KB'
        }
    },
    methods:{
      async addFile(e) {
        await makeAWait(1000,addToQueue,e.dataTransfer.files, this.files)
      },

      async starttheUpload() {
        if (this.files.length == 0){
            infoSnackbar('Please drag some files to blue box before doing this.')
            return
        }
        this.busy = true

        let fdet = {}
        fdet.testprop = "is this a property?"
        this.totalSize = this.files.reduce( (accum,item) => accum + item.size,0)

        await makeAWait(1000,uploadFiles,this.startUpload, this.files, this.progressProg)
      },
      progressProg(data) {
          //console.log('received data from progress : ', data)
          this.progressItems.push(data);
          if (data.lengthComputable) {                                            
                this.progressBar = parseInt( ((data.loaded / this.totalSize) * 100), 10 );
                console.log(this.progressBar);
          }
      },
      startUpload(fileData, fdet) {
         let trans = {}
         trans.extrapath =  "/Test/werner"
         trans.name = fdet.name
         trans.realname = fdet.name
         trans.prebase64 = fileData.target.result.split(',')[0];
         trans.base64 = fileData.target.result.split(',')[1];
         trans.size = fileData.total
         trans.api = zmlConfig.apiUpload; 
         trans.task = 'upload'; 
         console.log('start ZmlFetch:',trans)
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
            if (response.filename == this.files[i].name)  {
              this.files.splice(i,1);
              console.log('Done with ',  response.filename)
            }
        }
        if (this.files.length == 0) {
           this.busy = false
           this.progressItems = []
        }
        console.log('files left ', this.files.length)
      },
      errorWithUpload(response){
          console.log("UPLOAD ERROR : ", response)
      }
    }
  }
</script>