<template>
<div>

   <v-layout flex row wrap>
    <v-text-field label="Label" x-small v-model="label"  class="ma-2 pa-2" />
    <v-text-field label="title" x-small v-model="title" class="ma-2 pa-2" />
  </v-layout>

  <v-btn @click="assignSchema"> assign schema </v-btn>


<pre>
    Example :  fileTest1: { type: "file", label: this.label,showSize: true, counter: true, outlined:true
                       , accept: "image/*", multiple: true}
</pre>


<hr>

    <!-- <v-form-base -->
     <typical-edit-form
        v-if="schema && Object.keys(schema).length > 0 && working==false"
        id="test6"
        :model="model"
        :schema="schema"
        :col=12
        @click="getData"
        @blur="getData"
        @done="WeCanClose"
    >
     <template #slot-top-type-form-base-slot-btn-toggle="{obj}">
          <h4 class="slot">
            Slot at Top of Type 'Btn-Toggle' - {{obj.value}}
          </h4>
     </template>

     </typical-edit-form>
  <!-- </v-form-base> -->
<hr>
     AnswerModel::: {{ model }}
     <br>
     cleanModel:::: {{ cleanModel }}
     <br>
     resultList:::: {{ resultList }}
     <br>
     newFileList:::: {{ newFileList}}
     <v-btn @click="test"> test </v-btn>
     files====={{ files }}

</div>
</template>

<script>
function cl(...args) {
      console.log('t7:' ,...args);
}
const icons = ['mdi-microsoft-word','mdi-microsoft-excel',  ,'mdi-microsoft-powerpoint','mdi-microsoft-teams','mdi-microsoft-office','mdi-microsoft-internet-explorer',
              ,'mdi-google-chrome','mdi-rugby', 'mdi-vector-difference','mdi-microsoft-outlook','mdi-microsoft-windows','mdi-account-school'
              ,'mdi-school','mdi-kettle','mdi-brain',"mdi-email","mdi-palette","mdi-phone","mdi-timer","mdi-adjust",'mdi-wiper',"mdi-calendar"
              ,'mdi-alien','mdi-emoticon-cool-outline','mdi-emoticon-angry','mdi-emoticon-confused','mdi-emoticon-devil','mdi-emoticon-happy']
