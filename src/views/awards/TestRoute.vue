<template>
<div>
 <v-overlay
      :opacity=".5"
      :value="loading"> 
  <v-progress-circular indeterminate size="64">
     Loading...
  </v-progress-circular>
 </v-overlay> 

  <v-parallax src="/img/boSkool.jpg" height="1300px">
  <!-- src="/img/vlaghys6842.jpg" -->
  <v-container fluid>
   <v-layout row fill-height justify-center color="rgba(255, 0, 1, 0.5)"  style="height: 100vh" >
    <v-carousel v-model="panelIndex" 
                v-on:keyup.a="panelIndex++" 
                v-on:keyup.d="panelIndex--"
                interval="800000" 
                height="100%"
                hide-delimiters show-arrows-on-hover                
               :continuous="false"
               :cycle="cycle"
               :touch="{left: () => panelIndex--, right: () => panelIndex++}">
      <v-carousel-item v-for="page in awardList"
                      color="rgba(255, 1, 7, 0.2)" contain :key="page.storyid"
                      style="height: 100vh">   
        <InsideTestRoute :page="page">
        </InsideTestRoute>

     </v-carousel-item>
    </v-carousel>
   </v-layout>
  </v-container>
 </v-parallax>
</div>
</template>

<script>
import { zData } from "@/api/zGetBackgroundData.js"
import InsideTestRoute from './InsideTestRoute.vue'
import { awardStrFunc } from './awardStrFunc.js'
export default {
    name:"TestRoute",    
    components:{InsideTestRoute},
    props: {},
    prop: { 
      type: String,
      default: "no" 
    },
    data: () => ({
        zData:zData,
        loading:false,
        localStory:0,
        localChapter:0,
        localItem:0,
        panelIndex:0,
        cycle:true,
        awardList:[] ,
            // [
            // {storyid:100, type:1,  detail1:"page-text-left",  detail2:" detail 2.1", extraNote:"Main Title 1"},
            // {storyid:101, type:1,  detail1:"page-text-left",  detail2:" detail 2.1", extraNote:"Main Title 1"},
            // {storyid:102, type:4,  detail1:"page-right-text",  detail2:"<b><center>bold</center></b><hr>1234 5678 1234 1234 1234 1234 a234 b234 <br>this is a caption<br><br><br>whatever detail 2.2 <center>sdfsdfsdf</center>"},
            // {storyid:103, type:2,  detail1:"page-list-right"
            //  , detail2:[{awardid:1,dip:'BOOK PRIZE',sub:''}, {awardid:11,dip:'',sub:'ENGLISH HOMELANGUAGE'},
            //             {awardid:2,dip:'FULL COLORS',sub:''},
            //             {awardid:3,dip:'',sub:'Afrikaans, Engelse, Fisiese Wetenskappe, Mathematical Supplied Engineerin'},
            //             {awardid:4,dip:'',sub:'Afrikaans'}, {awardid:5,dip:'',sub:'Engels'},{awardid:6,dip:'',sub:'Fisiese Wetenskappe'}]
            //  , otherid: "otherid", studentid: "123", extraNote:"", winners: "winners 1"},
            // {storyid:104, type:4,  detail1:"detail 4 - marquee - type 4",  detail2:"' detail 2.4", otherid: "otherid", studentid: "123", extraNote:"extraNote 1", winners: "winners 1"},
            // {storyid:105, type:2,  detail1:"page-list-right (extra)"
            //  , detail2:[{awardid:2,dip:'FULL COLORS',sub:''},{awardid:4,dip:'',sub:'Afrikaans'},
            //             {awardid:5,dip:'',sub:'Engels'},{awardid:6,dip:'',sub:'Fisiese Wetenskappe'}]
            //  , otherid: "otherid", studentid: "123", extraNote:" -- TOP In The Class -- "},
            //  {storyid:106, type:4,  detail1:"page-text-marquee",  detail2:"detail,detail1,detail2, 2.4"},
            // ],
            sqlStatement:'SELECT * FROM dkhs_story WHERE chapterid = 25 order by orderid asc',
    }),
    methods:{
      assignData(response) {
        this.awardList = response
        this.awardList.forEach(e => {
          e.image = awardStrFunc.imageDisplay(e)
          if (e.type == 2) {
             //check if detail2 start with the word DIPLOMA: and of it does, build a list
             e.detail2 = awardStrFunc.convertTextToArray(e.detail2)
          }
        })
        this.loading =  false
      },
      next() {
           this.localItem = parseFloat(this.localItem) + 1
      },
      onComplete(p1){ console.log('complete:', p1)},
      onAbort(p1){ console.log('complete:', p1)},
    },
    mounted() {
        this.loading = true
        this.localStory = this.$route.params.storyid
        this.localChapter = this.$route.params.chapterid
        this.localItem = this.$route.params.orderid

        if (this.localStory && this.localChapter) {
        this.sqlStatement = 'SELECT * FROM dkhs_story '
                          + ' WHERE chapterid = ' + this.localChapter
                          + ' and orderid >= ' + this.localItem
                          + ' order by orderid asc'
        }

       zData.loadSql(this.loading, this.sqlStatement, this.assignData)
    }
}
</script>