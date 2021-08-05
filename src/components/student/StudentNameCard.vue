<template>
<!--https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno=20003-->
   <v-card v-if="studentList" class="mx-auto" :color="color" elevation="2" xtile>
     <div class="d-flex flex-no-wrap justify-space-between ma-2">
      <div>
        <v-card-title class="headline" v-text="studentList.data.surname" />
        <v-card-subtitle class="headline">
            <b>{{ studentList.data.firstname }}</b>
            <table class="body-1 pt-2">
            <tr><td> admin</td><td> {{ studentList.data.studentid }} </td></tr>
            <tr><td> idnumber </td> <td>{{ studentList.data.idno }} </td></tr>
            </table>
        </v-card-subtitle>
        </div>
      <div>
      {{ studentList.data.grade }} 
      {{ studentList.data.gclass }} 
      <v-avatar class="ma-3" size="125" tile>
       <v-img 
         :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno='+studentList.data.studentid"
         style="float-right;border-radius:40px;"
         contain>
        </v-img>
      </v-avatar>                 
      </div>
     </div>
     <v-card-text><small>{{ studentList.data.note }},{{ studentList.data.grade }} 
      {{ studentList.data.gclass }}, High school De Kuilen Hoërskool<br> {{new Date()}}</small> </v-card-text>
    </v-card>
</template>

<script>
export default {
    name:"StudentNameCard",
    props: ['studentList','color'],
    mounted: function() {
    }
}
</script>