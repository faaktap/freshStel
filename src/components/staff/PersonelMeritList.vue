<template>
<v-container fluid class="mb-2" v-if="getZml.login.type != 'student'">

{{ getZml.login.username }}
 <v-card class="ma-2" elevation="2">
    <v-card-title class="heading-2 text-center">
       Merits to Be Confirmed
    </v-card-title>
    <v-card class="col wrap text-center d-flex justify-space-between ml-0 mt-1 mb-2 pl-1 pr-1">
        <v-switch v-model="notconfirmed"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="notconfirmed ? 'Showing only not Confirmed' : 'Showing All'"></v-switch>

        <v-switch v-model="onlyYou"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="onlyYou ? `Showing only for ${persMenemonic}` : 'Showing All'"></v-switch>
        <v-switch v-model="allowDelete"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="allowDelete ? `Delete any Merit` : 'No delete'"></v-switch>

        <!-- <v-switch v-model="onlyYou" hide-details class="mt-1 mr-2 mb-2 ml-2" label="onlyYou"></v-switch> -->
     </v-card>

        <v-card xs6 class="ma-2">
         <v-card-text>
           <v-data-table  v-if="meritList.length"
             :headers="headers"
             :items="meritListFilter"
             mobile-breakpoint="0"
           >
           <template v-slot:[`item.action`]="{ item }" >
             <v-icon v-if="!item.confirmdte" small class="mr-2" @click="iconUpdate(item)">mdi-lock</v-icon>
             <!-- <v-icon v-if="!item.confirmdte" small class="mr-2" @click="iconApprove(item)" color="green">mdi-check-decagram</v-icon> -->
             <v-icon v-if="allowDelete" small class="mr-2" @click="iconDelete(item)" color="red">mdi-delete</v-icon>
           </template>

            <template v-slot:[`footer.page-text`]>
             <td class="mx-2">Total Merits : </td>
             <td class="text-xs-right">{{ totals }}</td>
           </template>
           </v-data-table>
           <template v-else>
            <v-card  class="ma-2 pa-2">
            There are no data for this selection
            </v-card>
           </template>

         </v-card-text>
        </v-card>
        <v-card v-if="getZml.login.username=='WER'"> onlyWerner:{{ meritList }} </v-card>
  </v-card>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { mer } from "@/components/merit/merit.js"
// import { infoSnackbar } from "@/api/GlobalActions"
export default {
    name: 'PersonelMeritList',
    props: [],
    components:{
    },
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
        persMenemonic: '',
        notconfirmed: true,
        onlyYou: false,
        allowDelete: false,
        studentData: 0,
        meritList:[],
        // headers: [{ text:"id", value: "meritstudentid", align: "left"},
        //          { text:"meritdte", value: "meritdte", align: "center"},
        //          { text:"description", value: "description", align: "left"},
        //          { text:"confirm", value: "confirmdte", align: "center"},
        //          { text:"teacher", value: "persmenemonic", align: "center"},
        //          { text:"point", value: "point", align: "center"}],

    }},
    computed:{
      totals() {

         //return this.meritList.reduce((a, b) => ({e: total * e.point})
         return this.meritList.reduce( (accum,item) => accum + parseInt(item.point),0)
      },
      meritListFilter() {
        //return this.meritList || []
        //console.log('filter = ', this.notconfirmed, this.onlyYou)
        let result = []
        if (this.notconfirmed == true) {
           result = this.meritList.filter(e => !e.confirmdte) || []
        } else {
           result = this.meritList || []
        }
        //console.log('filter = ', this.notconfirmed, this.onlyYou, result.length)
        if (this.onlyYou == true) {
           return result.filter(e => {
            //console.log(e.persmenemonic ,this.persMenemonic)
            return e.persmenemonic == this.persMenemonic
            } )
        }
        return result

      },
      headers() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return [{ text:"student", value: "studentname", align: "center"},
                 { text:"description", value: "description", align: "left"},
                 { text:"confirm", value: "confirmdte", align: "center"},
                 { text: "Actions", sortable: false, value: "action" }]
          case 'md':
          case 'lg':
          case 'xl':
            return [
                 { text:"student", value: "studentname", align: "center"},
                 { text:"grade", value: "studentgrade", align: "center"},
                 { text:"meritdte", value: "meritdte", align: "center"},
                 { text:"description", value: "description", align: "left"},
                 { text:"confirmed", value: "confirmdte", align: "center"},
                 { text:"confirmer", value: "persmenemonic", align: "center"},
                 { text: "Actions", sortable: false, value: "action" }
                 ]
        }
        return [{ text:"id", value: "meritstudentid", align: "left"}]
      }
    },
    methods:{
        iconUpdate(e) {
          console.log('upd',e)
          let idx = this.meritList.indexOf(e)
          console.log('f = ' , this.meritList[idx])
          this.meritList[idx].confirmdte = Intl.DateTimeFormat('en-ZA').format(new Date())
        },
        iconApprove(e) {            console.log('app',e)        },
        iconDelete(e) {            console.log('del',e)        },
        initialize(response) {
            this.$cs.l('initialize  ', response)
            this.meritList = response;
            //alert('now we get studentid and staff and date')
        },
        goBack() {
            this.$router.back()
        },

    },
    mounted() {
        this.$cs.l('Mounted', this.$options.name, this.studentid, this.meritid)
        this.persMenemonic = this.getZml.login.username
        //if (this.persMenemonic) {
           //We came in as personel - always on this vue object
           //mer.check({meritid: this.meritid, desc: '', continue:this.initialize})
           mer.loadAllMerits(this.persMenemonic, this.initialize)
        //}

    },
    watch:{
        meritid(n,o) {
            this.$cs.l('meritid watch ', n, o)
        }
    }
}
</script>