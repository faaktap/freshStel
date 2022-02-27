<template>
  <v-container>
    <v-text-field
      v-if="['admin','teacher'].includes(getZml.login.type)"
      v-model="search"
      label="Search for any email address"
      single-line
      solo
      append-icon="mdi-magnify"
      title="Search for another email"
    />
    <p>
      If the same email appear multiple times, it is usually linked to more than
      one group. This will be fixed later - since we want to link emails to
      different groups rather than have double subscribers.
    </p>
    <!-- sfd: = {{ studentFoundDetails }} <br> -->
    <v-data-table
      :headers="subListHeader"
      :items="subList"
      :items-per-page="15"
      class="elevation-2"
      :loading="loading"
      @click:row="clickOnSubRow"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
      </template>
      <template v-slot:[`footer.page-text`]>
        <v-btn icon @click="allocate()"><v-icon>mdi-table-plus</v-icon></v-btn>
      </template>
    </v-data-table>

    <!------------------- E D I T  S U B S C R I B E R -->
    <v-dialog v-model="showEmail" v-if="['admin','teacher'].includes(getZml.login.type)">
      <v-card color="blue">
        <v-card-title class="justify-center">
          <v-card class="ma-2 pa-2">
            Admission Number : {{ this.subListRecord.impnumber }},
            {{ this.subListRecord.extra }} , {{ this.subListRecord.subid }}
          </v-card>
        </v-card-title>
        <v-card-text>
          {{ subscriberModel.subModel }}
          <v-form-base
            autocomplete="off"
            id="subscriberForm"
            :model="subscriberModel.subModel"
            :schema="subscriberModel.subSchema"
            :col="12"
            @click="test"
            @blur="test"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveAnyChanges" class="ma-2" primary> Save </v-btn>
          <v-spacer />
          <v-btn @click="showEmail = false" class="ma-2"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!------------------- A D D  S U B S C R I B E R -->
    <v-dialog v-model="showAddEmail">
      <v-card color="white" class="ma-2">
        <v-card-title class="justify-center">
          <v-card class="ma-2 pa-2">
            Provide information for email insert
          </v-card>
        </v-card-title>
        <v-layout>
          <v-flex class="ma-2 pa-2">Please provide a student </v-flex>
          <v-flex class="ma-2 pa-2">
            <student-lookup @dataEntered="studentFound" :searchMore="true" />
          </v-flex>
        </v-layout>
        <v-card-text>
          <v-card class="ma-2 pa-2 text-center">
            <h2>Current Student : {{ currentStudentForInsert }}</h2>
          </v-card>
          <!-- <br> {{ studentFoundDetails }}
     <br> model:{{ subscriberModel.subModelInsert }}
     <br> schema:{{ subscriberModel.subSchemaInsert }} -->
          <v-form-base
            autocomplete="off"
            id="subscriberInsertForm"
            :model="subscriberModel.subModelInsert"
            :schema="subscriberModel.subSchemaInsert"
            :col="12"
            @click="test"
            @blur="test"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="insertNewSubscriber" class="ma-2" primary>
            Save
          </v-btn>
          <v-spacer />
          <v-btn @click="showAddEmail = false" class="ma-2"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
function is_Numeric(num) {  return !isNaN(parseFloat(num)) && isFinite(num);      }

