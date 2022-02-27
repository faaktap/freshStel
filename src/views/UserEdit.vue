<template>
<base-title-expand :heading="u.user_fullname" color="blue">
 <v-card color="blue" v-if="u.userid">
    <v-card-title class="justify-center">
        {{ u.user_fullname }} - {{ u.userid }}
    </v-card-title>
    <v-card-text>
    <v-form-base v-if="doneLoading"
        autocomplete="off"
        id="deliveryForm"
        :model="myModel"
        :schema="mySchema"
        :col=12
        @click="clickOnRow"
        @blur="clickOnRow"
    >
    </v-form-base>
    </v-card-text>
    <v-card-actions>
    <v-btn @click="quickSave" class="ma-2" primary> Save </v-btn>
    <v-spacer />
    <v-btn @click="u.userid = 0" class="ma-2"> Close </v-btn>
    </v-card-actions>
 </v-card>
 <!-- <hr>{{ mySchema }} <hr>{{ myModel }}<hr> -->
</base-title-expand>
</template>

<script>
import VFormBase from "@/components/vfbase/VFormBase.vue"
import { infoSnackbar } from '@/api/GlobalActions';
import { zData } from "@/api/zGetBackgroundData.js"
import { userListModel } from "@/views/UserListModel.js"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue';
export default {
    name:'UserEdit',
    components:{VFormBase,BaseTitleExpand},
    props:['u'],
    data: () => ({
      myModel: {},
      mySchema:{},
      api:'https://kuiliesonline.co.za/api/dkhs/dkhs.php',
      loading:false,
      zData:zData,
      showResult:false,
      user:{},
      doneLoading:false
    }),
    methods:{
      quickSave() {
          //save cellphone, email, and fullname
        let u1,u2,u3 = ''
        if (userListModel.ulModel.user_cell) u1 = `user_cell =  '${userListModel.ulModel.user_cell}' `
        if (userListModel.ulModel.user_fullname) u2 = `user_fullname =  '${userListModel.ulModel.user_fullname}' `
        if (userListModel.ulModel.user_email) u3 = `user_email =  '${userListModel.ulModel.user_email}' `
        let updateString = [u1,u2,u3].filter(e => e.length).join(',');
        let sqlStatement = `update dkhs_learner set ${updateString} WHERE userid = ${this.u.userid}`
        zData.loadSql(this.loading, sqlStatement, this.doNothing)
      },
      doNothing() {
      },
      mailIt() {
          infoSnackbar('Starting your email program...')
      },
      clickOnRow(e1,e2) {
        console.log('clicked on row inside row', e1,e2)
      },
      loadLogLines() {
        let sqlStatement = `SELECT log_id, log_dte, ip, function, details FROM dkhs_log \
                        WHERE user like '%${this.u.user_name}%' \
                           OR function like '%${this.u.user_name}%' order by log_id desc`
        zData.loadSql(this.loading, sqlStatement, this.assignLogData)
      },
      async assignLogData(response) {
        console.log('after get : ' , response)
        userListModel.ulModel.logItems = []
        if (!('error' in response)) {
         response.forEach(e => {
           const obj = {logLine: e.log_dte +'\t '+ e.ip +'\t '+ e.function +'\t '+ e.details}
           userListModel.ulModel.logItems.push(obj)
         })
        }
        console.log('ALL Data loaded : ', this.myModel.logItems.length)
      },
      async loadNewOne() {
        if (!this.u) return;

        this.doneLoading = false
        this.user = this.u
        userListModel.ulModel = this.user
        await this.loadLogLines()
        console.log('----------->',userListModel.ulModel , this.user, this.u)
        this.mySchema = userListModel.ulSchema
        this.myModel = userListModel.ulModel
        this.doneLoading = true
      }

    },
    mounted() {
        console.log('start : ', this.$options.name)
        this.loadNewOne()
    },
    watch: {
        u() {
            this.loadNewOne()
        }
    }
}
</script>