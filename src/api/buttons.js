import jButtons from './buttons.json'
export const buttons = jButtons

export function doStuff(tr,task) {
    switch (task) {
        case "/": 
            return zmlReRoute(tr, task)
        case "/about": 
            return zmlReRoute(tr, task)
        case "/viewlearn":   //teacher start
            //return zmlReRoute(tr, task)
            return zmlReRoute(tr, "/sh")
        case "/hover": 
            return zmlReRoute(tr, task)
        case "/translate": 
            return zmlReRoute(tr, task)
        case "/login": 
            return zmlReRoute(tr, task)
        case "/emailcheck": 
            return zmlReRoute(tr, task)
        case "/choosesubjects": 
            return zmlReRoute(tr, task)           
        case "/profile": 
            return zmlReRoute(tr, '/login')            
        case "/nested/dialog": 
            return zmlReRoute(tr, task)
        case "/selectgrade": 
            return zmlReRoute(tr, task + "/Grade")
            
        case "/sh":    //student start 
            return zmlReRoute(tr, "/sh")
        case "/latest":    //newest files
            return zmlReRoute(tr, "/latest")
        case "/latest/7":    //newest files
            return zmlReRoute(tr, "/latest/7")

        case "/grade":    //new student start
        case "/student": 
        case "/personel": 
        case "/elections": 
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