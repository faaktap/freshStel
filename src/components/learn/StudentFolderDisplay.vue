<template>
 <v-hover v-slot:default="{ hover }">
         <v-card  min-width="300" 
                  xmin-height="100"
                  :elevation="hover ? 12 : 2"
                  :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
                   @click=btnClick()
            dense
            class= "ma-2"
            color="deep-purple lighten-5">
     <v-card-title>   
        <v-icon> {{item.icon}} </v-icon>
        <div> 
           {{ item.name }}    
           <v-icon x-small :title="item.description">     {{ item.folder }} </v-icon> 
        </div>
         <!--/v-card-actions-->
     </v-card-title>
    </v-card>
 </v-hover>    
</template>

<script>
export default {
    name:"StudentFolderDisplay",
    props:['item'],
    data: () => ({
        bhover:null,
    }),
    filter: {
       icn : function (days) {
         //show color based on amount of days
         console.log('days = ' , days)
         if (days < 8)  return "red lighten-"+days
         return "green"
       },
    },
    methods: {
        btnClick() {
            this.$emit('btn-click',1)
        }
    }
}
</script>