<template>
  <v-container v-if="studentList">
   <v-row><v-col col="12">
    <v-card max-width="400" class="mx-auto">
       <v-container>
         <v-row dense>
           <v-col cols="12">
             <v-card color="purple" dark>
               <div class="d-flex flex-no-wrap justify-space-between">
                 <div>
                   <v-card-title class="headline" v-text="studentList.data.surname"></v-card-title>
                   <v-card-subtitle >
                       {{ studentList.data.firstname }} ( {{ studentList.data.studentid }} )
                   </v-card-subtitle>
                   .i.
                 </div>
                 <v-avatar class="ma-3" size="125" tile>
                   <!--v-img :src="item.src"></v-img -->
                   {{ studentList.data.grade }}{{ studentList.data.gclass }}
                 </v-avatar>
               </div>
               {{ studentList.data.note }}
             </v-card>
           </v-col>
         </v-row>
       </v-container>
    </v-card>
   </v-col></v-row>
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
        } else {
           console.log('SNC : NoName')
        }
    }
}
</script>