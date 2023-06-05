<template>
 <div>

  <v-card class="ma-2" id="printMe">
    <v-card-title class="hide">
     <table width="100%" border="0" class="ma-2">
     <tr class="d-print-table-row">
      <td width="30%" style="border: 0px; border-radius: 0px; float: left">
        DK-eLearn<br>Printed:{{ today }}
      </td>
      <td width="40%" style="border: 0px;  align: center">
        <center><strong>High School De Kuilen Hoërskool</strong></center>
      </td>
      <td width="30%" style="border: 0px; border-radius: 0px; float: right">
        <img height="60" src="img/logo.png" class="float-right" />
      </td>
  </tr>
 </table>

 </v-card-title>
    <v-card-text v-if="footer.length > 400" class="mx-0 my-1 pa-2 xhide" v-html="footer"/>
      <v-toolbar color="primary" dense>
        <v-toolbar-title >           VIEWER :  {{ userHeader }} </v-toolbar-title>
        <v-spacer />
        <!-- <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
        <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn> -->
     </v-toolbar>
   <v-data-table
     v-if="showAs=='list'"
    :headers="compCol"
    :items="compList"
    :items-per-page="45"
    class="elevation-2"
    disable-pagination
    hide-default-footer
    @click:row="clickOnRow"
    :item-class="itemRowBackground"
    mobile-breakpoint="0"
    multi-sort
   >
   </v-data-table>
   <v-layout v-else row wrap align-content-start justify-space-between class="ma-2 pa-2">
   <v-card color="gray lighten-3" class="ma-2 pa-2" elevation="2"
           max-width="400"
           v-for="(row,i) in compList" :key="i">

        <!-- <v-text-field v-for="(r,j) in splitRow(row)" :key="j" :value="r.value" :label="r.text" /> -->
        <v-card v-for="(r,j) in splitRow(row)" :key="j" >
              {{ r.value }} <br>
         <!-- {{ r.name }}:  -->
        </v-card>


   </v-card>
   </v-layout>
   <v-card-text v-if="footer.length < 400" class="ma-1 pa-0 hide" v-html="footer" />
 </v-card>
 </div>
</template>


<script>
import printJS from "print-js";
import { zDate } from '@/api/zDate.js';
import { util } from '@/api/util.js';
export default {
    name:"zmlDataTable",
    props: {
      dataList: {default:[] },
      userHeader: {default:''},
      doPrint: {default:''},
      footer: {default:''},
      small: {default:false}
    },
    data: () => ({
      showAs:'list',
    }),
    methods:{
      itemRowBackground(item) {
        console.log('itemRowBackground','grade' in item)
        if ('learnassist' in item && item.learnassist) { return 'blue'}
        if ('grade' in item && item.grade && item.grade.indexOf('A')>-1) {return 'red'}
        return ''
      },
      clickOnRow(p1,p2) {
        this.$emit('clickOnRow',p1,p2)
      },
      onButtonClick(todo,data) { console.log(todo, data) },
      printIt() {
        // const style =
        //   "@page { margin-top: 10px } @media print { h1 { color: blue },heading { color: blue } }";
        // const headerStyle = "align:center;";
        let style = ''
        //th, td {font: Helvetica;font-size: 10pt; border-radius: 1px; padding: 1px; margin: 1px; border: 1px solid #e6e4ed;}\
        if (this.small) {         style = `
          @page { margin-top: 45px }
          @media print {
          .print  {display:block}\
          body {overflow: auto;height: auto;width: 95%;}\
          h1 { color: #1c3a1b }\
          heading { color: #1c3a1b; height: 150px}\
          p.bodyText {font-size:12pt}\
          th, td {font-size: 12pt; border-radius: 1px; padding: 1px; margin: 1px; border: 1px solid #e6e4ed;}\
          table: {width:95%;}\
          aside {display: none;}\
          main {display: block;}\
          .red {background-color: rgb(182, 164, 201); font-style: italic;}\
          .blue {background-color: gainsboro; font-style: oblique;}\
         }`
         //          .red {background-color: #eee;}\
          //.blue {background-color: #FFFFE0;}\

        } else {
         style = `
          @page { margin-top: 10px }
          @media print {
          .print  {display:block}\
          body {overflow: auto;height: auto;font:Garamond;}\
          h1 { color: #1c3a1b }\
          heading { color: #1c3a1b }\
          p.bodyText {font-size:8pt}\
          th, td {border-radius:2px; padding: 2px;margin: 2px; border: 1px solid #e6e4ed;}\
          table: {width:95%;}\
          aside {display: none;}\
          main {display: block;}\
         }`
        }
        const headerStyle = "align: center;font:Garamond";

          printJS({
           printable: "printMe",
           type: "html",
           //header: `<center><small> ${this.today} )</small></center>`,
           headerStyle: headerStyle,
           style: style,
           scanStyles: false,
           onPrintDialogClose: () => console.log("The print dialog was closed"),
           onError: e => console.log(e)
          });
          this.$emit('printed')
      },
      splitRow(row) {
        if (row && typeof(row) != 'object') {
         console.log('util.createHeader',row,'is not an object')
         return ['a','b']
        }
        console.log('util.splitRow',row)
        let tHeader = []
        Object.entries(row).forEach( ([key, value]) => {
            tHeader.push(
                 { name: key.charAt(0).toUpperCase() + key.slice(1)
                 , value: value} )
       })
       return tHeader
      }
    },
    computed:{
      compList() {
        // console.log('zdt = complists',this.dataList)
        if (!this.dataList) return []
        //We could return a slice when showing cards and there are too many : this.dataList.slice(0, n);
        return this.dataList
      },
      compCol() {
       return util.createHeader(this.dataList[0])
       /*
       Object.keys(this.dataList[0]).forEach(name => {
            tHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1)
                 , value: name} )
       })
       console.log('zdt = head',tHeader)
       return tHeader
       */
      },
      today() {
          return zDate.format(zDate.todayNoHours(),'yyyy-MM-dd')
      },
    },
    mounted: function() {
        console.log('Mount', this.$options.name)
    },
    watch: {
        doPrint () {
          if (this.doPrint > 0) this.printIt()
        }
    }
}
</script>

<style scoped>
.hide {display:none;}

.red {
  background-color: rgb(182, 164, 201);
  font-style: italic;
}
.blue {
  background-color: gainsboro;
  font-style: oblique;
}
.capitalize-first {
  text-transform: lowercase;
}
.capitalize-first::first-letter {
  text-transform: uppercase;
}


@media print {

/*
  *:before,*:after {
        background: transparent !important;
        color: #000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
    }
*/
  body {
    overflow: auto;
    height: auto;
    margin-left: 20px;
  }
  table {width: 90%;}
  .scroll-y {
     height: auto;
     overflow: visible;
  }
  .v-dialog--fullscreen {
     position: absolute;
     overflow: visible;
  }
.red {
  background-color: rgb(182, 164, 201);
  font-style: italic;
}
.blue {
  background-color: gainsboro;
  font-style: oblique;
}
}

</style>