<template>
  <v-container fluid>
<!------------------SEARCH, ADD, REFRESH, EXPORT------------------------------------------->
    <v-progress-linear
      v-show="loading"
      indeterminate
      color="grey darken-2"
    ></v-progress-linear>
<!-------------------TABLE------------------------------------------>
        <v-card  elevation="6">
         <v-card-title class="text-center"> UserName : {{ user_name }}
            <v-btn x-small @click="showMore = !showMore" text> more </v-btn>
         </v-card-title>
         <v-card-text>
          <v-simple-table v-if="entityTable.length">
           <thead>
            <tr><th>Per</th>
                <th :class="showMore ? 'ma-2 pa-2' : 'mx-0 px-0'">Day 1</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 2</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 3</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 4</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 5</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 6</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 7</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 8</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 9</th>
                <th :class="showMore ? 'mx-2 px-2' : 'mx-0 px-0'">Day 10</th>
            </tr>
           </thead>
           <tbody v-if="entityTable.length">
             <tr v-for="(r,i) in entityTable" :key="i">
                 <td class="ma-2 pa-2"> P{{r.periodno}}</td>
                 <td v-for="j in 10" :key="j" class="px-0 mx-0">
                   <v-btn :color="cl(r.bday[j])"
                          :class="showMore ? 'ma-2 pa-2' : 'mx-0 px-0'"
                          rounded small
                          @click="sendBack(r,j,i,r.bday[j])"
                          :title="r.bday[j]"
                          >
                        <template v-if="showMore==true">
                        {{ r.bday[j] }}
                        </template>
                        <template v-else>
                        {{ r.bday[j].substr(0,2) }}
                        </template>
                   </v-btn>
                 </td>
             </tr>
          </tbody>
          </v-simple-table>
         </v-card-text>
        </v-card>
