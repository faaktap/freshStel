<template>
<div>
    <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall109.jpg"
              title="Kuiliesonline Ask a Question"
              text=""
              breakup1="100"
              breakup2="20"
    />

<v-toolbar  dense  row  wrap>
   Ask a Question
    <v-spacer/>
    <v-btn icon @click="addNewOne()" title="Ask a Question">
      <v-icon color="primary"> mdi-plus </v-icon>
    </v-btn>
    <v-back class="float-right" />
</v-toolbar>


     <typical-edit-form
        v-if="schema && Object.keys(schema).length > 0 && working==false"
        :model="currentRecord.model"
        :schema="schema"
        :col=12
        @click="getData"
        @blur="getData"
        @done="WeCanClose"
    >
     </typical-edit-form>
</div>
</template>

<script>
import HeroSection from "@/views/sections/HeroSection.vue"
import VBack from '@/components/base/VBack.vue'
function cl(...args) {console.log('addFaq:' ,...args)}
import { uploads } from '@/api/uploads.js'
import TypicalEditForm from "@/components/vfbase/TypicalEditForm.vue"
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { questionSchema } from "@/api/faqFormSchema.js";
export default {
  name: "addFaq",

  props: {
    faqid: {default: 0}
  },
  components: {
      TypicalEditForm
    , HeroSection
    , VBack
  },
  data: () => ({
    getZml: getters.getState({ object: "gZml" }),
    faqList: [],
    currentRecord: {},
    schema: {},
    cleanModel: {},
    newFileList: [],
    resultList: [],
    working: false,
  }),
  methods:{
    getData(msg) {
       cl('Data we got back:',msg)
       this.currentRecord.model = msg
       cl('Files???', this.currentRecord.model.fileFaq)

    },
    WeCanClose(msg) {
      //User pressed Save on form - now we can process - either insert or edit.
      this.working = true
      cl('WeCanClose', this.currentRecord.model)

      //Look if user added any new files...
      uploads.fieldnames = []
      uploads.files = []
      this.newFileList = []
      this.newFileList = uploads.huntForFiles(this.currentRecord.model, this.newFileList)
      cl('-----------------------', uploads.fieldnames.length, uploads.fieldnames)
      cl('All the files & length:', this.newFileList.length, this.newFileList)

      // If a file was added, we process it and upload it..
      if (this.newFileList.length) {
          let idToLinkFileSomewhere = this.currentRecord.model.id || 111
          let prependWith = 'pre'
          let folderToSaveinFromHome = 'xxx/pfaq'

          //see if we can assign the fieldname here...would be nice.
          for (let i = this.newFileList.length - 1; i >= 0 ; i--) {
              this.newFileList[i].fieldname = uploads.fieldnames[i]
          }
          console.log('DID WE ADD FIELDNAMES????', this.newFileList)
          this.doTheUpload(this.newFileList,idToLinkFileSomewhere,prependWith, folderToSaveinFromHome)
      } else {
        this.saveDB()
      }
    },
    doTheUpload(fileList, id, prepend, extraPath) {
      cl('doTheUpload')
      //Pass the user info to upload, for linking file in cr_file
      uploads.user = this.getZml.login //{'fullname': this.$super.fullname, 'userid': this.$super.userid}
      //Step thru files, add properties needed, and call upload for each file.
      fileList.forEach(file => {
          this.$cs.l('uw adding one by one', file, file.fieldname)
          file.id = id
          file.pre = prepend
          file.realname = prepend + file.name
          file.extrapath = extraPath
          uploads.addSingleFile(file)
      })
      // zml - leave this one for the moments..... uploads.makeAWait(6200, this.checkQ)
      uploads.makeAWait(1200, uploads.uploadStart,this.checkQ)
    },
    checkQ(resp) {
      cl('checkQ')
      if (resp && resp.filename) {
        this.resultList.push(resp)
        if (this.resultList.length == this.newFileList.length) {
          cl('THE LAST ONE CAME IN.....')
          this.uploadsDelivered()
        }
      }
    },
    uploadsDelivered() {
      cl('uploadsDelivered')
      // here we will load the cleanmodel for saving data.
      this.cleanModel = {}
      try {
          this.cleanModel = JSON.parse(JSON.stringify(this.currentRecord.model))
      }
      catch (err) {
          cl('error parsing JSON (this.curRec.model) :', err)
      }
      //Save the actual filepath into the field, when we read again, we need to take it out, and assign to img..
      //We do it just here --  but fileName is path & name without /home/sdfsdf/public_html
      //filename with small name is just the name.
      this.resultList.forEach(e => {
         this.cleanModel[e.fieldname] = {}  // make fileinnput an empty object, since we save in imgName
         let imgName = 'img' + e.fieldname.substring(4,100)
         this.cleanModel[imgName] = e.fileName
      })
      this.currentRecord.model = {}
      this.currentRecord.model = this.cleanModel
      this.newFileList = []
      uploads.files = []
      uploads.fieldnames = []
      cl('we have cleaned up the previous data, but still need to save stuff....', uploads.files)
      this.working = false
      this.saveDB()

    },
    saveDB() {
      cl('saveDB - we are saving: curRec:::', this.currentRecord)
      let t = {}
      t.task = "SaveFaq";
      t.action = "trying to save faq information";
      t.workDone = "WAIT";
      t.data = this.currentRecord
      t.data.name = this.currentRecord.model.name; //assign the json name back to fieldname (there might be other values too)
      t.user = {'fullname': this.$super.fullname, 'userid': this.$super.userid}
      zmlFetch(t, this.afterSave, this.afterSave);
    },
    afterSave(response) {
      cl("save after", response);
      this.$router.back()
    },
    showForm(fid) {
      this.working = true
      let faq = this.faqList.find(e => e.id == fid)
      if (faq) {
        cl(faq)
        this.schema = questionSchema
        this.currentRecord = faq
      }
      setTimeout(() => this.working = false, 200)
    },
    loadDB() {
      let t = {}
      t.task = "GetFaq";
      t.action = "loading faqs information";
      t.workDone = "WAIT";
      zmlFetch(t, this.loadData, this.loadError);
    },
    loadData(response) {
      this.faqList = []
      if ('error' in response && response.error.includes('We did not find any')) {
        alert(response.error)
        this.addNewOne()
        return
      }
      this.faqList = JSON.parse(JSON.stringify(response))
      this.faqList = []
      if (response && response.length) {
        response.forEach((e) => {
          e.model = JSON.parse(e.jdocstructure)
          e.model.fileFaq = {}
          this.faqList.push(e)
        })
      }
      cl("after all was read an processed list5", this.faqList);
      if (this.faqid) {
        this.showForm(this.faqid)
      } else {
        this.addNewOne()
      }
    },
    addNewOne() {
     this.working = true
     this.schema = questionSchema
     this.currentRecord.model = {}
     this.currentRecord = {}
     this.currentRecord.id = 0
     this.currentRecord.model = {faqOriginator: 'Your Name'}
     setTimeout(() => this.working = false, 400)
    }
  },
  mounted() {
    console.log('Test7 : Mount', window)
    this.loadDB()
 },
 watch:{
  allfiles() {
    this.checkQ()
  }
 }
}
</script>