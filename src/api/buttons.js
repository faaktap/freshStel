import jButtons from './buttons.json'
export const buttons = jButtons

export function doStuff(tr,task) {
    console.log('doStuff asked to do', task)
    switch (task) {
        case "/": 
            return zmlReRoute(tr, task)
        case "/about": 
            return zmlReRoute(tr, task)
        case "/viewlearn":   //teacher start
            return zmlReRoute(tr, task)
        case "/hover": 
            return zmlReRoute(tr, task)
        case "/translate": 
            return zmlReRoute(tr, task)
        case "/login": 
            return zmlReRoute(tr, task)
        case "/profile": 
            return zmlReRoute(tr, '/login')            
        case "/nested/dialog": 
            return zmlReRoute(tr, task)
        case "/selectgrade":    //student start
            return zmlReRoute(tr, task + "/Grade")
        case "/grade":    //new student start
            return zmlReRoute(tr, task)

        default:
             //silently go back..
             return 0
      }
}

function zmlReRoute(tr, task) {
    if (tr.currentRoute.path !== task) {
        return tr.push(task) 
     } else {
        return 1
     }
}