import { uploads } from '@/api/uploads.js'
import TypicalEditForm from "@/components/vfbase/TypicalEditForm.vue"
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
export default {
  name: "Test7Up",
  props: {},
  components: {TypicalEditForm},
  data: () => ({
    getZml: getters.getState({ object: "gZml" }),
    schema: {},
    model: {},
    cleanModel: {},
    title: 'Heading for Test a file upload form vformbase',
    color: 'indigo lighten-5',
    label: 'choose a file',
//    allfiles:[],
    newFileList: [],
    resultList: [],
    working: false,
    files:[]
  }),
  methods:{
    getData(msg) {
       cl('Data we got back:',msg)
       this.model = msg
       cl('Files???', this.model.fileTest1, this.model.fileTest2)
       this.cleanModel = JSON.parse(JSON.stringify(this.model))
       this.cleanModel.fileTest1 = 'DONE!'

    },
    WeCanClose(msg) {
      this.working = true
      let idToLinkFileSomewhere = 111
      let prependWith = 'pre'
      let folderToSaveinFromHome = 'xxx/pfaq'
        this.model = msg
        cl('We received a model:', this.model)
        this.newFileList = uploads.huntForFiles(this.model, this.newFileList)
        cl('-----------------------', uploads.fieldnames.length, uploads.fieldnames)
        cl('All the files length:', this.newFileList.length, this.newFileList)

        if (this.newFileList.length) {
                           //files,'prodit',pfaq??, folderFromHome
            //see if we can assign the fieldname here...would be nice.
            for (let i = this.newFileList.length - 1; i >= 0 ; i--) {
              this.newFileList[i].fieldname = uploads.fieldnames[i]
            }
            console.log('DID WE ADD FIELDNAMES????', this.newFileList)
            this.doTheUpload(this.newFileList,idToLinkFileSomewhere,prependWith, folderToSaveinFromHome)
        }
    },
    doTheUpload(fileList, id, prepend, extraPath) {
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
    test() {
        //this.cleanModel.FileTest2
    },
    uploadsDelivered() {
      // here we will load the cleanmodel.

      this.cleanModel = {}
      try {
          this.cleanModel = JSON.parse(JSON.stringify(this.model))
      }
      catch (err) {
          cl('error parsing JSON (this.model) :', err)
      }
      //Save the actual filepath into the field, when we read again, we need to takethe out, and assign to img..
      // Or we can do it here?
      this.resultList.forEach(e => {
         this.cleanModel[e.fieldname] = e.filePath
         let imgName = 'img' + e.fieldname.substring(4,100)
         this.cleanModel[imgName] = e.filePath
      })
      this.model = {}
      this.newFileList = []
      uploads.files = []
      uploads.fieldnames = []
      cl('we have cleaned up the previous data, but still need to save stuff....', uploads.files)
      this.working = false
      this.saveDB()

    },
    saveDB() {
      let t = {}
      t.task = "SaveFaq";
      t.action = "trying to save faq information";
      t.workDone = "WAIT";
      t.data = {id:0, name:''}
      t.data.model = this.cleanModel
      t.data.name = this.cleanModel.name; //actually the question?
      t.user = {'fullname': this.$super.fullname, 'userid': this.$super.userid}
      zmlFetch(t, this.afterSave, this.afterSave);
    },
     afterSave(response) {
      cl("save after", response);
     },
    checkQ(resp) {
      console.log('ChecQ - CallBack2', resp)
      console.log('ChecQ - CallBack3', uploads.files.length)
      if (resp && resp.filename) {
        cl('ChecQ - We Are Done With', resp.filename, resp.fileid, resp.fileName)
        this.resultList.push(resp)

        cl('compare size', this.resultList.length ,this.newFileList.length ,uploads.files.length)
        if (this.resultList.length == this.newFileList.length) {
          cl('THE LAST ONE CAME IN.....')
          this.uploadsDelivered()
        }
      }
      if (!resp) {
         cl('We get a final call to CheckQ, from out makeAwAit - can ignore')
      }
    },
    assignSchema() {
     const options = ['A', 'B', 'C']

     this.model = {fileTest2: '/xxx/pfaq/preAminMenu.jpg'
                 , faqOriginator: 'Werner Smit'
                 , fileTest1: '/xxx/pfaq//preGeneralClassListSelectSmall.jpg'}
     //we need to clean all file related stuff, otherwise we'll get errors
     this.model.imgTest2 = 'https://kuiliesonline.co.za/' + this.model.fileTest2
     this.model.fileTest2 = {}
     this.model.imgTest1 = 'https://kuiliesonline.co.za/' + this.model.fileTest1
     this.model.fileTest1 = {}
     //we could set this up beforehand?
     let propImgTest1 = { type: "img",  contain: true,width: 200, src:this.model.imgTest1, col: {cols:6 },class: "ma-2 pa-2"}

      this.schema = {
        group1:
            { type: "wrap"
            , col: { cols : 12}
            , ripple: false
            , class: "title pa-2 elevation-4"
            , schema:{
               dummy1: { type: 'head', title: this.title, class:'mb-6'}
             , name:{ type: 'text', label: 'What is the Question?', hint: '', col: {cols:12, md:6}, class: "ma-2 pa-2", outlined:true}
             , faqOriginator:{ type: 'text', label: 'Questioner (You)', hint: '', col: {cols:12, md:6}, class: "ma-2 pa-2", outlined:true}
             , fgroup1: { type: "wrap", col: {cols:12 }, label: "F Group 1",class: "title pa-2 rounded elevation-4"
               , schema: {
                  dummy1: { type: 'head', title: 'this is for fgrp1', class:'mb-6'}
                , imgTest1:  { type: "img",  contain: true,width: 200, src:this.model.imgTest1, col: {cols:6 },class: "ma-2 pa-2", label:'imglabel1', text:'imgtext1'}
                , fileTest1: { type: "file", label: this.label,showSize: true, counter: true, outlined:true, accept: "image/*", multiple: true, col: {cols:6 }}
               }}
             , fgroup2: { type: "wrap", col: {cols:12 }, label: "F Group 1",class: "title pa-2 rounded elevation-4"
               , schema: {
                   dummy2: { type: 'head', title: 'this is for fgrp2', class:'mb-6'}
                 , imgTest2:  { type: "img",  contain: true,width: 200, src:this.model.imgTest2, col: {cols:6 },class: "ma-2 pa-2", click: 'dddddd'}
                 , fileTest2: { type: "file", label: "Upload some file 2",showSize: true, counter: true, outlined:true, accept: "image/*", multiple: true, col: {cols:6 }}
             }}
             , faqIcon: { type: 'autocomplete', label: 'Icon', hint: '', items: icons, col: {cols:12, md:3}, class: "ma-2 pa-2", outlined:true}
             , faqAnswer: { type: 'textarea', label: 'Notes', hint: '', col: {cols:12, md:9}, class:"ma-2 pa-2", outlined:true}
            }}
       }
    }
  },
  mounted() {
    console.log('Test7 : Mount', window)
    this.assignSchema()
 },
 watch:{
  allfiles() {
    this.checkQ()
  }
 }
}
</script>