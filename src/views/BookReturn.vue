<template>
 <v-container>
  <v-snackbar v-model="snackbar" :timeout="snackTimeout" top color="error" >
    <span> {{ localSnackText }}  </span>
    <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text
               v-bind="attrs"
              @click="snackbar = false"
        ><v-icon> mdi-close </v-icon>
        </v-btn>
      </template>
  </v-snackbar>
  <v-row>
   <v-col sm-6>
    <v-card outlined class="mt-3 mb-3">
     <v-card-title> <h1> RETURN BOOKS </h1> </v-card-title>
      <v-card-text>
          
       <p> This function is for mass returns with barcodescanner, it allows you to scan multiple books, and return them by clicking on submit.
           The books are only submitted once you press the submit button!  <br>
           If you want to enter a booknumber by "hand" - please type fast (or use paste), otherwise only a part of the code might be used. 
           To cancel an already entered code, click on the <v-icon x-small color="red">mdi-cancel</v-icon> button next
           to the entry</p>
           <v-btn small text @click="booksScannedSofar()" title="click here to update progress total"> Progress </v-btn>     
           <span v-if="scannedTotal > 0"> ( {{ scannedTotal}} )  </span>
      </v-card-text>
   </v-card>
   <v-text-field filled id="my-input" v-model="barcodeid" ref="barcoder" autofocus />
   <v-btn v-if="scanResults.length > 0" @click="processOnloanBooks"> Submit {{ scanResults.length }} book(s) </v-btn>     
   
   <v-progress-linear :indeterminate="progress" :progress="false"/>
  </v-col>
  <v-col> 
  <v-card>
   <v-card-text class="py-0" v-if="scanResults.length > 0">
    <v-timeline align-top dense v-for="(book,index) in scanResults" :key="book.bookcopyid">
      <v-timeline-item color="pink" small>
          <div flex>
           <div style="align:left"> 
               <div class="cyan lighten-3" v-if="index==0"> 
                   <b>{{ book.book_name }} ({{ book.bookcopyid }})  {{book.person}} 
                       <span class="red lighten-1 font-weight-thin white--text">{{book.enddate}}</span>
                   </b>
                   <v-btn x-small icon @click=cancelMe(book.bookcopyid)><v-icon color="red"> mdi-cancel </v-icon></v-btn>
               </div>
               <div v-else>  
                      {{ book.book_name }} ({{ book.bookcopyid }}) 
                      <div style="align:right">  {{book.person}} <span class="red lighten-5">{{book.enddate}}</span></div>    
                      <v-btn x-small icon @click=cancelMe(book.bookcopyid)><v-icon color="red"> mdi-cancel </v-icon></v-btn>
                </div>
               </div> -
          </div>
      </v-timeline-item>
     </v-timeline>
    </v-card-text>
   </v-card>
  </v-col>
 </v-row>
 <confirm-it ref="confirm"> </confirm-it>
 <v-dialog v-model="showProgress"  v-if="scannedBooksArray">
     <v-card class="mx-auto" max-width="300">
     <v-btn icon @click="showProgress = false" ><v-icon small>mdi-close</v-icon></v-btn> 
      <v-list dense>
       <v-subheader>Progress 
       </v-subheader>
        <v-list-item v-for="tot in scannedBooksArray" :key="tot.book">
            <v-list-item-content>
                <v-list-item-title v-text="tot.book"></v-list-item-title><small>
                 {{ tot.scandate }} - {{ tot.count }} </small>
            </v-list-item-content>
        </v-list-item>
      </v-list>
     </v-card>
 </v-dialog>
