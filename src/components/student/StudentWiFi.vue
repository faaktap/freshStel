<template>
<v-container>
 <v-card class="mx-auto"
         color="blue"
         dark
         elevation="2"
  >
   <v-card-title class="headline ma-1"> WiFi Details </v-card-title>
   <v-card-text v-if="wifiDetails">
     <v-row>
       <v-col cols=12>UserName : <strong>{{ username }}</strong></v-col>
       <v-col cols=12>Password : same as username, except if you've changed it</v-col>
     </v-row>
   </v-card-text>
   <v-card-text v-else>
      Oops - no wifi details found for your - ask at reception
   </v-card-text>
 </v-card>
 <v-card>
   <v-card-title class="headline ma-1"> WiFi Login Explanation </v-card-title>
   <v-card-text>
    <ul>
     <li color="red" >Some users(android) might need to enter username as <strong>WCGSCHOOLS/{{ username }}</strong>
       <br>BACKSLASH important
     </li>
     <li color="red" >Proxy can be entered as proxy.wcgschools.gov.za (carefull of spelling)
     <br>Carefull of proxy(dot)(space)wcg it must be proxy(dot)wcg ie: proxy.wcg</li>
     <li>If your phone force a certificate, it will not work - it MUST be "don't validate"</li>
     <li>If you get a message "validation failed" your username or password is wrong</li>
    </ul>
   <v-img elevation="6"
          class="ma-2 pa-2"
          src="https://kuiliesonline.co.za/virtual-school/img/wifilogindirections.png"
          contain />
   </v-card-text>
 </v-card>
</v-container>
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
export default {
    name:"StudentWifiDetails",
    props: ['studentid'],
    components: {},
    data: () => ({
      getZml : getters.getState({ object: "gZml" }),
      wifiDetails:false,
      username:''
    }),
    methods:{
      getUsername() {
        if (this.studentid) {
           let sl = { task: 'plainSql'
                    , sql:`SELECT w.*, s.grade, s.gclass, s.studentid\
                             FROM almalwcglogin w, dkhs_student s\
                            WHERE s.surname = w.surname \
                              AND SUBSTR(w.firstname,1,LENGTH(s.firstname)) = s.firstname\
                              AND s.studentid  = ${this.studentid}`

           }
           zmlFetch(sl, this.processAfterFetch);
        }
      },
      processAfterFetch(response) {
        console.log(response)
        if (!response.error) {
             this.wifiDetails = response[0]
             this.username = response[0].wcgschoolsid
        } else {
              this.wifiDetails = false
              this.username = ''
        }
      }

    },
    mounted() {
        console.log(this.$options.name,  this.studentid)
        if (this.studentid && this.getZml.login.isAuthenticated && (this.getZml.login.type=='teacher' || this.getZml.login.type=='admin'|| this.getZml.login.type=='werner')) {
           this.getUsername()
        } else if (this.studentid && this.getZml.login.username == this.studentid) {
          this.getUsername()
        }

    },
    watch: {
    }
}
</script>