<template>
<v-dialog v-model="showUploader" xscrollable max-width=640>
 <template v-slot:activator="{ on, attrs }">
  <v-btn v-bind="attrs" v-on="on" 
        @click="showUploader = !showUploader"> Show Uploader 
  </v-btn>
 </template>
 <v-container class="grey lighten-5">
  <v-layout>
   <v-row>
    <v-col>
     <v-card>
      <v-card-title>
       <v-expansion-panels>
        <v-expansion-panel>
         <v-expansion-panel-header>
          <div v-if="registryDocFile.length == 0">
            <v-icon>mdi-information</v-icon> Click here for some help?
          </div>
          <div v-else>
            You have {{ registryDocFile.length }} waiting for upload, when done, press bottom button.
          </div> 
         </v-expansion-panel-header>
         <v-expansion-panel-content>
          <v-card>
           <v-card-text>
            Insert your files one by one, or select multiple files 
              (by pressing the "insert file" button). 
            <br>To change a filename, or add a file description, 
            or to add tags to a file you can click on the "Edit" button. 
            <br>Once all your files are inserted, press the "Upload Button" to save all the files to the server.
            <br>
            <br><v-icon>mdi-information</v-icon>Try to name your files "english name _ afrikaans name.docx"
            ie. <i>Lesson One - How to play ball_Les Een - Hoe om bal te speel.doc</i>
          </v-card-text>
         </v-card>
        </v-expansion-panel-content>
       </v-expansion-panel>
      </v-expansion-panels>        
     </v-card-title>
     <v-card-text>
      <handy-uploader 
        :documentAttachment.sync="registryDocFile"   
        :fileUploaderType= "'table'"
        :maxFileSize= "10240"
        :maxFileCount= "5"
        :badgeCounter= "true"
        :thumb= "false"
        :changeFileName="true"    
        :addFileDescription="true"
        :addFileTag="true"
        :tags="tags"
        :xbtnColor= "'green'"
        :editPermission= "true"
        :deletePermission= "true"
        :lang= "'en'"
        ref= "fileUploader"
      />
     </v-card-text>
     <v-card-actions>
     <v-btn v-if="registryDocFile.length > 0"
          @click="loadThem" title="Click here once all files are good!">
          <v-icon>mdi-upload</v-icon>
          {{ uploadToServerBtn }} 
     </v-btn>
     <v-spacer />
     <v-btn @click="showUploader = !showUploader"><v-icon>mdi-close</v-icon>Close</v-btn>
    </v-card-actions>
   </v-card>
  </v-col>
 </v-row> 
</v-layout>
</v-container>
</v-dialog>
</template>

<script>
import handyUploader from  "@/components/learn/handyUploader"; 
export default {
  name: 'fileUploader',
  props: {extrapath:String},
  components: {
    handyUploader
  },
  data() {
    return{ 
      uploadApi:'http://localhost:81/api/fileUpload/fileUpload.php',
      showUploader: false,   
      registryDocFile: [],
      uploadToServerBtn: 'Upload to Server',
      tags: ['Gr8','Gr9','Gr10','Gr11','Gr12','Everyone'],
      uploads: '',
    }
  },
  methods:{
      calculateUploads() {
        //Find out how many files we need to upload.
        /*
        this.uploads = 0;
        this.registryDocFile.forEach(element => { 
          if (!element.done) element.done = false; 
          if (element.done == false)  this.uploads++; 
          console.log('checking : ', element);
        }); */
        this.uploads = 0;
        for (let i = 0; i < this.registryDocFile.length; i++) {
          if (!this.registryDocFile[i].done) this.registryDocFile[i].done = false;
          if (this.registryDocFile[i].done == false) {
            this.uploads++; 
          } else {
            this.registryDocFile.splice(i,1);
          }
        }
        console.log('uploads to be done = ', this.uploads, this.registryDocFile.length);
        this.uploadToServerBtn = 'Upload to Server (' + this.uploads + ')';
      },
      loadThem() {
          this.calculateUploads();
          if (this.uploads == 0) {
            alert('there are no files to upload.');
          }
          this.registryDocFile.forEach((item) => {
            if (!item.done) this.upload(item);  
          });
       },
       upload(item) {
         //CALLED when Upload to Server Button is pressed.
         //Should never happen - check if file item has a name and data.
         //We could also check if we have a tag and a file description here.
         if (!item.file.base64 || !item.file.name ) {
           alert('we cannot upload this file!');
           return;
         }
         let fileData = item.file;
         fileData.task = 'upload'; 
         fileData.done = item.done;
         fileData.extrapath = this.extrapath;
         fileData.realname = fileData.name; 
         console.log('start upload with ', fileData);
         let apiConfig = {method: 'POST',
                         headers: {'Accept': 'application/json'
                                , 'Content-Type': 'application/json;charset=UTF-8'},
                         body: JSON.stringify(fileData)};
         fetch(this.uploadApi, apiConfig)
         .then(response => response.json())  
         .then(response => { 
           if (response.result == 'ok' && response.size > 0) {
              this.registryDocFile.forEach(element => {
                  if (element.file.name == fileData.name) {
                     console.log('set as done');
                     element.done = true;
                  }
              });
              this.$emit("UploadSuccess", fileData.name);
           } else {
             alert('Something went wrong with the upload: (' + response.result + response.size
             + ') Possibly a directory with same name');
           }
           fileData = {};
           //Recalc how many files are left.
           this.calculateUploads();
        })
        .catch((err)=>{
            console.log('UP: Error : ', err);
        });
    }        
  },
   watch: {
      registryDocFile : function(){
        //Wait for handy uploader to add/remove a file..
        //this.registryDocFile[this.registryDocFile.length-1].done = false;
        if(this.registryDocFile.length > 0) {
          this.calculateUploads();
        }
      },
   }
}
</script>

<style scoped>
.v-expansion-panel {
    max-width: 620px
}
</style>