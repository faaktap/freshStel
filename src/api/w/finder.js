import Vue from 'vue'
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zFetch } from '@/api/zmlFetch';
//import { ls } from "@/api/localStorage.js"
//import { zLoadCal } from "@/api/loadCalendar.js"
//import { crudTask } from '../components/crud/crudTask';

function l(...args) {
    Vue.prototype.$cs.l(...args)
}

export const finder = {
    someGlobals :  'find anything anywhgere :-)',
    loading : false,
    persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
    randomChuckNorris: async () => {
        let response = await fetch('https://api.chucknorris.io/jokes/random')
        let data = await response.json()
        console.log('chuck data', data.value)
        return data
    },
    findPersonel(persName, callbackFunction) {
        //check if we have a username
        let len = persName.length
        let srch = ''
        for (const e of finder.persMenemonic)  {
          //console.log(e.user_name,'|', e.user_name.substr(0,len).toUpperCase(),'|', persName.toUpperCase())
          if (e.user_name.substr(0,len).toUpperCase() == persName.toUpperCase()) {
            srch = `menemonic = '${persName}'`
            break
          }
          l('persid')
          if (e.persid == persName) {
            srch = `persid = ${persName}`
            break
          }

          const srchSurname = e.surname ? e.surname.toUpperCase() : ''
          const srchInit = e.name ? `${e.name.substr(0,1).toUpperCase()}` : ''
          const compareIt = `${srchSurname}, ${srchInit}`
          console.log(compareIt, persName, srchInit)
          if (compareIt == persName.toUpperCase()) {
            srch = `persid = ${e.persid}`
            break
          }
        }
        if (srch) {
          finder.loadPers(srch,callbackFunction)
        } else
          //we checked persid, and menemonic, found nada, let's look at surname?
          //alert('we did not find this staff member')
          finder.persRec = null
      },
      persRec: {},
      loadPers(srch,cbf) {
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
            finder.persRec = response[0]
            cbf(finder.persRec)
            console.log(this.persRec)
        })
        .catch((error) => {
            console.log(error)
            alert('err!');
        })
     }

}

