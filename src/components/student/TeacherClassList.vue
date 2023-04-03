<template>
<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>

 <v-toolbar  dense  row  wrap>
   Other Class Lists as needed by Teachers
    <v-spacer></v-spacer>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      class="ma-2"
    />
    <v-select
      v-model="gradeList"
      :items="otherGradeOptions"
      label="Select Grade(s)"
      multiple
      class="ma-2 mt-7"
    >
     <!-- <template v-slot:selection="{ item, index }">
        <v-chip v-if="index === 0"> <span>{{ item }}</span> </v-chip>
        <span v-if="index === 1" class="grey--text caption" >(+{{ gradeList.length - 1 }} others)</span>
     </template> -->
    </v-select>

    <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
    <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>

      <v-btn class="ma-2" icon @click="newList" title="Create a new list" color="primary"> <v-icon>mdi-database-plus</v-icon> New </v-btn>
      <v-btn class="ma-2" icon @click="initialize"> <v-icon>mdi-refresh</v-icon> </v-btn>
 </v-toolbar>
</v-container>

<v-container fluid>
  <!-- <v-layout v-if="showAs=='list'" row wrap align-content-start justify-space-between class="ma-2 pa-2"> -->
    <v-simple-table v-if="showAs=='list'">
      <thead>
      <tr><th>id</th><th>teacher</th><th>listname</th><th></th></tr>
      </thead>
      <tbody>
      <tr v-for="t in teacherListFilter" :key="t.id" class="ma-2 pa-2" color="secondary lighten-3">
        <td class="pa-2 ma-2">{{ t.id }}</td>
        <td class="ma-2" >{{ t.teacher }}</td>
        <td class="ma-2 pa-2">{{ t.listname }}</td>
        <td> <v-btn x-small @click="loadList(t.id)" title="View or Add Students in List" color="primary" class="ma-2"> View </v-btn>
             <v-btn x-small @click="editListName(t.id)" title="Edit Listname or Shared" color="primary" class="ma-2 pa-2"> Edit </v-btn>

        </td>
      </tr>
      </tbody>
    </v-simple-table>
  <!-- </v-layout> -->
  <v-layout v-if="showAs=='card'" row wrap align-content-start justify-space-between class="ma-2 pa-2">
  <v-card v-for="t in teacherListFilter" :key="t.id" class="ma-2 pa-2" color="secondary lighten-3" elevation="4">
    <v-card-title>{{ t.teacher }}  </v-card-title>
    <p>{{ t.listname }}</p>
    <v-card-actions>
      <v-btn small @click="loadList(t.id)" color="primary"> View </v-btn>
      <v-btn small @click="editListName(t.id)" color="primary"> Edit </v-btn>
      <v-spacer />
      <span class="float-right text-caption"> {{ t.id }} </span>
    </v-card-actions>
  </v-card>
  </v-layout>


    <v-dialog v-model="showForm"  :fullscreen="$vuetify.breakpoint.mobile" width="50%">
      <v-card  class="ma-2 pa-2">
        <v-card-title> Teacher Class List {{ formTitle }} </v-card-title>
        <v-card-text column align-content-start justify-space-around>
          <v-text-field v-model="rec.listname" label="List Name" outlined dense />
          <v-autocomplete v-model="rec.teacher" label="Teacher" outlined dense
                          :items="getZml.persMenemonic"
                          :item-text="teacherInitSurname"
                          :item-value="teacherInitSurname"  />
          <v-combobox v-model="rec.grade" :items="otherGradeOptions" label="grade"/>
          <v-radio-group v-model="rec.share" label="Shared" outlined dense  row>
            <v-radio label="Yes" value="Y" />
            <v-radio label="No" value="N" />
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn small @click="save" color="primary"> save </v-btn>
          <v-btn small @click="showForm = false"> ignore </v-btn>
          <v-spacer />
          <v-btn v-if="rec.id"
                 small @click="basedOnOtherList = !basedOnOtherList"
                 title="Add students based on other list, you can delete some of them later"
                 class="primary">
                Add All Students from other List
          </v-btn>
        </v-card-actions>
        <v-textarea v-model="rec.jdocstructure" label="Other List Criteria" outlined dense />
        <v-card-text v-if="basedOnOtherList">
           <v-btn class="ma-1" v-for="t in tList" :key="t.id" @click="addStudentsToList(t.id)"> {{ t.listname }} </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

</v-container>

<!-- <teacher-class-edit :listID="passedListID" /> -->

 <!-- tList =  {{ tList }} -->

<!-- <v-container fluid>
 <v-row>
  <v-col cols="12" sm="6">
   <subject-display-short />
  </v-col>
 </v-row>
