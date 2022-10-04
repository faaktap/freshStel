<template>
<v-container fluid class="mb=2">
 <h2 v-if="getZml.login.studentid == studentid" class="heading-1 text-center">Your Merits</h2>
 <h2 v-if="getZml.login.type != 'student'" class="heading-1 text-center">Merits for student : {{ studentid }}</h2>

<v-back />
 <v-card class="ma-2" elevation="2">
        <v-card xs6 class="ma-2">
         <v-card-text>
           <v-card v-if="getZml.login.username=='WER'"> onlyWerner:{{ meritList }} </v-card>
           <v-data-table  v-if="meritList.length"
             :headers="headers"
             :items="meritList"
             mobile-breakpoint="0"
           >
            <template v-slot:[`footer.page-text`]>
             <td class="mx-2">Total Merits : </td>
             <td class="text-xs-right">{{ totals }}</td>
           </template>
           </v-data-table>
           <template v-else>
            <v-card  class="ma-2 pa-2">
            There are no data - press Add button below, to add your merits!
            </v-card>
           </template>

         </v-card-text>
        </v-card>

  </v-card>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { mer } from "@/components/merit/merit.js"
import VBack from '@/components/base/VBack.vue'
// import { infoSnackbar } from "@/api/GlobalActions"
export default {
    name: 'MeritList',
    props: ['meritid','studentid'],
    components:{
      VBack
    },
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
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
      headers() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return [{ text:"id", value: "meritstudentid", align: "left"},
                 { text:"meritdte", value: "meritdte", align: "center"},
                 { text:"confirm", value: "confirmdte", align: "center"},
                 { text:"point", value: "point", align: "center"}]
          case 'md':
          case 'lg':
          case 'xl':
            return [{ text:"id", value: "meritstudentid", align: "left"},
                 { text:"meritdte", value: "meritdte", align: "center"},
                 { text:"description", value: "description", align: "left"},
                 { text:"confirmed", value: "confirmdte", align: "center"},
                 { text:"teacher", value: "persmenemonic", align: "center"},
                 { text:"point", value: "point", align: "center"}]
        }
        return [{ text:"id", value: "meritstudentid", align: "left"}]
      }
    },
    methods:{
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
        if (this.meritid) {
           //We came in with a meritid
           //mer.check({meritid: this.meritid, desc: '', continue:this.initialize})
        }
        if (this.studentid) {
            //We came in with a studentid
        }
        if (this.getZml.login.studentid && this.getZml.login.type != 'student') {
            this.studentData = `${this.getZml.login.studentid}, ${this.getZml.login.firstname} ${this.getZml.login.surname} {${this.getZml.login.grade})`
            // retrieve the merit data
            mer.loadStudentMerits(this.studentid, this.initialize)
        } else {
            //retrieve the student data, and the merit data
            mer.loadStudentMerits(this.studentid, this.initialize)
        }



    },
    watch:{
        meritid(n,o) {
            this.$cs.l('meritid watch ', n, o)
        }
    }
}
</script>