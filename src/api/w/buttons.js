import jButtons from './buttons.json'
export const buttons = jButtons

export function doStuff(tr,task) {
    switch (task) {
        case "/":
            return zmlReRoute(tr, task)
        case "/about":
            return zmlReRoute(tr, task)
        case "/viewlearn":   //teacher start
            return zmlReRoute(tr, "/folderedit")
        case "/profile":
            return zmlReRoute(tr, '/login')
        case "/selectgrade":
            return zmlReRoute(tr, task + "/Grade")
        case "/hover":
        case "/reports":
        case "/login":
        case "/att":
        case "/admin":
        case "/emailcheck":
        case "/choosesubjects":
        case "/drive":    //student start
        case "/folderedit":    //student start
        case "/folder":    //student start
        case "/latest":    //newest files
        case "/latest/7":
        case "/dkhsawards":
        case "/student":
        case "/personel":
        case "/elections":
        case "/userlist":
        case "/studentlist":
        case "/subjects":
        case "/photos":
        case "/photohelp":
		case "/eksamendruk":
        case "/emailssent/6582":
        case "/newsletters/d":
        case "/merit":
        case "/meritstart":
        case "/meritedit":
        case "/attload":
        case "/attendance":
        case "/bookreturn":
        case "/attview":
<<<<<<< HEAD:src/api/w/buttons.js
=======
        case "/vglist":
        case "/home":
        case "/quanda":
        case "/addphoto":
        case "/calteach":
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8:src/api/buttons.js
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