import jButtons from './buttons.json'
export const buttons = jButtons

export function doStuff(tr,task) {
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
        case "/emailcheck": 
            return zmlReRoute(tr, task)
           
        case "/profile": 
            return zmlReRoute(tr, '/login')            
        case "/nested/dialog": 
            return zmlReRoute(tr, task)
        case "/selectgrade": 
            return zmlReRoute(tr, task + "/Grade")
            
        case "/sh":    //student start 
            return zmlReRoute(tr, task + "/sh")

        case "/grade":    //new student start
        case "/student": 
        case "/personel": 
        case "/campaigns": 
        case "/userlist": 
        case "/studentlist": 
        case "/subjects":         
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