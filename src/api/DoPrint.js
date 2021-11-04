//https://stackoverflow.com/questions/52343006/how-to-print-a-part-of-a-vue-component-without-losing-the-style#52345332
export function doPrint(printRef) {
   // Get HTML to print from element
   const prtHtml = document.getElementById(printRef).innerHTML;
   
   // Get all stylesheets HTML
   let stylesHtml = '';
   for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
     stylesHtml += node.outerHTML;
   }
   
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