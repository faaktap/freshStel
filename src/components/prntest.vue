<template>
<v-container fluid>
     <div id="print-registration-form">
       <table style="border-collapse: collapse; width: 100%" border="1px">
           <tr><td>s.dkfmlksdfjglksdfgjsdfgsd f</td></tr>
           <tr><td>s.dkfmlksdfjglksdfgjsdfgsd f</td></tr>
           <tr><td>s.dkfmlksdfjglksdfgjsdfgsd f</td></tr>
           <tr><td>s.dkfmlksdfjglksdfgjsdfgsd f</td></tr>

       </table>
     </div>
        <button @click="print1()" > Print </button>
        <v-btn @click="printDiv('print-registration-form')" >PrintDiv</v-btn>
</v-container>
</template>

<script>
import * as Printjs from "print-js";
export default {
   methods: {

    printDiv(divName){
      // Get HTML to print from element
      const prtHtml = document.getElementById(divName).innerHTML;
      // Get all stylesheets HTML
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }
      // Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      WinPrint.document.write(`<!DOCTYPE html><html><head>${stylesHtml}</head><body>${prtHtml}</body></html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },


     print1() {
         console.log('print1')
       Printjs({
         printable: "print-registration-form", //Id to print content
         style:'',
         type: "HTML"
      });
    }
  }
}
</script>


