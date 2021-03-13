<template>

  <v-container v-if="dataList && dataHeader" ref="printxxxxxxxx">
      <v-btn @click="printIt"> print </v-btn>
   <v-data-table
    :headers="dataHeader"
    :items="dataList"
    :items-per-page="45"
    class="elevation-1"
    disable-pagination
    hide-default-footer
   >
   </v-data-table>       
  </v-container>   
</template>


<script>
export default {
    name:"zmlDataTable",
    props: ['dataList'],
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