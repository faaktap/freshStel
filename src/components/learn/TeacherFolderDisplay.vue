<template>
 <v-expansion-panels rounded 
                     class="ma-2 mt-0 pa-2 xxlong-line"
                     v-model="expandStatus"
                     >
    <v-expansion-panel>
     <v-expansion-panel-header disable-icon-rotate 
                               class="no-uppercase text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4"
                               color="deep-purple lighten-5" 
                               :title="item.days + ' day(s) ago'"
                               >
      <v-hover v-slot:default="{ hover }">            
       <v-card :elevation="hover ? 12 : 2"
             :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
             class="mx-1 px-1 text-lg-subtitle-2 text-sm-caption"
             color="deep-purple lighten-5" 
            @click.stop=btnClick()
       >
       <div class="ma-2 text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4">    
        <v-icon :title="item.description"> {{item.icon}} </v-icon>
            {{ item.name }} 
        </div>
       </v-card>
      </v-hover>           

        <template v-slot:actions>
           <v-btn :x-small="$vuetify.breakpoint.smAndDown == true"
                   title="Click here to edit the folder"
                   icon> 
             <v-icon :small="$vuetify.breakpoint.smAndDown == true" color="gray">
              mdi-folder-edit
             </v-icon>
           </v-btn> 
           <div class="text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4" 
                v-if="$vuetify.breakpoint.lgAndUp"> 
                Folder Properties 
           </div>
         </template>
     </v-expansion-panel-header>

    <v-expansion-panel-content>
        <teacher-folder-edit :item="item" />
    </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>

</template>

<script>
import TeacherFolderEdit from '@/components/learn/TeacherFolderEdit'
export default {
    name:"TeacherFolderDisplay",
    props:['item'],
    components:{ TeacherFolderEdit },
    data: () => ({
        bhover:null,
        expandStatus:null,   //to force close expand component, assign null to exandStatus
    }),
    filter: {
    },
    methods: {
        btnClick() {
            this.$emit('btn-click',1)
        }
    },
    watch: {
       expandStatus(newvalue) {
           console.log(this.$options.name, 'ExpandStatus newvalue=', newvalue,'this=', this.expandStatus)
       }
    }
}
</script>