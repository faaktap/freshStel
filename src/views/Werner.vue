<template>
<v-container fluid>
<h1> -----------WERNER.VUE-------------- </h1>
<hr>
<v-row>
  <v-col cols="12">

<v-card>
  <v-card-title>{{ content }} {{ emojiPanel}}
  <v-btn small @click="emojiPanel = !emojiPanel"> <v-icon> mdi-emoji</v-icon>dd </v-btn></v-card-title>
  <emoji-picker :show="emojiPanel" @close="emojiPanel = false" @click="addEmojiToMessage" />
  <v-textarea v-model="content" />
</v-card>
<chat />
  </v-col>
  <v-col cols="2" class="ma-0 pa-0">
  <zmlVList v-model="zmlVListObj" />
  {{ zmlVListObj }}
  <zmlVList v-model="zmlVListObj" />
  <hr>
 <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          someitem
        </v-list-item-content>

        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-group
        :value="true"
        prepend-icon="mdi-account-circle"
      >
        <template v-slot:activator>
          <v-list-item-title>Users</v-list-item-title>
        </template>

        <v-list-group
          :value="true"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Admin</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, icon], i) in admins"
            :key="i"
            link
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon>mdi-kettle</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Actions</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, icon], i) in cruds"
            :key="i"
            link
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>





    <v-data-table
     :headers="headers"
    :items="menus"
    item-key="name"
    sort-by="name"
    group-by="category"
    class="elevation-1"
    show-group-by
    >
    </v-data-table>
  </v-col>
  <v-col>
<v-card>     <v-card-title> visibilit example </v-card-title>
  <!-- Button size based on screen size -->
  <v-btn outlined :small="$vuetify.breakpoint.smAndDown">
    <v-icon :small="$vuetify.breakpoint.smAndDown">mdi-chevron-left</v-icon>
    some button text
  </v-btn>

<p class="text-center">

  <!-- Fontsize based on screen size -->
  {{  $vuetify.breakpoint.smAndDown ? 'text-caption' : ''  }} {{$vuetify.breakpoint.mdAndUp ? 'text-md-body-1' : '' }}
  <span :class="{'text-caption': $vuetify.breakpoint.smAndDown, 'text-md-body-1': $vuetify.breakpoint.mdAndUp}">
  some data in span ---  SOME DATA IN  SPAN
  </span>
<br>

<!-- <span class="text-h1">text-h1</span><br> -->
<span class="text-h2">text-h2</span>,
<span class="text-h3">text-h3</span><br>
<span class="text-h4">text-h4</span>,
<span class="text-h5">text-h5</span>,
<span class="text-h6">text-h6</span><br>
<span class="text-overline">text-overline</span><br>
<span class="text-button"> text-button </span><br>
  <span class="text-body-1"> text-body-1 </span><br>
  <span class="text-subtitle-1">text-subtitle-1</span><br>
  <span class="text-body-2"> text-body-2 </span><br>
  <span class="text-subtitle-2">text-subtitle-2</span><br>
  <span class="text-caption"> text-caption</span><br>

</p>
<v-card class="text-center">
   <p class="font-weight-black">      Black text.    </p>
    <p class="font-weight-bold">      Bold text.    </p>
    <span class="font-weight-medium">      Medium weight text.    </span>
    <p class="font-weight-regular">      Normal weight text.    </p>
    <p class="font-weight-light">      Light weight text.    </p>
    <p class="font-weight-thin">      Thin weight text.    </p>
    <span class="font-italic">      Italic text.    </span>
    <div class="col-3 text-truncate">
        Hierdie text behoort dotjies .... te he as daar te min plek is... of so hoop ons of so hoop ons of so hoop ons
    </div>
</v-card>


  grid will change based on screen size
  <v-col cols="12" class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 " style="background-color: rgb(182, 164, 201)">

  Margin will change based on screen size
  <v-flex :class="{'ma-0': $vuetify.breakpoint.smAndDown, 'ma-5': $vuetify.breakpoint.mdAndUp}" style="background-color: azure" >
    <v-card class="ma-0 ma-md-5"> card.title </v-card>
     visibility based on screen size (make window smaller and bigger)
    <v-row class="hidden-xs-only hidden-sm-and-down">
      <v-col>
        This is hidden-xs-only and hidden-sm-and-down
      </v-col>
      </v-row>
      <v-row>
      <v-col cols="6">
        <div class="text-no-wrap secondary col-3">
          Hierdie text behoort te overflow as daar te min plek is...
        </div>
      </v-col>
      <v-col cols="6">
        <div class="col-6 text-truncate">
        Hierdie text behoort dotjies .... te he as daar te min plek is... of so hoop ons of so hoop ons of so hoop ons
      </div>
      </v-col>
      </v-row>
  </v-flex>
  </v-col>
