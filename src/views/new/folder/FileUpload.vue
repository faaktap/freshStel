<template>
 <v-container class="ma-1 pa-1" fluid
      @dragover.prevent.stop="onDragOver"
      @drop.prevent.stop="addFile"
      :disabled="busy"
    >
 <!-- @dragleave.prevent.stop="onDragLeave"       -->
 <v-card class="my-0 pa-4" :color="fileWindowColor" elevation="4">

  <v-card-text>
    {{ titleMessage }}
    <small>
    <v-file-input
        v-model="inputFiles"
        :accept="addFile"
        label="File input"
        ref="file"
    />
    </small>
    <small v-if="files.length">  {{ files.length }} file(s) ready for upload</small>
    <!-- <v-btn icon
           small
            v-if="inputFiles"
            @click="addSingleFile(inputFiles)"
            title="Click here to load the file into the queue"
    >
     <v-icon> mdi-file-check </v-icon>ins
    </v-btn> -->
  </v-card-text>

  <v-progress-linear
      v-show="busy"
      indeterminate
      color="grey darken-2"
  ></v-progress-linear>

  <v-layout column class="align-content-center ma-2">
   <v-flex row wrap >
    <div v-if="files.length">
      <v-tooltip bottom>
       <template v-slot:activator="{ on, attrs }">
        <v-btn class="ma-2"
               @click="initiateUpload"
              :disabled="busy"
               small
               v-bind="attrs"
               v-on="on">
          start upload
        </v-btn>
       </template>
       <span>Click Start upload, to process these files</span>
      </v-tooltip>
    </div>
  </v-flex>
  <v-flex >
   <v-simple-table dense v-if="files.length" class="ma-2">
     <template v-slot:default>
      <tbody class="text-caption">
       <tr v-for="f in files" :key="f.name"
           color="blue lighten-4" class="text-caption">
        <td class="text-left ma-0 pa-0">
           <v-tooltip bottom>
           <template v-slot:activator="{ on, attrs }">
             <v-btn icon
                 x-small
                 v-bind="attrs"
                 v-on="on"
                @click="deleteFileEntry(f.name)">
              <v-icon x-small color="red">mdi-delete</v-icon>
             </v-btn>
           </template>
            <span>Click here to delete this<br>entry before uploading</span>
          </v-tooltip>
          <small class="text-caption">{{ f.name }}</small>
        </td>
        <td>
          <small> {{ formatBytes(f.size,0) }} </small>
        </td>

       </tr>
      </tbody>
     </template>
    </v-simple-table>
   </v-flex>

   <v-flex>
    <v-card v-for="p in progressItems" :key="p.timeStamp"
            color="blue lighten-2">
     <small> {{ p.eventPhase }} {{ p.loaded }} {{p.timeStamp}} {{ p.total }} {{ p.type }} {{ progressItems.length }}</small>
    </v-card>
   </v-flex>
  </v-layout>
  <p class="text-caption"> to: {{ hideStr(uploadPath,'/home/kuilieso/public_html/Subjects') }}</p>
</v-card>

 </v-container>
</template>

<script>

