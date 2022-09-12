<template>
<v-container fluid>
  <v-layout align-center justify-center>
  <v-card max-height="400" max-width="500" class="ma-2" v-if="persRec">
  <v-card-text class="staff-container">

   <v-img v-if="'photo' in persRec && persRec.photo.length > 5"
          :src="'https://kuiliesonline.co.za/bib/assets/staff/' + persRec.photo + '?'+Math.random()"
           max-width="90"
           position="left left"
           class="ma-2 Photo"
           style="border-radius:20px">
   </v-img>

  <div class="Surname headline">
    {{ persRec.surname }}
  </div>

  <div class="Firstname headline">
   {{ persRec.name }}
  </div>
  <div class="Phone subtitle-1">
       {{ persRec.contactnumber }}
       <v-divider  />
  </div>

  <div class="i1"><v-icon small>mdi-phone</v-icon></div>
  <div class="i2"><v-icon small>mdi-office-building</v-icon></div>
  <div class="i3"><v-icon small>mdi-function</v-icon></div>
  <div class="i4"><v-icon small>mdi-email</v-icon></div>
  <div class="i5"><v-icon small>mdi-update</v-icon></div>

  <div class="detail1">  021 903 5121</div>
  <div class="detail2"> {{ persRec.room }}</div>
  <div class="detail3"> {{ persRec.workarea }}</div>
  <div class="detail4"> {{ persRec.workemail || persRec.email }}</div>
  <div class="detail5"> {{ persRec.changedate }}</div>

  <div class="line"><v-divider
                       class="mx-4"
                       vertical
                      ></v-divider>
  </div>
  <div class="logo float-right">
    <v-img class="float-right"
           src="/img/logo.png"
           max-height="90"
           contain
           height="90"
    />
    <!-- <small>DE KUILEN HS</small> -->
  </div>
  </v-card-text>
 </v-card>
 <v-card v-else>
  <v-card-title> We could not find the teacher: </v-card-title>
  {{ persName }}
  {{ persMenemonic }}
 </v-card>
  </v-layout>
 </v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
export default {
    name:"PersonelNameCardDemo",
    props: ['persName'],
    data: () => ({
      persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
      loggedIn:getters.getState({ object: "gZml" }).login.username,
      persRec: { photo:'', surname:'', name:'', contactnumber:'' },
      srch: null,
   }),
    methods:{
      findPersonel() {
        //check if we have a username
        let len = this.persName.length
        this.scrh = ''
        for (const e of this.persMenemonic)  {
          //console.log(e.user_name,'|', e.user_name.substr(0,len).toUpperCase(),'|', this.persName.toUpperCase())
          if (e.user_name.substr(0,len).toUpperCase() == this.persName.toUpperCase()) {
            this.srch = `menemonic = '${this.persName}'`
            break
          }
          console.log('persid')
          if (e.persid == this.persName) {
            this.srch = `persid = ${this.persName}`
            break
          }

          const srchSurname = e.surname ? e.surname.toUpperCase() : ''
          const srchInit = e.name ? `${e.name.substr(0,1).toUpperCase()}` : ''
          const compareIt = `${srchSurname}, ${srchInit}`
          console.log(compareIt, this.persName, srchInit)
          if (compareIt == this.persName.toUpperCase()) {
            this.srch = `persid = ${e.persid}`
            break
          }
        }
        if (this.srch) {
          this.loadPers(this.srch)
        } else
          //we checked persid, and menemonic, found nada, let's look at surname?
          //alert('we did not find this staff member')
          this.persRec = null
      },
      loadPers(srch) {
        zFetch({task: 'PlainSql',
                  sql: `select * from dkhs_personel where ${srch}`,
                  api: zmlConfig.apiDKHS
        })
        .then((r) => {
            if (r.status >= 200 && r.status <= 299) {return r.json() } else {throw Error(r.statusText)}
        })
        .then((response) => {
            if (!response) { throw Error('no staff') }
            console.log(response)
            this.persRec = response[0]
            console.log(this.persRec)
        })
        .catch((error) => {
            console.log(error)
            alert('err!');
        })
    },
    },
    mounted: function() {
        if (this.persName) {
          console.log('work out what we want....' , this.persName, this.persMenemonic.length)
          this.findPersonel()
        } else {
        this.persRec.surname = 2
        this.persRec.name = 3
        this.persRec.contactnumber =4
        this.persRec.room = 5
        this.persRec.workarea =6
        this.persRec.email =6
        this.persRec.changedate= 5

        }
    },
}
</script>

<style scoped>
#fileInput {
  display: none;
}
.staff-container {
display: grid;
  grid-template-columns: 0.8fr 0.7fr 0.6fr 0.5fr 2.4fr 1fr 1fr 1fr 2fr;
  grid-template-rows: 0.3fr 0.3fr 0.4fr 0.2fr 0.2fr 0.2fr 0.2fr 0.2fr 0.1fr;
  gap: 1px 1px;
}
.Photo { grid-area: 1 / 1 / 4 / 4; }
.i1 { grid-area: 4 / 3 / 5 / 4; }
.i2 { grid-area: 5 / 3 / 6 / 4; }
.i3 { grid-area: 6 / 3 / 7 / 4; }
.i4 { grid-area: 7 / 3 / 8 / 4; }
.i5 { grid-area: 8 / 3 / 9 / 4; }
.i6 { grid-area: 9 / 3 / 10 / 4; }
.Firstname { grid-area: 2 / 5 / 3 / 9; }
.Phone { grid-area: 3 / 5 / 4 / 9; }
.detail1 { grid-area: 4 / 5 / 5 / 9; }
.detail2 { grid-area: 5 / 5 / 6 / 9; }
.detail3 { grid-area: 6 / 5 / 7 / 9; }
.detail4 { grid-area: 7 / 5 / 8 / 9; }
.detail5 { grid-area: 8 / 5 / 9 / 9; }
.bottom { grid-area: 9 / 1 / 10 / 10; }
.line { grid-area: 1 / 4 / 4 / 5; }
.underlogo { grid-area: 4 / 9 / 9 / 10; }
.underpic { grid-area: 4 / 1 / 9 / 3; }
.logo { grid-area: 2 / 9 / 4 / 10; }
/*.logo { grid-area: 2; } */
.Surname { grid-area: 1 / 5 / 2 / 10; }
</style>