</v-container>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import confirmIt from '@/api/DialogConfirm.vue';
export default {
   components: {confirmIt},
   data () {
      return {
      winners:[],
      barcodeid:'',
      progress:false,
      scanResults:[],
      scannedBooksArray:[],
      scannedTotal:0,
      showProgress:false,
      snackbar: '',
      localSnackText: '',      
      snackTimeout:3000,
      snackColor:"error",
      confirmSound:new Audio('https://www.kuiliesonline.co.za/dkhs/confirm.mp3'),
      //confirmSound:new Audio('https://kuiliesonline.co.za/api/candid/candidates.php?task=sound&sounddesc=confirm'),
      errorSound:new Audio('https://www.kuiliesonline.co.za/dkhs/jump.mp3')
    } 
   },
   methods: {
     booksScannedSofar() {
        let bs = {task: 'bookreturnscaninfo', days: 20};
        zmlFetch(bs, this.booksScanned); 
     },
     booksScanned(response) {
         /*
            $sql = "SELECT b.book_name book, DATE_FORMAT(o.enddate, '%Y %m %d') scandate, count(*) count
              FROM dkhs_onloan o, dkhs_copy c, dkhs_book b
             WHERE o.bookcopyid = c.bookcopyid
               AND c.bookid = b.bookid
               AND o.enddate > DATE_SUB(NOW(), INTERVAL 10 DAY) 
          group by b.book_name,DATE_FORMAT(o.enddate, '%Y %m %d')
          order by 2 DESC ,1"; */
        if (response.error) {
            alert(response.error);
            return;
        }
        this.scannedBooksArray = response;  
        this.scannedTotal = 0;
        this.scannedBooksArray.forEach((a) => (this.scannedTotal += parseInt(a.count) ));
        console.log('scanned so far : ' , this.scannedTotal);
        this.showProgress = true;
      },
    cancelMe(copyID) {
       const answerIndex = this.scanResults.findIndex(a => (a.bookcopyid == copyID));
       if (answerIndex == -1) {
         this.snackTime(copyID + " COULD NOT NOT FOUND.","error",1000);    
       } else {
         this.scanResults.splice(answerIndex, 1);
         this.snackTime(copyID + " has been removed from your list.","primary",1000);    
       }
    },
    loadError(error) {
        console.log(error);
        alert('Nothing loaded yet (possibly) - error : ' + error);
    },      
    deBounce(callme) {
        // Get the input box
        let input = document.getElementById('my-input');
        
        // Init a timeout variable to be used below
        let timeout = null;
        
        // Listen for keystroke events
        input.addEventListener('keyup', function () {
            // Clear the timeout if it has already been set.
            // This will prevent the previous task from executing
            // if it has been less than <MILLISECONDS>
            clearTimeout(timeout);
            // Make a new timeout set to go off in 500ms (1/2 second)
            timeout = setTimeout(function () { callme(); }, 500);
        });
    },
    callme() {
        this.progress = true;
        this.barcodeid = parseInt(this.barcodeid, 10);
        if (this.barcodeid < 0 && this.barcodeid > 1000000) return;
        
        if (this.checkDuplicate(this.barcodeid) !== -1) {
           this.snackTime("We have already scanned this book!","warning",1000);
           this.progress = false;
           this.barcodeid = '';           
        } else {
           let bi = {task: 'bookonloaninfo', bookno: this.barcodeid};
           zmlFetch(bi, this.bookLoaded); 
        }
    },
    checkDuplicate(bookno) {
        //check if bookno is already in scanResult[].bookcopyid
        let answer = this.scanResults.findIndex(a => (a.bookcopyid == bookno));
        console.log('Check Dups for ',bookno,' result = ', answer);
        return answer;
    },
    setFocusBack(bc) {
        setTimeout(function () { bc(); }, 900);
        this.errorSound.play();        
    },    
    bc() {this.$refs.barcoder.focus();
    },
    snackTime(pMessage, pColor=this.snackColor, pTime = this.snackTimeout) {
        this.snackColor = pColor;
        this.snackTimeout = pTime;
        this.localSnackText = pMessage;
        this.snackbar = true;
        //set focus back on input after display of snack..
        this.setFocusBack(this.bc);
        
    },
    bookLoaded(response) {
        console.log(response[0]);
        this.progress = false;                
        if (response.error) {
            console.log(response.error)
            this.snackTime(response.error,"error");
        } else {
            this.scanResults.unshift(response[0]);
            this.confirmSound.play();        
        }
        this.$refs.barcoder.focus();
        this.barcodeid = '';
    },
    processOnloanBooks() {
        this.$refs.confirm.open('Submit Books', 'Are you sure?', { color: 'blue' })
        .then((confirm) => {
            if (confirm == true) 
               this.processOnloanBooksConfirmed();
            else 
               return;
        });
    },
    processOnloanBooksConfirmed() {
        let polb = {task: 'processonloadbooks', booklist: this.scanResults};
        this.progress = true;
        zmlFetch(polb, this.booksProcessed);
    },
    booksProcessed(response) {
        console.log(response);
        if (response.error !== 0) {
          this.snackTime("Error - " + response.exception, "error");
        } else {
          this.snackTime("We processed - " + this.scanResults.length
                       + " books. Updates - " + response.affectedRows
                       , "primary");
          this.scanResults = [];
        }
        this.progress = false;
    },
    preventNav(event) {
      if (!this.scanResults.length) return;
      event.preventDefault()
      event.returnValue = ""
    }
   },
   watch: {
    barcodeid() {
       
    }
   },
   mounted:function () {
      console.log('BR:mounted - zml:');
      this.deBounce(this.callme);
   },
   beforeMount() {
    window.addEventListener("beforeunload", this.preventNav)
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventNav);
  },

}
</script>