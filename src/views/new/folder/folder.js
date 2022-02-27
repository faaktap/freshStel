import { getters } from "@/api/store";
let isAuthenticated = getters.getState({ object: "gZml" }).login.isAuthenticated;
let username = getters.getState({ object: "gZml" }).login.isAuthenticated;
let usertype = getters.getState({ object: "gZml" }).login.type;
export const fol = {
  someGlobals: 'this is lookup in folders',
  // getZml : getters.getState({ object: "gZml" }),
  // after loading folders, we come here to filter.
  // We receive the "response" from db, and pass back an array to this.files[]
  filterDirectoryResults (result) {
    let folders = []
    result.forEach((element) => {
      // add a new element property?
      element.scanned = false
      if (element.dir) {
        if (element.filename[0] !== '.' && element.filename[0] !== '.') {
            if (username == 'werner' && element.filename.includes('GR1')) {
                console.log('ignore')
            } else {
                folders.push(element)
            }
            console.log('fol:', isAuthenticated, username, usertype)
        }
        return
      }
    })
    return [folders]
  }
  // isAuthenticated: ()  => {
  //     return getters.getState({ object: "gZml" }).login.isAuthenticated
  // },
}
