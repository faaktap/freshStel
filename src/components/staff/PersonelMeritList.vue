<template>
<v-container fluid class="mb-2">
  <v-toolbar  row  wrap color="primary">
      Merits to Be Confirmed
      <v-spacer />
        <v-switch v-model="notconfirmed"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="notconfirmed ? 'Showing only not Confirmed' : 'Showing All Merits'"></v-switch>

        <v-switch v-model="onlyYou"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="onlyYou ? `Showing only for ${persMenemonic}` : 'Showing All Personel'"></v-switch>
        <v-switch v-model="allowDelete"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="allowDelete ? `Delete any Merit` : 'No delete'"></v-switch>
         <v-btn icon @click="printList"> <v-icon color="white" > mdi-printer </v-icon></v-btn>
         <v-back />
  </v-toolbar>
  <v-card  class="ma-2" elevation="2" v-if="getZml.login.type != 'student'">
    <!-- <v-card-title class="heading-2 text-center">
       Merits to Be Confirmed
    </v-card-title> -->
    <!-- <v-card class="col wrap text-center d-flex justify-space-between ml-0 mt-1 mb-2 pl-1 pr-1">
        <v-switch v-model="notconfirmed"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="notconfirmed ? 'Showing only not Confirmed' : 'Showing All Merits'"></v-switch>

        <v-switch v-model="onlyYou"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="onlyYou ? `Showing only for ${persMenemonic}` : 'Showing All Personel'"></v-switch>
        <v-switch v-model="allowDelete"
                  hide-details
                  class="mt-1 mr-2 mb-2 ml-2"
                  :label="allowDelete ? `Delete any Merit` : 'No delete'"></v-switch>

     </v-card> -->

        <v-card xs6 class="ma-2">
         <v-card-text>
           <v-data-table  v-if="meritList.length"
             :headers="headers"
             :items="meritListFilter"
             mobile-breakpoint="0"
             @dblclick:row="meritDblClick"
           >
           <template v-slot:[`item.actions`]="{ item }" >
             <v-icon v-if="!item.confirmdte" small class="mr-2"
                    @click="iconUpdate(item)"
                    title="Confirm Merit">mdi-lock</v-icon>
             <!-- <v-icon v-if="!item.confirmdte" small class="mr-2" @click="iconApprove(item)" color="green">mdi-check-decagram</v-icon> -->
             <v-icon v-if="allowDelete" small class="mr-2"
                    @click="iconDelete(item)" color="red"
                    title="Delete Merit">mdi-delete</v-icon>
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
        <v-card v-if="getZml.login.username=='WER'"> onlyWER:{{ meritList }} </v-card>

   <v-dialog v-model="showDialog" max-width="400" color="secondary" style="position: relative;">
   <v-card>
          <v-card-title>
            <span> {{ currentRec.studentname }} </span>
            <v-spacer></v-spacer>
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on"
                      @click="showDialog = !showDialog">
                      <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-menu>
          </v-card-title>
      <v-card-subtitle> {{ currentRec.description }}</v-card-subtitle>
      <v-card-text>

        {{ currentRec.meritid }},
        {{ currentRec.meritstudentid }},
        {{ currentRec.studentid }}<br>
        {{ currentRec.persmenemonic }}<br>
        {{ currentRec.confirmdte }}<br>

      </v-card-text>
      <v-card-actions>
          <v-btn small class="mr-2"
                 @click="iconUpdate(currentRec)"
                 title="Confirm Merit"><v-icon>mdi-lock</v-icon>Confirm</v-btn>
          <v-spacer/>
          <v-btn v-if="allowDelete" small class="mr-2"
                @click="iconDelete(currentRec)"
                title="Delete Merit"><v-icon color="red">mdi-delete</v-icon>Delete </v-btn>
      </v-card-actions>
    </v-card>
   </v-dialog>

  </v-card>
  <v-card v-else>
    You are logged on as {{ getZml.login.username }}
  </v-card>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { mer } from "@/components/merit/merit.js"
// import { infoSnackbar } from "@/api/GlobalActions"
import { printJSON } from "@/api/zmlPrint.js"
//import zmlCloseButton from '@/components/zmlCloseButton.vue'
export default {
    name: 'PersonelMeritList',
    props: [],
    components:{
    },
    data () {
      return {
        items:[{title:'11'},{title:'22'}],
        getZml: getters.getState({ object: "gZml" }),
        persMenemonic: '',
        notconfirmed: true,
        onlyYou: false,
        allowDelete: false,
        currentRec: 0,
        meritList:[],
        // headers: [{ text:"id", value: "meritstudentid", align: "left"},
        //          { text:"meritdte", value: "meritdte", align: "center"},
        //          { text:"description", value: "description", align: "left"},
        //          { text:"confirm", value: "confirmdte", align: "center"},
        //          { text:"teacher", value: "persmenemonic", align: "center"},
        //          { text:"point", value: "point", align: "center"}],
        showDialog: false

    }},
    computed:{
      totals() {
         return this.meritList.reduce( (accum,item) => accum + parseInt(item.point),0)
      },
      meritListFilter() {
        let result = []
        if (this.notconfirmed == true) {
           result = this.meritList.filter(e => !e.confirmdte) || []
        } else {
           result = this.meritList || []
        }
        if (this.onlyYou == true) {
           return result.filter(e => {
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
                 { text: "Actions", sortable: false, value: "actions" }]
          case 'md':
          case 'lg':
          case 'xl':
            return [
                 { text:"student", value: "studentname", align: "left"},
                 { text:"grade", value: "studentgrade", align: "left"},
                 { text:"meritdte", value: "meritdte", align: "center"},
                 { text:"description", value: "description", align: "left"},
                 { text:"confirmed", value: "confirmdte", align: "center"},
                 { text:"confirmer", value: "persmenemonic", align: "left"},
                 { text: "actions", sortable: false, value: "actions" }
                 ]
        }
        return [{ text:"id", value: "meritstudentid", align: "left"}]
      }
    },
    methods:{
      printList() {
        printJSON(this.meritListFilter, this.headers, 'Merit Confirm List')
      },
      meritDblClick(e1,e2) {
        this.currentRec = e2.item
        console.log('dblclick',e1,e2)
        this.showDialog = true
        console.log('dblclick item',e2.item)
        //alert('show v0dailog wih option to confirm a person')
      },
      iconUpdate(e) {
          let idx = this.meritList.indexOf(e)
          this.meritList[idx].confirmdte = Intl.DateTimeFormat('en-ZA').format(new Date())
          this.meritList[idx].persmenemonic = this.persMenemonic
          mer.confirm(this.meritList[idx])
          this.showDialog = false
      },
      iconApprove(e) {            console.log('app',e)        },
        iconDelete(e) {
            let idx = this.meritList.indexOf(e)
            if (idx > -1) {
                mer.delete(e)
                this.meritList.splice(idx,1)
            }
            this.showDialog = false
      },
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