<!------------------------------------------------------------->
  </v-container>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import { getters } from "@/api/store";
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
export default {
  name: "Rooster",
  props: ['user_name'],
  components: {},
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      entityTable:[],
      entityTableHeader:[
           { text: 'Staff', value: 'staff' }
          ,{ text: 'Per', value: 'periodno' }
          ,{ text: 'Day1', value: 'day1' }
          ,{ text: 'Day2', value: 'day2' }
          ,{ text: 'Day3', value: 'day3' }
          ,{ text: 'Day4', value: 'day4' }
          ,{ text: 'Day5', value: 'day5' }
          ,{ text: 'Day6', value: 'day6' }
          ,{ text: 'Day7', value: 'day7' }
          ,{ text: 'Day8', value: 'day8' }
          ,{ text: 'Day9', value: 'day9' }
          ,{ text: 'Day10', value: 'day10' }
          ,{ text: 'arr', value: 'bday' }

      ],
      loading:false,
      showMore:false,
  }),
  computed: {},
  methods: {
    sendBack(row,day,per,sel) {
        console.log('selected', day,per+1,sel, row)
        this.$emit('selected', day,per+1,sel, row)
    },
    cl(rbdayx) {
      if (rbdayx && rbdayx.length > 2) {
        switch (rbdayx.substr(0,2)) {
        case "08":   return "green accent-1"
        case "09":   return "indigo lighten-3"
        case "10":   return "gold lighten-1"
        case "11":   return "blue lighten-4"
        case "12":   return "purple lighten-3"
        case "AF":   return "gray lighten-3"
        default:  return "gray lighten-1"
        }
      } else {
        return "gray lighten-1"
      }
    },
    tableDone(response) {
      this.loading = false
      if ('error' in response) {
        for (let i=1; i<9; i++) {
          let bday = []
            for (let j=1; j<12; j++) {
              bday.push( `AF` )
            }
            this.entityTable.push({user_name: 'ANY',
                                   periodno: i ,
                                   day1:'DD1',day2:'DD2',day3:'DD3',day4:'DD4',
                                   day5:'DD5',day6:'DD6',day7:'DD7',day8:'DD8',day9:'DD9',
                                   day10:'DD10',day11:'DD11',bday: bday
            })
        }
      } else {
        this.entityTable = response
        this.entityTable.forEach(e => {
            e.bday = []
            e.bday[1] = e.day1 ?  e.day1 : 'AFAF'
            e.bday[2] = e.day2 ?  e.day2 : 'AFAF'
            e.bday[3] = e.day3 ?  e.day3 : 'AFAF'
            e.bday[4] = e.day4 ?  e.day4 : 'AFAF'
            e.bday[5] = e.day5 ?  e.day5 : 'AFAF'
            e.bday[6] = e.day6 ?  e.day6 : 'AFAF'
            e.bday[7] = e.day7 ?  e.day7 : 'AFAF'
            e.bday[8] = e.day8 ?  e.day8 : 'AFAF'
            e.bday[9] = e.day9 ?  e.day9 : 'AFAF'
            e.bday[10] = e.day10 ?  e.day10 : 'AFAF'
        })
      }
      console.log('is it here?',this.entityTable)
    },
    //--------------------------------------------------------------------------------
    clickOnForm(editTable,method){
      console.log(editTable, method)
    },
    loadError(response) {
      console.log('loadError:',response)
      if ('error' in response) errorSnackbar(response.error)

    },
    refresh() {
      //If we have an error, report and wait.
      //If we dont get a user_name, then we set it for Jackie van Staden.
      let localUserName = 'STAD'
      if (this.user_name) localUserName = this.user_name
      this.loading = true
      let ts = {}
      ts.task = 'PlainSql'
      ts.sql = `SELECT user_name, periodno,\
  concat(substring(SUBSTRING_INDEX(SUBSTRING_INDEX(day1, '\n', 2), '\n' , -1),3,5),\
         if ( CHAR_LENGTH(day1) - CHAR_LENGTH(REPLACE(day1, '\n', SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(', CHAR_LENGTH(day1) - CHAR_LENGTH(REPLACE(day1, '\n', SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day1,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day2,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day2)-CHAR_LENGTH(REPLACE(day2,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day2)-CHAR_LENGTH(REPLACE(day2,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day2,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day3,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day3)-CHAR_LENGTH(REPLACE(day3,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day3)-CHAR_LENGTH(REPLACE(day3,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day3,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day4,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day4)-CHAR_LENGTH(REPLACE(day4,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day4)-CHAR_LENGTH(REPLACE(day4,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day4,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day5,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day5)-CHAR_LENGTH(REPLACE(day5,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day5)-CHAR_LENGTH(REPLACE(day5,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day5,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day6,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day6)-CHAR_LENGTH(REPLACE(day6,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day6)-CHAR_LENGTH(REPLACE(day6,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day6,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day7,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day7)-CHAR_LENGTH(REPLACE(day7,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day7)-CHAR_LENGTH(REPLACE(day7,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day7,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day8,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day8)-CHAR_LENGTH(REPLACE(day8,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day8)-CHAR_LENGTH(REPLACE(day8,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day8,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day9,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day9)-CHAR_LENGTH(REPLACE(day9,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day9)-CHAR_LENGTH(REPLACE(day9,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day9,\
  concat(SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(day10,'\n',2),'\n',-1),3,5),\
         if (CHAR_LENGTH(day10)-CHAR_LENGTH(REPLACE(day10,'\n',SPACE(LENGTH('\n')-1))) > 1\
            ,concat('(',CHAR_LENGTH(day10)-CHAR_LENGTH(REPLACE(day10,'\n',SPACE(LENGTH('\n')-1))),')')\
            ,'' )) day10\
  FROM rooster\
  WHERE user_Name like '${localUserName}'`
       zmlFetch(ts, this.tableDone,this.loadError)
    },
  },
  mounted() {
     console.log('Start' , this.$options.name)
     if (!this.user_name) {
       infoSnackbar("We need a UserName! - Please select staff (Responsible Person)")
     }
     this.refresh()
  },
  watch:{
    user_name() {
     this.refresh()
    }
  }
}
</script>