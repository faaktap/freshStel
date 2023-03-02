<template>
<v-parallax background height="1000px" src="img/school.jpg" class="filter-img" >
<v-container justify="center" align="center"  xclass="filter-div mt-5 pa-5" >
 <v-layout wrap class="ma-1" justify-space-around>
   <v-card class="ma-1 pa-1" color="rgba(106, 196, 226, 0.4)">
     <v-card-title  class="blue--text">
      <dkhs-logo   class="ma-0 pa-1" :width="range[1]" :height="range[0]"  />
      <dkhs-r-logo v-show="!$vuetify.breakpoint.mobile" class="ma-0 pa-1" :width="range[1]" :height="range[0]" />
      <dkhs-i-logo v-show="!$vuetify.breakpoint.mobile" class="ma-0 pa-1" :width="range[1]" :height="range[0]" />
      <v-card color="light-blue lighten-4 blue--text"
             :class="{'text-caption': $vuetify.breakpoint.smAndDown, 'text-h4': $vuetify.breakpoint.lgAndUp, 'text-h5': $vuetify.breakpoint.md}"
             class="pa-2"
             >
          KUILIES VIRTUAL SCHOOL
      </v-card>
     </v-card-title>
     <v-card-text>
        <v-row>
        <v-col cols="12" md="6">
          <v-card class="ma-0 pa-1">
          <p><ul><strong>Mission</strong>
             <li>Allow students to <v-btn x-small text to="folder">access</v-btn> class material after hours.</li>
             <li>Allow teachers to <v-btn x-small text to="folder">supply</v-btn> class material.</li>
             <li>Allow admin and teacher to lookup <v-btn x-small text to="student">student</v-btn> information.</li>
             <li>Allow admin and teacher to <v-btn x-small text to="attload">create</v-btn> Attendance Records.</li>
             <li>Allow parents to register and check <v-btn x-small text to="newsletters/d"> emails </v-btn>.</li>
             </ul>
          </p>
          </v-card>
          <blockquote class="blockquote darken-3 purple--text ma-2 pa-2"
                      @mouseover="hover = true"
                      @mouseleave="hover = false"
                     :class="{ active: hover }"
                      cite="Shakespeare">
            {{ q.quote }}
           <span v-if="q.author">– {{ q.author }}</span>
          </blockquote>

          </v-col>
          <v-col cols="12" md="6">
            <v-card class="ma-2 pa-2">
          <p>
            For more information contact Werner at 082 563 9790
          </p>
          <p>
            If you have questions, or information to share please email <a href="mailto:werner@zmlrekenaars.co.za">
              Werner
            </a>.
          </p>
          <p>
            Find a bug? Report it to  <a
              href="mailto:werner@zmlrekenaars.co.za"
              target="_blank"
              title="contribute"
            >
              Werner
            </a>.
          </p>
          </v-card>
          </v-col>
          </v-row>
      </v-card-text>
      <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            to="/home"
          >
            Continue
          </v-btn>
      </v-card-actions>
   </v-card>
</v-layout>
<base-title-expand class="ma-0 pt-1 px-0" heading="More"  color="rgba(106, 196, 226, 0.4)">
 <v-btn class="ma-2" color="primary" to="/newsletters/202"> Newsletters </v-btn>

 <v-btn class="ma-2" color="primary" to="/personel"> Teachers & Supporting Staff </v-btn>

 <!-- <v-btn class="ma-2" color="primary" to="/virtualawards"> Awards </v-btn> -->

 <v-btn class="ma-2" color="primary" to="/latest/100"> Latest Uploads </v-btn>

 <v-btn class="ma-2" color="primary" to="/attload"> Attendance </v-btn>

 <v-btn class="ma-2" color="primary" to="/attendance"> Old Attendance View </v-btn>

</base-title-expand>
</v-container>
</v-parallax>
      <!-- <v-overlay value="true" absolute>
          overlay text over parallax csdtfsersere
      </v-overlay> -->

</template>

<script>
import DkhsILogo from "@/components/image/DkhsILogo"
import DkhsRLogo from "@/components/image/DkhsRLogo"
import DkhsLogo from "@/components/image/DkhsLogo"
import BaseTitleExpand from "@/components/base/BaseTitleExpand"
import { zmlConfig } from '@/api/constants';
import { zmlLog } from '@/api/zmlLog.js';

export default {
  name: "HomeStart",
//layout: 'default',
  layout(context) {
    console.log('context in layout..',context)
    return 'default'
  },
  components: {BaseTitleExpand,DkhsILogo, DkhsRLogo, DkhsLogo},
  data: () => ({
     range:[130,150],
     q :{quote:'And this our life, exempt from public haunt, finds tongues in trees, books in running brooks, sermons in stones, and good in everything.'
        ,author:'Shakespeare'},
     hover:false
  }),
  computed: {
      ran() {
        return Math.floor(Math.random() * 4)
      }
  },
  activated() {     console.log(this.$options.name,' - activated')  },
  deactivated() {     console.log(this.$options.name,' - deactivated')  },
  methods:{
    getQuote() {
      let token = {headers: {'Authorization': 'Token 4f9248d8208d5554e8f508d126eaada5ad4b9ca6'}}
      let apiUrl = 'https://api.paperquotes.com/apiv1/quotes/?qod'
      let requestFetch = function() { return fetch.apply(this, arguments);}
      requestFetch(apiUrl, token)
      .then((response) => {return response.json();})
      .then((data) => {
        //console.log(data);
        //console.log(data.results.length);
        let r = Math.floor(Math.random() * 5)
        this.q.quote = data.results[r].quote
        this.q.author = data.results[r].author
        localStorage.setItem('quote', JSON.stringify(this.q))
      })
    },
  },
  created() {
    this.getQuote()
  },
  mounted() {
   //require('dotenv').config()
   // zData.l('starting', this.$options.name,zData.someGlobals, 'Calling zData as a test.')
   this.$cs.l('M',this.$options.name)
   console.log('Process=',process)
   //var env = process.env.NODE_ENV || 'development';
   zmlLog(null, 'HomeStart',{version: zmlConfig.projectID} )
  },
  watch:{
  }
 }

</script>

<style scss scoped>
  .filter-div {
      background: #fff;
      &:hover {
          background: #5d7aae;
        }
    }
    .filter-img {
      &:hover {
         filter: brightness(70);
      }
    }



  .flip-enter-active {
    transition: all 1.5s ease;
  }

  .flip-leave-active {
    display: none;
  }

  .flip-enter, .flip-leave {
    transform: rotateY(180);
    opacity: 0;

  }
  .active {
  background: white;
 }

</style>