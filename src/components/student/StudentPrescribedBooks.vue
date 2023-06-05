<template>
 <v-card xmax-width="500" class="mx-auto" :color="color" elevation="2">
   <v-card-title class="headline ma-1"> Prescribed Books </v-card-title>
   <v-card-text v-if="bookList">
   <v-data-table
         :headers="bookHeader"
         :items="bookList"
         :items-per-page="15"
         :hide-default-footer="true"
         class="elevation-1"
         @click:row="clickOnRow"
       ></v-data-table>
   </v-card-text>
   <v-card-text v-else>
      Oops - no emails found for {{ studentid }}
   </v-card-text>
 </v-card>
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
export default {
    name:"StudentPresBooks",
    props: ['studentid','color'],
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      bookList:null,
      bookHeader: [
        //{text: 'Surname',  align: 'start',  value: 'surname' },
        //{text: 'firstname',align: 'start',  value: 'firstname' },
          {text: 'Bookname', align: 'start',  value: 'book_name' },
          {text: 'Grade'   , align: 'start',  value: 'gradeid' },
          {text: 'BookID'  , align: 'start',  value: 'bookcopyid' },
          {text: 'LoanDate', align: 'start',  value: 'startdate' },
          {text: 'ReturnDate', align: 'start',  value: 'enddate' },
          {text: 'Amount',    align: 'right',  value: 'amount' },
        ]
    }),
    methods:{
      clickOnRow() {
        if (['admin','teacher'].includes(this.getZml.login.type)) {
           alert('What functionality would you like to see here?')
        }
      },
      getBooks() {
        if (this.studentid) {
           let sl = { task: 'plainSql'
                    , sql: `SELECT s.surname, s.firstname, b.book_name, b.gradeid
    , c.bookcopyid, l.startdate, l.enddate
    , DECODE_ORACLE(l.enddate,null , l.infoflag, 0.00) amount
     FROM dkhs_onloan l
     join dkhs_student s on s.studentid = l.studentid
     join dkhs_copy c on c.bookcopyid = l.bookcopyid
     join dkhs_book b on b.bookid = c.bookid
      where s.studentid =  ${this.studentid}
      order by gradeid desc, startdate desc`
                  }
        zmlFetch(sl, this.processAfterFetch);
           }
      },
      processAfterFetch(response) {
        console.log(response)
          if (!response.error) {
             this.bookList= response
          } else {
              this.bookList = []
          }
      }

    },
    created() {
      if (this.studentid) this.getBooks()
    },
    mounted: function() {
      console.log(this.$options.name,  this.studentid)
    },
    watch: {
        studentid(n,o) {
            if (n != o) this.getBooks()
        }
    }
}
</script>