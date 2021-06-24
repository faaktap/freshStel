<template>
      <v-card  min-height="100"
              :elevation="12"
         dense
         class= "ma-2 ma-sm-1 pr-sm-2"
         color="blue lighten-3"
      >
      <v-card-text class="text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4"> 
       <strong>Properties & Actions</strong>
       <v-row>
         <v-col cols="12" class="d-flex flex-wrap">
           <v-btn-toggle  tile
                          color="deep-purple accent-3"
                          group 
                          v-model="editing" v-for="eo in editoptions" :key="eo.name" 
                          row
                          class="ma-0 pa-0 text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4">
               <v-btn class="ma-0" 
                        :label="eo.name" 
                        :value="eo.name"
                        :title="eo.help"
               >
            {{eo.name}}
               </v-btn>
           </v-btn-toggle>    
       </v-col>
       </v-row>
       <v-row>
       <v-col cols="12" xmd="8" lxg="8" xxl="8">
       <v-card color="blue" class="pa-1 ma-2 text-caption text-sm-body-2 text-md-body-1">
        <template v-if="['properties'].includes(editing)">           
           <sml class="mx-2 my-1" head="Type" :val="item.type" />
           <sml class="mx-2 my-1 text-caption text-sm-body-2 text-md-body-1" 
                head="Owner" 
               :val="look.persMenemonic(item.persid)" />           
           <sml class="mx-2 my-1" head="Access" :val="item.accesstype" />
           <sml class="mx-2 my-1 text-caption text-sm-body-2 text-md-body-1" head="Name" :val="item.name" />
           <sml class="mx-2 my-1 text-caption text-sm-body-2 text-md-body-1" head="Age" :val="item.days + ' days'" />
           <sml class="mx-2 my-1" head="Updated" :val="item.update_timestamp" />
           <sml class="mx-2 my-1" head="Created" :val="item.create_timestamp" />           
           <sml class="mx-2 my-1" head="Item No" :val="item.contentid" />  
        </template>
        <template v-if="['delete'].includes(editing)">
           <v-card-text> 
               DELETE
               <br>{{ item }}><br>
           </v-card-text>
           <v-card-actions> 
               <v-btn x-small> sdf </v-btn> 
               <v-btn x-small> sdf </v-btn> 
           </v-card-actions>
        </template>
        <template v-if="['move'].includes(editing)">
           MOVE
           <br><br><br><br><br><br>..
        </template>
        <template v-if="['upload'].includes(editing)">
           <upload-machine  v-if="uploadPath"
                :uploadPath="uploadPath" 
                @fileUploaded="fileUploaded"
                 />
        </template>
        <template v-if="['name'].includes(editing)">
           <v-text-field color="light-blue" solo v-model="item.name" label="Item Name" />
           <br><br><br>cc
           <v-btn x-small>save</v-btn> <v-btn x-small>reset</v-btn>
        </template>
       </v-card>
       </v-col>
       </v-row>
<!--
            <br />  Last Edit : {{ item.days }}  days(s) ago
            <br />  Name : {{ item.name }}
            <br />  Description : {{ item.description }}
            <br />  Img : {{ item.img }}
            <br />  Created : {{ item.create_timestamp.substr(0,10) }}
            <br />  icon : {{ item.img | icon }}
            <br />  filetype : {{ item.img | fileType }}
            {{ item }}
-->
      </v-card-text>
     </v-card>
</template>

<script>
import sml from '@/components/base/BaseSmall'
import UploadMachine from '@/test/TestUpload'
import { look } from "@/api/Lookups.js"
export default {
    name:"TeacherFolderEdit",
    props:['item'],
    components:{ sml, UploadMachine },
    data: () => ({
        bhover:null,
        look:look,
        editing:"properties",
        editoptions:[{name:"properties",help:"View properties"}
                    ,{name:"name",help:"Change Display Name"}
                    ,{name:"move",help:"Move to another folder"}
                    ,{name:"delete",help:"Delete the file or folder"}
                    ,{name:"upload",help:"Upload files to current folder"}],
        uploadPath:'',
    }),
    filter: {
    },
    methods: {
        fileUploaded(p1) {
            console.log('received this file P1', p1)
            //alert('do something with it' + p1.filePath + ' '+  p1.filename + ' '  + p1.fileName)
            /*
            (We will receive below stuff in response, p1..)
              fileName:"/Test/WSmit/range.png"
              filePath:"/home/kuilieso/public_html/Test/WSmit/range.png"
              filename:"range.png"
            */
        },
        calculateUploadPath() {
            if (! (this.item.grade && this.item.subjectid) ) {
                 return
            }
            let GR = this.item.grade.toString()
            GR = 'GR' + GR.padStart(2, '0')
            const idx = look.getZml.subjects.findIndex(ele => ele.subjectid == this.item.subjectid)
            const subjectpath = look.getZml.subjects[idx].path
            this.uploadPath = "/Subjects/" + GR + "/" + subjectpath + "/" + this.item.folder        
        }
    },
    mounted() {
        this.calculateUploadPath()
    },
    watch: {
        item: {
          deep:true,
          handler() {
              console.log(this.$options.name, 'watch item')
             if (this.item.folder) {
              this.editoptions[2].help = 'Move to another folder from' + this.item.folder
             } else {
              this.editoptions[2].help = 'Move to another folder from root'
             }
          }
        }
    }
}
</script>