<template>
<v-container fluid>
<h1>TEST</h1>
<v-container fluid>
 <v-layout wrap class="ma-1" justify-space-around>
   <v-card class="ma-1 pa-1" >
     <v-card-title  class="blue--text">
      <stel-logo   class="ma-2 pa-2" :width="range[1]" :height="range[0]"  />
      <v-card color="white blue--text"
             :class="{'text-caption': $vuetify.breakpoint.smAndDown, 'text-h4': $vuetify.breakpoint.lgAndUp, 'text-h5': $vuetify.breakpoint.md}"
             class="pa-2"
             >
          Stellenberg Practise Platform
      </v-card>
     </v-card-title>
     <v-card-text>
        <v-row>
        <v-col cols="12" md="6">
          <v-card class="ma-0 pa-1">
          <p><ul><strong>Mission</strong>
             <li>Get venue booking system out</li>
             </ul>
          </p>
          </v-card>
          <blockquote class="blockquote darken-3 purple--text ma-1" cite="Shakespeare">
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
            to="/venue/4"
          >
            Continue
          </v-btn>
          <v-btn
            color="primary"
            to="/calendar"
          >
            Calendar
          </v-btn>
      </v-card-actions>
   </v-card>
  </v-layout>
  <base-title-expand class="ma-0 pt-1 px-0" heading="More">
   <v-btn class="ma-2" color="primary" to="/test"> Test </v-btn>
   <v-btn class="ma-2" color="primary" to="/streamline"> Streamline Table Code </v-btn>
   <v-btn class="ma-2" color="primary" to="/venue/4"> Venue </v-btn>
   <v-btn class="ma-2" color="primary" to="/survey"> Survey </v-btn>
   <v-btn class="ma-2" color="primary" to="/single"> Single </v-btn>
   <v-btn class="ma-2" color="primary" to="/vfbasetest"> vfbasetest </v-btn>
   <v-btn class="ma-2" color="primary" to="/avatartest"> avatartest </v-btn>
   <v-btn class="ma-2" color="primary" to="/cameratest"> cameratest </v-btn>
   <v-btn class="ma-2" color="primary" to="/enroll"> enroll </v-btn>
   <!-- <v-btn class="ma-2" color="primary" to="/register/3"> Register </v-btn> -->
   <v-btn class="ma-2" color="primary" href="https://www.actlocal.co.za/bates/"> bates </v-btn>
  </base-title-expand>
  </v-container>
</v-container>
 </template>

<script>
import StelLogo from "@/stel/StelLogo"
import BaseTitleExpand from "@/components/base/BaseTitleExpand"
import { zmlConfig } from '@/stel/constants';
import { zmlLog } from '@/stel/zmlLog.js';

export default {
  name: "PagesIndex",
  layout(context) {
    console.log('context in layout..',context)
    return 'default'
  },
  components: {BaseTitleExpand,StelLogo},
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