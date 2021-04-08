<template>
<!--https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno=20003-->
  <v-container v-if="studentList" color="silver">
   <v-card max-width="500" class="mx-auto" color="green darken-1">
     <div class="d-flex flex-no-wrap justify-space-between ma-3">
      <div>
        <v-card-title class="headline" v-text="studentList.data.surname"></v-card-title>
        <v-card-subtitle >
            <b>{{ studentList.data.firstname }}</b> ( {{ studentList.data.studentid }} )
            <br>ID: {{ studentList.data.idno }} <br>
        </v-card-subtitle>
        </div>
      <div>
                 {{ studentList.data.grade }} {{ studentList.data.gclass }}  
                 <v-avatar class="ma-3" size="105" tile>
                  <v-img 
                    :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno='+studentList.data.studentid"
                    style="float-right;border-radius:50px;"
                    contain>
                   </v-img>
                 </v-avatar>                   
      </div>
     </div>
      <v-card-text><i>
        {{ studentList.data.note }}  </i>
       </v-card-text>
    </v-card>

  </v-container>   
</template>

<script>
export default {
    name:"StudentNameCard",
    props: ['studentList'],
    mounted: function() {
        console.log('SNC : Mounted')
        if (this.studentList) {   
           console.log('SNC : ', this.studentList.data.studentid)
        }
    }
}
</script>