let zml = 'zml'
export const ls = {
    // eslint-disable-next-line
    cl: (...args) => { 
      // console.log(args)
    },
    available:  true,
    remove: (name) => {
       localStorage.removeItem(name)
       return
    },
    test: (name) => {
      if (localStorage.getItem(name)) {
        return true
      }
      return false
    },
    load: (name) => {
      ls.cl('LSLOADa:', name)
      let payload
      if (name.length > 3 && name.substr(0,3).toUpperCase() == zml.toUpperCase()) {
        ls.cl('LSLOADb: Test if ZML is in front', name)
        if (localStorage.getItem(name)) {
          try {
            ls.cl('LSLOADc: SORTED1', name)
            payload = JSON.parse(atob(localStorage.getItem(name)));
          } catch(e) {
            localStorage.removeItem(name)
          }
          return payload
        }
      } else {
        ls.cl('LSLOADd: test if name with zml added exist?', zml + name)
        if (localStorage.getItem(zml + name)) {
          try {
            ls.cl('LSLOADe: YES! It Exist! SORTED2', zml + name)
            payload = JSON.parse(atob(localStorage.getItem(zml + name)));
          } catch(e) {
            localStorage.removeItem(zml + name)
          }
          ls.cl('Now we return payload, but what about next time?')
          return payload
        }
        alert('ok, we have a problem - we want to load - but nothing exist? Please inform Werner')
        ls.cl('LSLOADf: It does not exist :-( Add it', zml + ' ' + name)
        ls.makeNewZMLReplacement(name)
        ls.cl('LSLOADg: ZML-Now it SHOULD exist!TryAgainLOAD', zml + name)
        if (localStorage.getItem(zml + name)) {
          try {
            ls.cl('LSLOADh: SORTED3', zml + name)
            payload = JSON.parse(atob(localStorage.getItem(zml + name)));
          } catch(e) {
            localStorage.removeItem(zml + name)
          }
          return payload
        } else {
          alert('Daar is groot fout!')
        }
      }
      ls.cl('LSLOADi: RETURN FALSE')
      return false
    },
    makeNewZMLReplacement: (name) => {
      // They requested name, and not zml+name.
      // Retrieve name, and save as zml+name encrypted, if success (keep?) delete old one
      ls.cl('LSMakeNewReplacement: ADDZML', zml + ' ' + name)
      let payload = ls.loadOldOne(name)
      ls.cl('loading old one',payload)
      if (payload) {
        let jPayload = btoa(JSON.stringify(payload))
        localStorage.setItem(zml + name, jPayload)
        localStorage.removeItem(name)
        ls.cl('LSMadeNewReplacement : save new one, delete old one',payload, jPayload)
      }
      ls.cl('LSMakeNewReplacement : done with replace')
    },
    loadOldOne: (name) => {
      ls.cl('loadOldOne',name)
      let payload = {}
      if (localStorage.getItem(name)) {
        try {
          payload =  JSON.parse(localStorage.getItem(name));
        } catch(e) {
          localStorage.removeItem(name)
        }
        ls.cl('loadOldOne Done, ', payload)
        return payload
      }
    },
    save: (name, payload) => {
      ls.cl('LSSAVE:', name, payload)
      if (name.length > 3 && name.substr(0,3).toUpperCase() == zml.toUpperCase()) {
        let jPayload = btoa(JSON.stringify(payload))
        localStorage.setItem(name, jPayload)
        ls.cl('LSSAVE:ZMLSET', name, jPayload)
      } else {
        let jPayload = btoa(JSON.stringify(payload))
        localStorage.setItem(zml + name, jPayload)
        // just for incase
        localStorage.removeItem(name)
        ls.cl('LSSAVE:ZMLADDSET', zml + name, jPayload)
      }
    },
    help: () => {
        return `We have remove(item), load(item) and save(item,data)
        we use this to store object to localstorage - 2021/12/07 WS`
    },
}