import VFormBase from "@/components/vfbase/VFormBase"
import StudentLookup from "@/components/student/StudentLookup"
import { infoSnackbar } from "@/api/GlobalActions"
import { zData } from "@/api/zGetBackgroundData.js"
import { subscriberModel } from "./subscriberModel.js"
import { debounce } from "@/api/timer"
import { getters } from "@/api/store.js"
export default {
  name: "SubscriberEdit",
  components: { VFormBase, StudentLookup },
  props: ["subid"],
  data: () => ({
    getZml : getters.getState({ object: "gZml" }),
    debounce: debounce,
    subscriberModel: subscriberModel,
    studentFoundDetails: null,
    search: null,
    myModelBefore: {},
    api: "https://kuiliesonline.co.za/api/dkhs/dkhs.php",
    loading: false,
    zData: zData,
    showEmail: false,
    showAddEmail: false,
    currentStudentForInsert: null,
    subListRecord: {
      impnumber: "",
      extra: "",
      email: "",
      inserted: "",
      name: "",
      description: "",
      subid: "",
      outid: null,
    },
    subList: [
      {
        impnumber: "",
        extra: "",
        email: "",
        inserted: "",
        name: "",
        description: "",
        subid: "",
        outid: null,
      },
    ],
    subListHeader: [
      { text: "email", align: "start", value: "email" },
      { text: "Inserted", align: "start", value: "insertdate" },
      { text: "impNumber", align: "start", value: "impnumber" },
      { text: "name", align: "start", value: "name" },
      { text: "OptOut", value: "description" },
      { text: "Changed", align: "start", value: "changedate" },
      //{text: 'Note',     align: 'start',  value: 'extra' },
      { text: "Group", align: "start", value: "grpname" },
      //{text: 'SubID',    align: 'start',  value: 'subid' },
      { text: "Actions", sortable: false, value: "actions" },
    ],
    emailGroups: [
      { grpid: 1, grpname: "some group name" },
      { grpid: 2, grpname: "some other group name" },
    ],
  }),
  methods: {
    test(e) {
       console.log("test click on form", e)
    },
    insertNewSubscriber() {
      //Here we will process subscriberModel.subModelInsert and subscriberModel.subSchemaInsert
      // console.log(this.subscriberModel.subModelInsert)
      if (
        this.subscriberModel.subSchemaInsert.top.schema.groups.model.length == 0
      ) {
        infoSnackbar("please select a group!", "red")
        return
      }
      let grpIndex =
        this.subscriberModel.subSchemaInsert.top.schema.groups.model[0]
      //let grpid = this.subscriberModel.subModelInsert.groups[grpIndex].grpid
      let impnumber = this.subscriberModel.subModelInsert.impnumber
      let name = this.subscriberModel.subModelInsert.name
      let email = this.subscriberModel.subModelInsert.email
      let extra = this.subscriberModel.subModelInsert.extra

      // console.log(grpIndex, grpid, impnumber, name, email, extra)

      if (email == "name@company.com") {
        infoSnackbar("please type a better email in at email entry!", "red")
        return
      }
      if (name.includes("?")) {
        infoSnackbar("Make sure about the name?", "red")
        return
      }
      if (impnumber < 9999) {
        infoSnackbar("StudentID not good", "red")
        return
      }
      if (grpIndex == -1) {
        infoSnackbar("Select at least one group", "red")
        return
      }
      //save the grpid to use later...
      this.subscriberModel.subModelInsert.grpid =
        this.subscriberModel.subModelInsert.groups[grpIndex].grpid
      let sqlStatement =
        `INSERT INTO m_subscriber values (null ` +
        ` ,"${email}"` +
        ` ,"${impnumber}"` +
        ` ,"${name}"` +
        ` ,null, null, null` +
        ` ,"${extra}")`
      zData.loadSql(
        this.loading,
        sqlStatement,
        this.afterInsertSubscriber,
        this.api
      )
    },
    afterInsertSubscriber(response) {
      if (response.errorcode != 0) {
        infoSnackbar("something went wrong " + response.error, "red")
        return
      }
      let sqlStatement =
        `select subid from m_subscriber ` +
        ` where email = "${this.subscriberModel.subModelInsert.email}"`
      zData.loadSql(
        this.loading,
        sqlStatement,
        this.afterNewSubscriberID,
        this.api
      )
    },
    afterNewSubscriberID(response) {
      let subid = response[0].subid
      if (subid) {
        let sqlStatement =
          `insert into m_grouplink values (null` +
          `, ${subid} , ${this.subscriberModel.subModelInsert.grpid} )`
        zData.loadSql(
          this.loading,
          sqlStatement,
          this.finalNewSubscriberInsert,
          this.api
        )
      }
    },
    finalNewSubscriberInsert(response) {
      if (response.errorcode != 0) {
        infoSnackbar(
          "something went wrong on grpinsert " + response.error,
          "red"
        )
      }
      this.showAddEmail = false
    },
    saveAnyChanges() {
      // compare to see if any changes
      // myModelBefore was saved before we made changes.
      let before = JSON.parse(subscriberModel.subModelBefore)
      let after = subscriberModel.subModel
      let updateString = ""

      //Create updateString with all changes made by user
      // updateString = subscriberModel.createASqlSetStatement(before, subscriberModel.subModel)
      //The above give and update error on mysql
      // Warning: #1292 Truncated incorrect DOUBLE value: 'Johan Jaars'
      if (before.optout != after.optout) {
        //Handle an edge case
        if (after.optout == "0") {
          after.optout = null
        }
        updateString += updateString
          ? ` and outid = ${after.optout}`
          : ` outid = ${after.optout}`
      }
      if (before.name != after.name) {
        updateString += updateString
          ? ` and name = "${after.name}"`
          : ` name = "${after.name}"`
      }
      if (before.email != after.email) {
        updateString += updateString
          ? ` and email = "${after.email}"`
          : ` email = "${after.email}"`
      }

      // Change so that an updatedate is always created when an update happens
      // alter table m_subscriber modify column changedate timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

      if (updateString) {
        // console.log("updating with : ", updateString)
        let sqlStatement = `\
        UPDATE m_subscriber  \
           SET ${updateString}\
        WHERE subid = ${subscriberModel.subModel.subid}`
        zData.loadSql(this.loading, sqlStatement, this.doneSubUpdate, this.api)
      } else {
        this.showEmail = false
      }
    },
    doneSubUpdate(response) {
      // console.log("after update:", response)
      if (response.errorcode) {
        infoSnackbar(response.error, "red")
        return
      } else {
        infoSnackbar("updated!", "green")
        this.showEmail = false
      }
      this.loadSubEmail()
    },
    //Also see https://forum.vuejs.org/t/how-to-delay-watcher-method-call-on-an-input-field/34321/2
    doNewSearch: debounce(function () {
      infoSnackbar("Looking for " + this.search)
      this.loadSubEmail()
    }, 600),
    allocate(e) {
      console.log("Allocate click on form", e)
      this.subscriberModel.subModelInsert.email = "name@company.com"
      this.subscriberModel.subModelInsert.name += " ?"
      this.showAddEmail = true
    },
    loadSubEmail() {
      if (!this.search) {
        this.loadSub()
        return
      }
      let sqlStatement = `\
SELECT s.email, s.name, s.extra ,impnumber \
     , ifnull(m.description,'Active') description \
     , date_format(insertdate,'%Y/%m/%d') insertdate \
     , date_format(changedate,'%Y/%m/%d') changedate \
     , extra, s.subid, grpname, m.outid \
 FROM m_subscriber s  \
left join m_out m on s.outid = m.outid \
left join m_grouplink g on s.subid = g.subid \
left join m_group a on a.grpid = g.grpid \
WHERE email like '%${this.search}%'`
      zData.loadSql(this.loading, sqlStatement, this.assignSubData, this.api)
    },
    loadSub() {
      if (!is_Numeric(this.subid)) {
         this.search = this.subid
         this.loadSubEmail()
         return
      }
      let sqlStatement = `\
SELECT s.email, s.name, s.extra ,impnumber \
     , ifnull(m.description,'Active') description
     , date_format(insertdate,'%Y/%m/%d') insertdate , date_format(changedate,'%Y/%m/%d') changedate \
     , extra, s.subid, grpname, m.outid \
 FROM m_subscriber s \
LEFT JOIN m_out m on s.outid = m.outid \
LEFT JOIN m_grouplink g on s.subid = g.subid \
LEFT JOIN m_group a on a.grpid = g.grpid \
WHERE email in  (select email from m_subscriber where subid = ${this.subid})`
      zData.loadSql(this.loading, sqlStatement, this.assignSubData, this.api)
    },
    assignSubData(response) {
      if (response.length == 0 || response.error) {
        infoSnackbar("Some error occured fetching subscriber!", "red")
        return
      }
      // console.log("assign subdata", response)
      if (response.length > 0) {
        this.subList = response
        // console.log("subModel:", subscriberModel.subModel)
      }
    },
    edit(currentRowRecord) {
      this.subListRecord = currentRowRecord
      // console.log("what info do we get here?", currentRowRecord)
      subscriberModel.subModel.schoolno = this.subListRecord.impnumber
      subscriberModel.subModel.name = this.subListRecord.name
      subscriberModel.subModel.email = this.subListRecord.email
      subscriberModel.subModel.grade = this.subListRecord.extra
      subscriberModel.subModel.optout =
        this.subListRecord.outid == null ? "0" : this.subListRecord.outid
      subscriberModel.subModel.subid = this.subListRecord.subid
      subscriberModel.subModel.grpname = this.subListRecord.grpname
      subscriberModel.subModelBefore = JSON.stringify(subscriberModel.subModel)
      //subscriberModel.assignModel(t)
      this.showEmail = true
    },
    clickOnSubRow(currentRowRecord) {
      this.$emit("subscriberChange", currentRowRecord.subid,currentRowRecord)
      if (currentRowRecord.impnumber) {
        this.getStudent(currentRowRecord.impnumber)
      }
    },
    getStudent(admissionNo) {
      if (admissionNo <= 9999) {
        this.studentFoundDetails = {}
        return
      }
      let sqlStatement = `select * from dkhs_student where studentid = ${admissionNo}`
      // console.log("Also fetch : ", sqlStatement)
      zData.loadSql(
        this.loading,
        sqlStatement,
        this.studentFoundbyAdmissionNo,
        this.api
      )
    },
    studentFoundbyAdmissionNo(response) {
      this.studentFoundDetails = response[0] //here we get a list (array)
      // console.log("found data = 1 ", this.studentFoundDetails)
      this.assignStudentData()
    },
    studentFound(studDataFromLookup) {
      if (studDataFromLookup.errorcode == 1) {
        // console.log("for some reason we do a second select!!!!!!!")
        return
      }
      // console.log("wat is hierdie??????", studDataFromLookup)
      this.studentFoundDetails = studDataFromLookup.data //here we get an object
      // console.log("found data 2 = ", this.studentFoundDetails)
      this.assignStudentData()
    },
    assignStudentData() {
      // console.log("assign student data to model for editing or insert??")
      this.subscriberModel.subModelInsert.impnumber =
        this.studentFoundDetails.studentid
      this.subscriberModel.subModelInsert.name =
        this.studentFoundDetails.surname
      this.subscriberModel.subModelInsert.extra =
        this.studentFoundDetails.grade
      this.currentStudentForInsert =
        this.studentFoundDetails.surname +
        ", " +
        this.studentFoundDetails.firstname +
        ", " +
        this.studentFoundDetails.grade
      this.subscriberModel.subModelInsert.groups = this.emailGroups
      this.subscriberModel.subSchemaInsert.top.schema.groups.model = []
    },
    loadEmailGroups() {
      let sqlStatement = `SELECT * FROM m_group`
      zData.loadSql(
        this.loading,
        sqlStatement,
        this.assignEmailGroups,
        this.api
      )
      // console.log("loading groups with", sqlStatement)
    },
    assignEmailGroups(response) {
      this.emailGroups = response
      // console.log("GOT GROUP loading groups with", response)
    },
  },
  mounted() {
    // console.log("start : ", this.$options.name)
    this.subList.length = 0
    this.loadSub()
    this.loadEmailGroups()
  },
  watch: {
    search() {
      this.doNewSearch()
    },
  },
}
</script>

