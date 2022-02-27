import { getters } from "@/api/store";

export const folFilter = {
  someGlobals: 'this is lookup for filter',
  allowInDir(element) {
    const dir = element.filename
    const isAuthenticated = getters.getState({ object: "gZml" }).login.isAuthenticated;
    const username = getters.getState({ object: "gZml" }).login.username;
    const usertype = getters.getState({ object: "gZml" }).login.type;
    // const test = getters.getState({ object: "gZml" });
    // console.log('allow', usertype, username, isAuthenticated,dir, test)
    if (!isAuthenticated) return false
    if (dir.includes('..')) return false
    if (dir.indexOf('TEACHER') != -1) {
      // console.log('we found TEACHER', ['admin','teacher'].includes(usertype))
      if (['admin','teacher'].includes(usertype)) {
        // console.log('retrun true')
        return true
      } else {
        // console.log('retrun false')
        return false
      }
    }
    if (dir.indexOf('WERNER') != -1) {
       // console.log('we found WERNER')
       if (username == 'werner') {
         // console.log('return true')
         return true
       } else {
         // console.log('return false')
         return false
       }
    }
    return true
  }
}