</v-card>
  </v-col>
</v-row>




icons:
<v-btn><p-icon />click</v-btn>
<v-btn><p-icon small />small clicl </v-btn>
<v-btn> <p-icon name="mdi-ambulance" large /> larger click </v-btn>
<v-btn small> <p-icon name="XXX" large color="secondary" /> wrong name </v-btn> and  <p-icon width="25" color="green" />
<v-card class="ma-2 pa-2">
  <p-icon name="all" />
</v-card>

{{ wdebug }} {{ typeof(wdebug) }}
<v-card elevation="-4"><v-card-title> v-multi-items component - single value from list</v-card-title>
<v-card-text><v-radio-group v-model="wdebug"><v-radio :value="true" label="ON"/><v-radio :value="false" label="OFF"/></v-radio-group>
 <v-multi-play :items="items"
              v-model="vmpT"
              label="alabel"
              color="red"
              nodata="oeps"
              :entryType="{type:'text', label:'werner'}"
              outlined="true"
              :debug="wdebug"
 />
</v-card-text>
</v-card>



<!-- <quick-calendar-display class="ma-2 pa-2" v-if="attEvt && attEvt.length"
  :passedEvents="attEvt" /> -->
<br>

<!-- <base-title-expand  heading="Call Component from list" color="blue">
<TimeLineComponentPlay />
</base-title-expand> -->

<base-title-expand  heading="Select a subject" color="blue">
possible : {{ getZml.subjects && getZml.subjects.length }}
<auto-sel-subjects v-if="getZml.subjects && getZml.subjects.length"
              asLabel="Subjects"
              v-model="p.subjectID"
              :initialValue="101"
              :itemObj="getZml.subjects"
              @input="change"
              @objInput="p.subjectObj = $event; change($event)"
/>
</base-title-expand>
<v-btn v-for="but in buttons" :key="but.to"
       small :to="but.to"
       class="ma-2 pa-2"
> {{ but.name || but.to  }}
 </v-btn>
<v-btn small @click="afterQuick"> Load Initial Data </v-btn>

<base-title-expand  heading="Show Vars" color="blue">
<v-card class="caption-text">LOGIN"
  {{ getZml.login }}
</v-card>

<v-card class="caption-text">PLACE:
  {{ getZml.place }}
</v-card>
<v-card class="caption-text">
  {{ getZml.persMenemonic }}
</v-card>
<v-card class="caption-text">
  {{ getZml.classList }}
</v-card>
</base-title-expand>

<!-- :initialPlaceID="testroomstart" -->
<v-card>
  <v-card-title> Choose some auto fields </v-card-title>
  <v-card-text>
   <sel-general-list-items @input="change" />
 </v-card-text>
  <v-card-actions>
    <!-- {{ p.persMen }}{{p.roomName }}{{ p.day }}{{ p.period }}{{ p.classListID }}{{ p.questionID }} -->
    <v-btn @click="activate" > Start </v-btn>
     <div class="text-caption mx-2"> ({{ p.persMen}},{{ p.roomName }},{{ p.day }},{{ p.period }},{{ p.classListID }}, {{p.questionID}} )</div>
    </v-card-actions>
    roomObj: {{ p.roomObj }}<br>
    persObj: {{ p.persObj }}<br>
    classListObj:{{ p.classListObj }}<br>
    questionObj: {{ p.questionObj }}<br>
</v-card>
</v-container>
</template>