</v-container> -->

</div>
</template>


<script>
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import { clWork } from "@/components/homework/ClassListWork.js"
import { zData } from "@/api/zGetBackgroundData.js"
import { ls } from "@/api/localStorage.js"
import { infoSnackbar } from '../../api/GlobalActions';
const ADD_LIST_TITLE = "Create New List"
export default {
  name: "TeacherClassList",
  props:{},
  components: {},
  data: () => ({
    gradeList: [],
    otherGradeOptions:['G07','G08','G09','G10','G11','G12'],
    getZml: getters.getState({ object: "gZml" }),
    search: '',
    tList: [],
    rec: {listname:''},
    formTitle: '',
    showForm: false,
    passedListID: '',
    basedOnOtherList: false,
    showAs: 'list',
  }),
  methods:{
    initialize() {
      console.log('initialize')
      if (ls.test('zmlTCL-GradeList') && ls.test('zmlTCL-Search')) {
        this.gradeList = ls.load('zmlTCL-GradeList')
        this.search = ''
      }
      let ts = {}
      ts.task = 'PlainSql'
      ts.sql = "select * from hw_classlist"
      zmlFetch(ts, this.loadData, this.errorLoading)
    },
    newList() {
      let pers = this.getZml.persMenemonic.find(e=> e.userid == this.getZml.login.userid)
      if (! ('name' in pers)) {
        alert('error - we do not have a good personel list - cannot add anything')
        return
      }
      console.log(pers)
      this.rec.teacher = pers.name.substr(0,1).toUpperCase() + ' ' + pers.surname.toUpperCase()
      this.rec.id = 0
      this.rec.listname = 'Please type your listname here (' + pers.user_name + ')'
      this.defaultListname = this.rec.listname
      this.rec.grade = 'G10'
      this.rec.share = 'Y'
      this.formTitle = ADD_LIST_TITLE
      this.showForm = true
    },
    editListName(listID) {
      this.rec = this.tList.find(e => e.id == listID)
      this.formTitle = "Edit : " + listID
      this.showForm = true
    },
    addStudentsToList(id) {
      if (!this.rec.listname || this.rec.listname == this.defaultListname) {
        infoSnackbar('please fill in a new name, and make sure all other information is filled in, we wil...')
        this.basedOnOtherList = false
        return
      }
      alert('we want to add all students belonging to list ' + id + ' to our list ' + this.rec.id)
      if (!this.rec.id) {
        alert('not yet - list not created yet!')
        this.basedOnOtherList = false
        return
      }
      clWork.addStudentsToList(this.rec.id, id)
      this.showForm = false
      this.basedOnOtherList = false
    },
    save() {
      if (this.formTitle == ADD_LIST_TITLE) {
         clWork.addList(this.rec)
      } else {
         //if (this.rec.jdocstructure) this.rec.jdocstructure = JSON.stringify(this.rec.jdocstructure)
         // alert('Before save:' + this.rec.jdocstructure)
         clWork.updateList(this.rec)
      }
      this.showForm = false
    },
    loadData(response) {
      console.log('loaddata')
      this.tList = response
    },
    errorLoading(response) {
      alert('some error')
      console.log('error on fetch', response)
    },
    loadList(listID) {
      ls.save('zmlTCL-GradeList',this.gradeList)
      this.passedListID = listID
      this.$router.push({ name: 'TeacherClassEdit', params: {listID: listID}})
    },

  },
  computed:{
   teacherInitSurname() {
      return item => item.name.substr(0,1).toUpperCase() + ' ' + item.surname.toUpperCase()
   },
   teacherListFilter() {
      if (!this.tList.length) return [];
      let answer = this.tList

      if (this.gradeList.length > 0 && this.gradeList.length < 4) {
         answer = this.tList.filter( ele => this.gradeList.some(e => (e == ele.grade) ))
      }

      if (this.search.length ) {
        let newanswer = answer.filter(ele => {
          //console.log(ele.teacher.toUpperCase(),this.search.toUpperCase() )
          if (ele.teacher.toUpperCase().indexOf(this.search.toUpperCase()) > -1) return true
          if (ele.listname.toUpperCase().indexOf(this.search.toUpperCase()) > -1) return true
          if (ele.id.indexOf(this.search) > -1) return true
          if (ele.create_timestamp.indexOf(this.search) > -1) return true
          return false
        });
        //alert('search must still be implemented')
        answer = newanswer
      }
      return answer
    }
  },
  created() {
    console.log('MC:',this.$options.name)
    zData.quickLoadInitialData('QuickLoad',this.initialize)
  },
  mounted() {
  }
}

</script>
