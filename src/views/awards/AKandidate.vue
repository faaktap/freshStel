<template>

<div>
    <v-btn @click="getAKandidate"> get them </v-btn>
<div v-if="studentList">
    
    <v-card  v-for="s in studentList" :key="s.studentno" max-height="300" class="ma-2" color="#102829">
      <div class="d-flex flex-no-wrap justify-space-around ">
        <v-card>
      <v-img :src="'https://kuiliesonline.co.za/' + s.photo"
             max-height="200" width="200"       />
        </v-card>
        <v-card align="left">
       {{ s.firstname }} {{ s.surname }}
        </v-card>
      </div>
    </v-card>
</div>    
</div>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
export default {
    components: {},
    data: () => ({
        studentList:[]
    }),
    methods: {
      getAKandidate() {
          let ts = {}
          ts.task = 'PlainSql'
          ts.sql = "select photo, studentno, s.firstname,s.surname, s.grade, s.gclass from dkhs_photo p, dkhs_student_archive s "
                 + " where p.studentno = s.studentid"
                 + " and p.studentno in (16284,	16167,	16128,	16076,	16103,	16073,	16098,	16222,	16276,"	
                 + " 16274,	16724,16138,16044,16028,16186,16069)"
          zmlFetch(ts, this.processData, this.loadError);      
      },
      processData(response) {
         this.studentList = response
      },
      loadError(response){
          console.log("ERROR", response)
      }
    },
    mounted: function() {
        this.getAKandidate
    }
}




/*
*/
</script>

<style scoped>
.rounded-card {
  border-radius: 40%; 
  max-width: 300px;
}
</style>