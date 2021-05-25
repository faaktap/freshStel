<template>
  <v-container v-if="dataList && dataHeader">
    
    <v-row>
   <v-col cols="12">
     
     <div class="heading text-center"> 
       <v-btn small class="pa-1 ma-1" @click="printIt"> print </v-btn> {{ userHeader }}   </div>
   </v-col>
   <v-col cols="12">
   <v-data-table
    :headers="dataHeader"
    :items="dataList"
    :items-per-page="45"
    class="elevation-1"
    disable-pagination
    hide-default-footer
    id="printMe"
   >
   </v-data-table>       
   </v-col>
   </v-row>
  </v-container>   
</template>


<script>
import printJS from "print-js";
import { zDate } from '@/api/zDate.js';
export default {
    name:"zmlDataTable",
    props: ['dataList', 'userHeader'],
    data: () => ({
        dataHeader: [
          {text: 'User',             value: 'user_name' },
          {text: 'Type',             value: 'user_type' }
        ]      
    }),
    methods:{
      onButtonClick(todo,data) {
        console.log(todo, data)
      },
      reBuildHeaders() {
          this.dataHeader = []
          Object.keys(this.dataList[0]).forEach(ele => {
              this.dataHeader.push( {text:ele.toUpperCase(), value:ele } )
          })
      },
      printIt() {
        const style =
          "@page { margin-top: 10px } @media print { h1 { color: blue },heading { color: blue } }";
        const headerStyle = "align:center;";
          printJS({
          printable: "printMe",
          type: "html",
          header: this.userHeader + " ( " + zDate.format(zDate.todayNoHours(),'yyyy-MM-dd') + " )",
          headerStyle: headerStyle,
          style: style,
          scanStyles: false,
          onPrintDialogClose: () => console.log("The print dialog was closed"),
          onError: e => console.log(e)
          });

/*  Other way of printing the data....        
            // Get HTML to print from element
            console.log(this.$refs)
            let prtHtml = '<table style="border-collapse: collapse">'

            prtHtml += '<tr>'
            Object.keys(this.dataList[0]).forEach(ele => {
              prtHtml += '<th class="capitalize-first" style="border: 1px solid #CDCDCD">' + ele + '</th>'
            })
            prtHtml += '</tr>'

            this.dataList.forEach(ele => {
                prtHtml += '<tr>'
                Object.keys(ele).forEach(item => {
                  prtHtml += '<th>' + ele[item] + '</th>'
                })
                prtHtml += '</tr>'
            })
            prtHtml += '</table>'
            console.log(prtHtml)
            // Get all stylesheets HTML
            let stylesHtml = ''
            for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
              stylesHtml += node.outerHTML;
            }
            console.log(stylesHtml)
            // Open the print window
            const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
            
            WinPrint.document.write(`<!DOCTYPE html>
            <html>
              <head>
                ${stylesHtml}
              </head>
              <body>
                ${prtHtml}
              </body>
            </html>`);
            
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();          
*/            
      }

    },
    computed:{
        listLength() {
            if (this.dataList) {
                return this.dataList.length
            } else {
                return 0
            }
        }
    },
    mounted: function() {
        console.log('LOG : Mount')
        this.reBuildHeaders()
    },
    watch: {
        listLength (val, oldVal) {
            console.log(val,oldVal)
            this.reBuildHeaders()
        }
    }
}
</script>

<style scoped>
@media print {
  body { 
    overflow: auto;
    height: auto; 
  }
  .scroll-y {
     height: auto;
     overflow: visible;
  }
  .v-dialog--fullscreen {
     position: absolute;
     overflow: visible;
  }  
}
.capitalize-first {
  text-transform: lowercase;
}
.capitalize-first::first-letter {
  text-transform: uppercase;
}
</style>