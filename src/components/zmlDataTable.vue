<template>
 <div v-if="Array.isArray(dataList) && dataHeader">
   <v-row no-gutters class="mb-6" >
    <v-col cols="12" class="heading-2 text-center">
      <v-card class="pa-2"  color="blue" >
          VIEWER :  {{ userHeader }}
      </v-card>
    </v-col>
   </v-row>

  <v-card class="ma-2" id="printMe">
    <v-card-title class="hide">
     <table width="100%" border="0" class="ma-2">
     <tr class="d-print-table-row">
      <td width="30%" style="border: 0px; border-radius: 0px; float: left">
        DK-eLearn<br>Printed:{{ today }}
      </td>
      <td width="40%" style="border: 0px;  align: center">
        <center><strong>High School De Kuilen Hoërskool</strong><br>{{ userHeader }}</center>
      </td>
      <td width="30%" style="border: 0px; border-radius: 0px; float: right">
        <img height="60" src="img/logo.png" class="float-right" />
      </td>
  </tr>
 </table>

 </v-card-title>
   <v-card-text v-if="footer.length > 400" class="mx-0 my-1 pa-0 xhide" v-html="footer">  </v-card-text>
   <v-data-table
     v-if="Array.isArray(dataList)"
    :headers="dataHeader"
    :items="dataList"
    :items-per-page="45"
    class="elevation-2"
    disable-pagination
    hide-default-footer
    @click:row="clickOnRow"
    :item-class="itemRowBackground"
    multi-sort
   >
   </v-data-table>
   <v-card-text v-if="footer.length < 400" class="ma-1 pa-0 hide" v-html="footer">  </v-card-text>
 </v-card>
 </div>
</template>


<script>
import printJS from "print-js";
import { zDate } from '@/api/zDate.js';
export default {
    name:"zmlDataTable",
    props: ['dataList', 'userHeader','doPrint','footer','small'],
    data: () => ({
        dataHeader: [
          {text: 'User',             value: 'user_name' },
          {text: 'Type',             value: 'user_type' }
        ]
    }),
    methods:{
      itemRowBackground(item) {
        console.log('itemRowBackground','grade' in item , item.grade.indexOf('A')>-1)
        if ('learnassist' in item && item.learnassist) {
          return 'blue'
        }
        if ('grade' in item && item.grade.indexOf('A')>-1) {
           return 'red'
        }
        return ''
      },
      clickOnRow(p1,p2) {
        this.$emit('clickOnRow',p1,p2)
      },
      onButtonClick(todo,data) {
        console.log(todo, data)
      },
      reBuildHeaders() {
        if (Array.isArray(this.dataList) && this.dataList.length > 0) {
          this.$cs.l(this.$options.name,'isArray = ' , this.dataList.length, this.userHeader)
          //console.log()
          this.dataHeader = []
          Object.keys(this.dataList[0]).forEach(ele => {
              this.dataHeader.push( {text:ele.toUpperCase(), value:ele } )
          })
        } else {
          this.$cs.l(this.$options.name,'noArray = ', this.userHeader)
        }
      },
      printIt() {
        // const style =
        //   "@page { margin-top: 10px } @media print { h1 { color: blue },heading { color: blue } }";
        // const headerStyle = "align:center;";
        let style = ''
        if (this.small) {
         style = `
          @page { margin-top: 45px }
          @media print {
          .print  {display:block}\
          body {overflow: auto;height: auto;width: 100%;}\
          h1 { color: #1c3a1b }\
          heading { color: #1c3a1b; height: 150px}\
          p.bodyText {font-size:12pt}\
          th, td {font: Helvetica;font-size: 9pt; border-radius: 1px; padding: 1px; margin: 1px; border: 1px solid #e6e4ed;}\
          table: {width:95%;}\
          aside {display: none;}\
          main {display: block;}\
          .red {background-color: #eee;}\
          .blue {background-color: #FFFFE0;}\
         }`
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
      }

    },
    computed:{
      today() {
          return zDate.format(zDate.todayNoHours(),'yyyy-MM-dd')
      },
        listLength() {
            if (this.dataList) {
                return this.dataList.length
            } else {
                return 0
            }
        },
        objectLength() {
            if (this.dataList && this.dataList.length) {
                return Object.entries(this.dataList[0])
            } else {
                return 0
            }
        }

    },
    mounted: function() {
        this.reBuildHeaders()
    },
    watch: {
        listLength () {
          this.reBuildHeaders()
        },
        objectLength () {
          this.reBuildHeaders()
        },
        doPrint () {
          if (this.doPrint > 0) this.printIt()
        }
    }
}
</script>

<style scoped>
.hide {display:none;}

@media print {
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
    background-color: rebeccapurple;
  }
}
.capitalize-first {
  text-transform: lowercase;
}
.capitalize-first::first-letter {
  text-transform: uppercase;
}
.red {
  background-color: rebeccapurple;
}
.blue {
  background-color: gainsboro;
}
</style>