import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch';
//import { makeAWait, uploadFiles, addToQueue } from '@/api/fileUploadHelper.js'
import { errorSnackbar } from '@/api/GlobalActions'
  export default {
    name: "UploadMachine",
    props: {
        uploadPath:{default:"/api/fileRepos"}
    },
    components: {},
    data: () => ({
        titleMessage: "Drag and Drop your file(s) in this window",
        afterDropMessage: "Drag and Drop your file(s) in this window",
        beforeDropMessage:"I'm ready! Let go of mouse button!",
        AfterUploadMessage: "Your file(s) was uploaded",
        fileWindowColor:"white",
        fileWindowColorActive:"#e7f8f7",
        fileWindowColorNormal:"white",
        busy:false,
        progressItems:[],
        progressBar:null,
        files:[],
        inputFiles:[],
        totalSize:0,
        sofarSize:0,
        debugList:[],
    }),
    filters:{
        kb: function(value) {
            return (value / 1024).toFixed(1) + ' kb'
        }
    },
    methods:{
      onDragLeave() {
        this.mes('dragLeave')
        this.fileWindowColor = this.fileWindowColorNormal
        this.titleMessage = this.afterDropMessage
      },
      onDragOver() {
        this.mes('dragOver')
        this.fileWindowColor = this.fileWindowColorActive
        this.titleMessage = this.beforeDropMessage
      },
      deleteFileEntry(fname) {
        // this.$cs.l('asking to delete ', fname, this.files.length)
        // this.$cs.l('asking to delete ', this.files)
        let idx = this.files.findIndex(e => e.name == fname)
        // this.$cs.l('asking to delete no ', idx)
        if (idx != -1) {
          this.files.splice(idx,1)
        }
      },
      snack(txt) {
        errorSnackbar(txt)
      },
      mes(txt) {
        this.$cs.l(txt)
      },
      async addSingleFile(e) {
        this.mes('addSingeFile')
        if (!e) {
            this.snack('First select a file')
            return
        }
        if (e.size > zmlConfig.maxUploadSize) {
          this.snack(`This file is too big!  ${this.formatBytes(e.size)}
           Maximum size is  ${this.formatBytes(zmlConfig.maxUploadSize)}`)
          return
        }
        this.busy = true
        let cheatArray = []
        cheatArray.push(e)
        this.mes('adding files from ', cheatArray)
        this.mes('adding files to ', this.files)
        await makeAWait(1000,this.addToQueue, cheatArray, this.files, this.busy)
        this.inputFiles = null
        this.busy = false
      },
      async addFile(e) {
        this.fileWindowColor = this.fileWindowColorNormal
        this.titleMessage = this.afterDropMessage

        // this.$cs.l('addFile',e.dataTransfer.files)
        // this.$cs.l('addFile #',e.dataTransfer.files.length)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
           await makeAWait(1000,this.addToQueue,e.dataTransfer.files, this.files, this.busy)
        } else {
          this.$cs.l('Houston we have a prbolem!!!!')
        }
      },

      async initiateUpload() {
        this.mes('initateUpload')
        let weDeletedAFile = 0
        this.files.forEach(e => {
          if (e.size > zmlConfig.maxUploadSize) {
            this.snack(`Your file ${e.realname} is to big! ->  ${this.formatBytes(e.size)}
                        Maximum size is  ${this.formatBytes(zmlConfig.maxUploadSize)}
                        Please contact Werner at 082 563 9790 to make a plan.`)
            e.ignore = true
          }
        })
        for (let i = this.files.length-1; i >= 0; i--) {
         if (this.files[i].ignore == true) {
            this.files.splice(i,1)
            weDeletedAFile++;
         }
        }
        if (weDeletedAFile > 0) {
          return
        }
        if (this.files.length == 0){
            this.snack('Please drag some files to blue box before doing this.')
            return
        }
        if (this.uploadPath == '') {
            this.snack('Please define an upload path.')
            return
        }


        this.totalSize = this.files.reduce( (accum,item) => accum + item.size,0)
        if (this.totalSize == 0) {
          this.files = []
          this.snack('Our files does not have a size!')
          return
        }
//        const testSize = [...this.files]


        this.busy = true
        this.sofarSize = 0
        // Make a backup of our filelist
        this.debugList = []
        for (let i = 0; i < this.files.length; i++) {
         this.debugList[i] = this.files[i];
        }
        await makeAWait(1000,uploadFiles,this.startUpload, this.files, this.progressProg)
        console.log('DEBUG:After makeAWait in initiateUpload')
      },
      progressProg(data) {
          this.$cs.l('received data from progress : ', data, data.lengthComputable)
          if (data.lengthComputable) {
                this.sofarSize += data.loaded
                this.progressBar = parseInt( ((this.sofarSize / this.totalSize) * 100), 10 );
                data.howFarAreWe = this.progressBar
          }
          // added ZML - to make it cleaner
          this.progressItems.length = 0
          this.progressItems.push(data);
          this.$cs.l('received data from progress bottom : ', this.sofarSize, this.progressBar)
          // this.busy = false
      },
      startUpload(fileData, fdet) {
        // We receive two parameters from our uploadFiles worker
        console.log('DEBUG:StartUpload',fdet)
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
        console.log('DEBUG:DoneWithUpload')
        if (response.filename == 'undefined') {
           return
        }
        console.log('DEBUG:DoneWithUpload - GOODFILENAME?')
        //
        // do whatever you want to do after the upload.... and then delete file from list
        //
        // here we need to add the file into lcntent if needed, or send it via emit to
        // our launching program
        // Since we've delete the queue, we send the backup
        this.$emit('filesUploaded', this.debugList)
        for (let i = this.files.length - 1; i >= 0 ; i--) {
            if (response.filename == this.files[i].name)  {
              this.files.splice(i,1);
            }
        }
        if (this.files.length == 0) {
           this.busy = false
           this.progressItems = []
           this.titleMessage = this.AfterUploadMessage
           this.$emit('uploadFinished', this.debugList)
        }
      },
      errorWithUpload(response){
          this.$cs.l("UPLOAD ERROR : ", response)
      },
      hideStr(str,partToHide) {
        let split = str.split(partToHide)
        // We assume it will be beginning or end, so we will only have two part, and not 3
        // And one of the parts will always be zero length
        if (split[0].length)
           return split[0]
        else
           return split[1]

      },
      formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
  addToQueue (receivedFilesReal,fileList) {
  console.log('recfilesinaddtoq',receivedFiles)
  // Uncaught ReferenceError: Cannot access 'receivedFiles' before initialization 347 webpack-internal:....
  // Had to change ReceivedFiles to a var to get past this error.
  // see https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/190
  var receivedFiles = [...receivedFilesReal]
  if (receivedFiles.length == 0) {
      return 100
  }
  let problemFiles = 0
  receivedFiles.forEach(file => {
    file.ignore = false
    //check if in list already
    fileList.forEach(already => {
      if (file.name == already.name)  {
        problemFiles += 1
        file.ignore = true
      }
    })
    file.done = false

    if (!file.type && file.size%4096 == 0) {
      // The file is a folder
      file.ignore = true
    }
    console.log('file.name',file.name)
    if (file.ignore == false) {
      file.ext = ''
      file.ext = file.name.split('.').pop().toLowerCase()
      file.realname = file.name
      fileList.push(file);
    }
  })
  console.log('ProblemFiles in Add2Q is : ' , problemFiles)
  return problemFiles
    }
    },
    mounted() {
      // https://www.vuescript.com/vue-js-drag-drop-uploader-vue-transmit/
      // this.$cs.l(this.$options.name)
    },
    watch:{

        inputFiles(n) {
            if (n) {
                this.addSingleFile(n)
            }
        }

    }
  }


function uploadFiles(fileUploader,files,updateProgress) {
  files.forEach(file => {
    console.log(file);
    if (file.ignore == false) {
       let fr = new FileReader()
       fr.onload = function(response) {
         makeAWait(10,fileUploader,response, file)
       };
       fr.onerror = function(response,file) {
         console.log('res - Some Error!' ,file,response);
       };
       fr.onprogress = updateProgress;
       fr.readAsDataURL(file);
    }
  });
}


function makeAWait (milisecs,nextProc,parm1, parm2 ,parm3) {
 let openWin = new Promise((resolve) => {
   let wagbietjie = setTimeout(() => {
     console.log('makewait timeout',openWin)
     clearTimeout(wagbietjie)
     resolve( nextProc(parm1,parm2, parm3 ))
     if (parm3 ) {
        console.log('Parm3 after tm',parm3)
        parm3=false
     }
   }, milisecs)
 })
 console.log('makewait',openWin)
}

</script>