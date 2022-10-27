<template>
<!--https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno=20003-->
   <v-card v-if="studentList" :color="color" elevation="2">
     <div class="d-flex flex-no-wrap justify-space-between ma-2">
      <div>
        <v-card-title class="font-weight-light wordbreak text-justify ma-3"> <!--xxclass="headline"-->
          {{ studentList.data.surname }} {{ studentList.data.firstname }}
        </v-card-title>
        <v-card-subtitle >
            <v-simple-table class="body-1 ma-2 pa-2">
            <tr><td v-if="!$vuetify.breakpoint.smAndDown"> admin &nbsp;</td><td> {{ studentList.data.studentid }} </td></tr>
            <tr><td v-if="!$vuetify.breakpoint.smAndDown"> id  &nbsp;</td> <td>{{ studentList.data.idno }} </td></tr>
            <tr><td v-if="!$vuetify.breakpoint.smAndDown"> name  &nbsp;</td> <td>{{ studentList.data.firstname }} {{ studentList.data.surname }}</td></tr>
            </v-simple-table>
        </v-card-subtitle>
        </div>
      <div>
      <v-avatar class="ma-3" size="125" tile>
       <v-img
         :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno='+studentList.data.studentid"
         style="float-right;border-radius:40px;"
         contain>
        </v-img>
      </v-avatar>
      <v-card class="ma-2 pa-2" elevation="2">
      {{ studentList.data.grade }}
      {{ studentList.data.gclass }}
      </v-card>
      </div>
     </div>
     <v-card-text>
      <small>
        High school De Kuilen Hoërskool
        <br>
       {{new Date()}}
     </small>
    </v-card-text>
    </v-card>
</template>

<script>
export default {
    name:"StudentNameCard",
    props: ['studentList','color'],
    methods: {
      // goToStudent() {
      //   this.$router.push("/student/"+this.studentList.data.studentid)
      // }
    },
    mounted() {}
}
</script>