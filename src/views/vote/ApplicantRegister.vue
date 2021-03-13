<template>
  <div class="home">

    <v-card class="ma-2">
     <v-card-title>
      <h2 class="text-center">Add or Update an Applicant</h2>
     </v-card-title>

<v-card-text>

 <v-container class="grey lighten-5" v-if="getZml.login.studentid">
    <v-row no-gutters>
      <v-col sm="4">        
    <v-form
    ref="form"
    >

    <v-text-field
      v-model="IDNo"
      label="IDNo"
      :disabled="!(getZml.login.username=='werner')"
    ></v-text-field>

    <v-text-field
      v-model="Firstname"
      label="Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="Surname"
      label="Surname"
      required
    ></v-text-field>

    <v-text-field
      v-model="EMail"
      label="E-mail"
      required
    ></v-text-field>
       <v-img :src="oldPhoto + '?k-'+Math.random()"
          max-height=200
          contain> </v-img> 
  </v-form>
 </v-col>
 <v-col>
{{ studdata.studentid }} - {{ studdata.grade }}{{ studdata.gclass }} <br>
<v-card color="grey lighten-1" class="ma-2">
  <image-uploader :debug="1" 
        :preview="true"
        :className="['fileinput', { 'fileinput--loaded': hasImage }]"
        capture="environment"
        doNotResize="gif"
        :autoRotate="true"
        :quality="0.7"
        outputFormat="verbose"
        @input="setImage"
      > 
        <v-label for="fileInput" slot="upload-label">
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32" height="32" viewBox="0 0 32 32"
            >
              <path class="path1"
                    d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
              ></path>
            </svg>
          </figure>
          <span class="upload-caption">{{ hasImage ? "OR Replace" : "OR Click to select a photo"}}</span>
        </v-label>
   </image-uploader>
</v-card>
   <v-card v-if="campaignid" color="grey lighten-2" class="ma-2">
     <video-uploader @fileUploaded="receiveResponse" 
                     titleMessage="Select Video" 
                     :extraPath="'/Test/werner/' + campaignid"
                     :triggerUpload="startVideoUpload"
     />
   </v-card>

 </v-col>
</v-row>
</v-container>
</v-card-text>
<v-card-actions>
<v-btn @click="doit()" color="primary"> Upload to Server </v-btn>
<v-spacer />
<v-btn @click="$router.go(-1)" color="primary"> Back </v-btn>
</v-card-actions>
</v-card>
</div>


</template>

<script>
// @ is an alias to /src
import ImageUploader from 'vue-image-upload-resize';
import { getters } from "@/api/store";   
import { zmlFetch } from '@/api/zmlFetch';
import VideoUploader from '@/components/VideoUploader';

export default {
  name: "Home",
  components: {ImageUploader, VideoUploader},
  props:['campaignid'],
  data() {
    return {
      getZml: getters.getState({ object: "gZml" }),      
      IDNo: null,
      Firstname: null,
      Surname: null,
      EMail: null,
      hasImage: false,
      image: null,
      oldPhoto: "https://kuiliesonline.co.za/dkhs.jpg",
      currentPhoto: '',
      studdata:{},
      startVideoUpload:false,
    };
  },
  methods: {
    setImage(output) {
      this.hasImage = true;
      this.image = output;
      //console.log('Info', output.info)
      //console.log('Exif', output.exif)
      //console.log('All', output)
    },
    doit() {
      if (!this.currentPhoto) {
         if (this.hasImage == false) {alert('waar is foto?'); return;}
      }
      if (this.IDNo.length !== 13) {alert('ID Must be 13 Characters / ID moet 13 wees');return;}
      if (!this.EMail) {alert('we need a email as well please!') ; return; }
      this.startVideoUpload += 1
    },
    receiveResponse(response) {
      console.log('RESPONSE FROM videoUploader:' , response)
      if (response.fileName.length > 0) {
        this.doUpdate(response.fileName)
      } else {
        // no video - proceed silently to save 
        this.doUpdate('')
      }
    },
    doUpdate(video) {
      let task = {}
        if (this.image == undefined || this.image.dataUrl == undefined) {
           task = {method: "savecandidatedata",
                    foto: this.currentPhoto, 
                    deliveryid: this.campaignid ,
                    campaignid: this.campaignid ,
                    idno: this.IDNo ,                    
                    realName: this.IDNo,
                    firstname: this.Firstname,
                    surname: this.Surname,
                    email: this.EMail,
                    video: video 
                    };
        } else {
          task = {method: "savecandidatedata",
                    base64: this.image.dataUrl, 
                    deliveryid: this.campaignid ,
                    campaignid: this.campaignid ,
                    idno: this.IDNo ,                    
                    realName: this.IDNo,
                    firstname: this.Firstname,
                    surname: this.Surname,
                    email: this.EMail,
                    video: video,
                    ext: "jpg"};

        }
        console.log('ApplicantRegister:stuff we pass to update or add',task)
        zmlFetch(task,this.resultFunc);
    },
    resultFunc(result) {
        if (result.error == null || result.error == 0) {
           console.log('result',result);
           this.$router.go(-1)
        } else {
           alert('error on saving data:' + result.error);
        }
    },
    fetchID() {
      if (this.IDNo) {
        let task = {method: "getid", idno: this.IDNo} //9912025105088
        zmlFetch(task,this.displayData, this.errorLoad);
      }
    },
    errorLoad(response) {
         console.log('error on getid:', response) 
    },
    displayData(result) {
        this.studdata = result[0]
        if (result.error == null || result.error == 0) {
            this.Firstname = result[0].firstname;
            this.Surname = result[0].surname;
            this.EMail = result[0].email;
            this.IDNo = result[0].idno;
            if (result[0].foto) {
               this.oldPhoto = 'https://kuiliesonline.co.za/' + result[0].foto;
               this.currentPhoto = result[0].foto;
            }
        } else {
            alert('error on getting data:' + result.error);
            this.IDNo = '';
        }
    },
    loadApplicantDetails() {
      //We have the studentno, so we first feth the id...
      if (this.getZml.login.studentid) {
         let ts = {}
         ts.task = 'PlainSql'
         ts.sql = "select * from dkhs_student "
             + " where studentid = " + this.getZml.login.studentid
         zmlFetch(ts, this.loadID, this.errorLoad);      
      }
    },
    loadID(result) {
      //then we read from rvlselect...
      console.log('result on LoadID = ', result)
      if (!Array.isArray(result)) {
          this.$router.go(-1)
      } 
      this.IDNo = result[0].idno
      this.fetchID()
    }
  },
  mounted: function () {
    //here we need to get the details of the student and fill it in here.
    //if we cannot find it, we check if it is ANOTHER student and then do not allow to save.
      if (this.campaignid) this.loadApplicantDetails()
  },
    watch:{
    }
};
</script>
<style scoped>
#fileInput {
  display: none;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.my-8 {
  margin-top: 4rem;
  margin-bottom: 4rem;
}
</style>