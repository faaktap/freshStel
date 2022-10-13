<template>
<v-parallax background height="1000px" src="img/school.jpg" xclass="filter-img" >
<v-container fluid justify="center" align="center" class="xfilter-div mt-5 pa-5" >
 <v-layout wrap> <!-- class="filter-div" color="rgba(255, 0, 1, 0.5)" > -->
  <v-row>
    <v-col cols="12">
     <v-card class="justify-center" color="rgba(106, 196, 226, 0.7)">
     <v-card-title  class="blue--text">
      <dkhs-logo   class="ma-2 pa-1" :width="range[1]" :height="range[0]"  />
      <dkhs-r-logo v-show="!$vuetify.breakpoint.mobile" class="ma-2 pa-1" :width="range[1]" :height="range[0]" />
      <dkhs-i-logo v-show="!$vuetify.breakpoint.mobile" class="ma-2 pa-1" :width="range[1]" :height="range[0]" />
      <v-card color="light-blue lighten-4 green--text"
             :class="{'text-caption': $vuetify.breakpoint.smAndDown, 'text-h2': $vuetify.breakpoint.lgAndUp, 'text-h4': $vuetify.breakpoint.md}"
             class="pa-2"
             >
          KUILIES VIRTUAL SCHOOL
      </v-card>
     </v-card-title>
     <v-card-text>
        <v-row>
        <v-col cols="12" md="6">
          <v-card class="ma-2 pa-2">
          <p><ul>Mission
             <li>Allow students to access class material after hours.</li>
             <li>Allow teachers to supply class material.</li>
             <li>Allow admin and teacher to lookup student information.</li>
             <li>Allow admin and teacher to create Attendance Records.</li>
             <li>Allow parents to register and check emails.</li>
             </ul>
          </p>
          </v-card>
          <blockquote class="blockquote darken-3 purple--text ma-3" cite="Shakespeare">
            {{ q.quote }}
           – {{ q.author }}
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

  </v-col>
 </v-row>
</v-layout>
<base-title-expand class="ma-0 pt-1 px-0" heading="More">
 <v-btn class="ma-2" color="primary" to="/newsletters/2022"> Newsletters </v-btn>

 <v-btn class="ma-2" color="primary" to="/personel"> Teachers & Supporting Staff </v-btn>

 <v-btn class="ma-2" color="primary" to="/virtualawards"> Awards </v-btn>

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
  name: "PagesIndex",
//layout: 'default',
  layout(context) {
    console.log('context in layout..',context)
    return 'default'
  },
  components: {BaseTitleExpand,DkhsILogo, DkhsRLogo, DkhsLogo},
  data: () => ({
     range:[130,150],
     q :{quote:'And this our life, exempt from public haunt, finds tongues in trees, books in running brooks, sermons in stones, and good in everything.'
        ,author:'Shakespeare'}
  }),
  computed: {
      ran() {
        return Math.floor(Math.random() * 4)
      }
  },
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

.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url( 'https://cdn.pixabay.com/photo/2016/03/26/13/09/organic-1280537_1280.jpg') no-repeat center center;
    background-size: cover;
    background-color: red;
    transform: scale(1.1);
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

</style>