<script>
import { zData } from "@/api/zGetBackgroundData.js"
import { getters } from "@/api/store";
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import VMultiPlay from '@/components/base/VMultiPlay.vue'
import SelGeneralListItems from '@/components/fields/SelGeneralListItems.vue'
import AutoSelSubjects from '@/components/fields/AutoSelSubjects.vue'
// import TimeLineComponentPlay from '@/test/TimeLineComponentPlay.vue'
// import QuickCalendarDisplay from '@/components/QuickCalendarDisplay.vue'
import PIcon from '@/components/base/PIcon.vue'
import zmlVList from '@/test/zmlVList.vue'
import EmojiPicker from '@/test/EmojiPicker.vue'
import Chat from '@/test/Chat.vue'
export default {
    name:"Werner",
    components: {
                 SelGeneralListItems
               , AutoSelSubjects
               , BaseTitleExpand
               , VMultiPlay
               , PIcon
               , zmlVList
               , EmojiPicker
               , Chat
               //, TimeLineComponentPlay
               //, QuickCalendarDisplay
               },
    data: () => ({
       zmlVListObj:{},
       emojiPanel: true,
       content:'',
       admins: [
        ['Management', 'mdi-account-multiple-outline'],
        ['Settings', 'mdi-cog-outline'],
      ],
      cruds: [
        ['Create', 'mdi-plus-outline'],
        ['Read', 'mdi-file-outline'],
        ['Update', 'mdi-update'],
        ['Delete', 'mdi-delete'],
      ],
         headers:[{text: 'cateG',    align: 'start',  value: 'category' },
                  {text: 'NaMe',     value: 'name' },
                  {text: 'DESC',     value: 'description' },
         ],
         menus: [{category: 'one', name:'item1', description: 'Some longer tip or whatever'}
                ,{category: 'one', name:'item2', description: 'Some 2 longer tip or whatever'}
                ,{category: 'two', name:'itemA2-1', description: 'Some A22 longer tip or whatever'}
                ,{category: 'two', name:'itemA2-2', description: 'Some A2 longer tip or whatever'}
                ,{category: 'two', name:'Some Item', description: 'Thi sis isd sdfewrw'}
         ],
         vmpT:null
         ,vmpM:null
         ,vmpR:null
         ,items: ['item1', 'item2', 'item 3']
         ,wdebug: false

        ,attEvt:[],
        getZml: getters.getState({ object: "gZml" }),
        p: {roomName: '0'
         ,roomObj: {}
         ,persMen: ''
         ,persObj: {}
         ,classListID: ''
         ,classListObj:{}
         ,questionID: ''
         ,questionObj: {}
         ,period: ''
         ,day: ''
         ,subjectID: ''
        ,subjectObj:{}}

        ,tab:{id:0
           , desc: "Attendance Class Lists"
           , workDone: 0
           , response: []
           , processor: (action,element) => {this.doSomething(action,element)}
           , sql:`SELECT * FROM hw_classlist s order by s.grade, teacher`
           , progess:false
        },
        buttons:[
            {to:"/checklog", name:"checklog"},
            {to:"/emailcheck"},
            {to:"/class"},
            {to:"/genlistview"},
            {to:"/tce", name:"Teacher Class Edit (tce)"},
            {to:"/teacherlist", name:""},
            {to:"/testview", name:"Test View"},
            {to:"/vglist", name:"General teacher List (vglist)"},
            {to:"/wernertest"},
            ],

    }),
    computed: {
    },
    methods: {
      addEmojiToMessage (emoji) {
        this.content += emoji.value
      },
      change(e) {
        console.log(this.$options.name,'Weerner Change:', e)
      },
      activate() {
        zData.snack('sdf sdf klsdfjml ksdjfl aksdjf lkdsjflkasdfsadf')
        alert('doit')
      },
      afterQuick(r) {
        //We must clean the subject data - so we can really load all.
        this.getZml.subjects.length = 0
        zData.initialData('Really Load Latest Data',this.afterwards)
        console.log(this.$options.name,'after QUick',r)
      },
      attendanceLoadStuff(studentid) { //19014
        let sql =  `SELECT d.day_name, d.fulldate\
     , ifnull(attendancedate,concat(d.fulldate, ' 08:00' )) start
     , ifnull(a.status ,'No Entry') name\
     , ifnull(concat(a.staff,', ', a.location,', ', a.period) ,'No Entry') detail\
   FROM dkhs_date d \
LEFT JOIN v_attendance a ON substr(attendancedate,1,10) = d.fulldate AND a.studentid = ${studentid}\
  WHERE day_name not in ('Sunday','Saturday')\
    AND (substr(fulldate,1,4) = '2023'\
      OR substr(fulldate,1,4) = '2023')\
 ORDER BY fulldate,attendancedate`
      //zmlFetch(ts, afterwards)
      let loading = false
      zData.loadSql(loading, sql, this.afterwards)
      },
      afterwards(response) {
        this.attEvt = response
      },
    },
    created() {
      zData.quickLoadInitialData('get from ini, and then call real load - as a test', this.afterQuick)
    },
    mounted() {
      this.attendanceLoadStuff(19014)
    },
    watch: {
      persMen() {
        if (!this.testroom && this.persMen) {
          //lookup the teachers room
          this.testroom = this.persObj.room
        }
      }
    }
}
</script>