import { getters } from "@/api/store";

//import { lookup } from "@/api/Lookups.js"

export const look = {
    someGlobals :  'this is lookup',
    getZml : getters.getState({ object: "gZml" }),
    persMenemonic: (uid) => {
      if (uid == null) return ''
      let persMenemonic = getters.getState({ object: "gZml" }).persMenemonic
      let idx = persMenemonic.findIndex(e => e.userid == uid)
      if (idx > -1) {
         return persMenemonic[idx].user_name
      }
      return "u"+uid
    },  
    isAuthenticated: ()  => {
        return getters.getState({ object: "gZml" }).login.isAuthenticated
    },
}