<template>
 <v-container>
  <v-card>
   <v-card-title>
   <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
   />
   </v-card-title>
   <v-card-text>
   <v-data-table
      :headers="headers"
      :items="studentAwards"
      :search="search"
      :items-per-page=itemsPerPage
   >
    </v-data-table>
    </v-card-text>
    </v-card>

 </v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
  export default {
    components: {},
    data () {
      return {
        version: '1a',
        pagination: {},
        headers: [],
        studentAwards: [],
        studentList: [],
        search:"",
        itemsPerPage:16,
      }
    },
    methods: {
      loadStudentAwardsDone(response) {
        //console.log('Awards : ', response);
        this.studentAwards = response.allInfo;
        this.studentList = response.studentlist;
        /*AllInfo ........
        awardid: "474"
        awardname: "HALF COLOURS"
        ditype: "AWR"
        firstname: "ALWABA"
        gclass: "E5"
        grade: "G10"
        subjectname: "Leadership"
        surname: "DWABA"
        sutype: "AWR" */

        /*studentlist .......
         awardid: "474"
         count: "1"
         firstname: "ALWABA"
         gclass: "E5"
         grade: "G10"
         surname: "DWABA" */

        this.headers = [
          { text: 'id', align: 'start',   sortable: true,   value: 'awardid'},
          { text: 'DiplomaID', value: 'diplomaid' },
          { text: 'SubjectID', value: 'subjectid' },
          { text: 'Surname', value: 'surname' },
          { text: 'Firstname', value: 'firstname' },
          { text: 'Award', value: 'awardname' },
          { text: 'Subject', value: 'subjectname' },
          { text: 'Note', value: 'note' },
          { text: 'Grade', value: 'grade' },
          { text: 'Class', value: 'gclass' },
          ];      
      },
      loadError(error) {
        console.log(error);
        alert('Nothing loaded yet (possibly) - error : ' + error);
      },      
    },
    mounted: function () {
      zmlConfig.cl('mount : ', this.$options.name, this.$children.length);
      zmlFetch({task: 'getStudentAwards'}, this.loadStudentAwardsDone, this.loadError);         
    },    
  }
</script>