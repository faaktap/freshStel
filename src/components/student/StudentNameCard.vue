<template>
<!--https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno=20003-->
   <v-card v-if="studentList" class="mx-auto" :color="color" elevation="2" xtile>
     <div class="d-flex flex-no-wrap justify-space-between ma-2">
      <div>
        <v-card-title class="headline">
          <strong>{{ studentList.data.surname }}</strong>
        </v-card-title>
        <v-card-subtitle class="headline">
            <b>{{ studentList.data.firstname }}</b>
            <v-simple-table class="body-1 pt-2 ma-2 pa-2">
            <tr><td> admin &nbsp;</td><td> {{ studentList.data.studentid }} </td></tr>
            <tr><td> id  &nbsp;</td> <td>{{ studentList.data.idno }} </td></tr>
            <tr><td> name  &nbsp;</td> <td>{{ studentList.data.firstname }} {{ studentList.data.surname }}</td></tr>
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
      <br>
      {{ studentList.data.grade }}
      {{ studentList.data.gclass }}
      <!-- <br> -->
      <v-btn small class="ma-2" color="primary"> Edit </v-btn>

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
    mounted() {}
}
</script>