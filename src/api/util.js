
export function  leftPad(num, size)  {   //leftpad, lpad, add zeroes to back of number
    let s = num + ""
    while (s.length < size) s = "0" + s
    return s
}

export function cl(...args) {
    console.info(...args);
}


export const util = {
    cl: function (...args) {
       console.info(...args);
    },
    randomColor: function() {
       return Math.floor(Math.random()*16777215).toString(16)
    },
    getNum: function (str) {
        if (str.length > 0) {
            let matches = str.match(/(\d+)/);
            if (matches.length) {
              //Just pass the first number we found..
                return  parseInt(matches[0] , 10)  //remove leading zero if there is one..
            }
        }
        return 0
    },
    hasDuplicates: function (array) {
        //how to check if every value is unique javascript array
        //We can also send a unique set back with [...new Set(array)]
        return (new Set(array)).size !== array.length;
    },
    zDate: function(p) {
        return zDateFunction(p)
    },
    // This is a good example of returning an object
    sessionSplit: function(sessionid)  {
        let minusSign = sessionid.lastIndexOf("-")
        let firstPart = sessionid.substr(0,minusSign)
        let lastPart = sessionid.substr(minusSign+1)
        let detail = firstPart.split(".")
        return { roomName: detail[0], day: detail[1], period: detail[2], genlistname: detail[3], id:lastPart }
     },
     findInObject: function(myArray, searchValue) {
        // quick way to grep for a value in list of objects.
       const x = myArray.filter(
        str => Object.values(str).join().toUpperCase().includes( searchValue.toUpperCase() )
      )
      return x
    },
    findMultipleSearch: function(myArray, searchValue) {
        // split search value when we see a || - a js OR used as an AND
        // Then join the object 1 by 1 into a big string
        // Then use include to see if we find that word(s) in our big string
        // trickey to return from a function to another function with a true or false.
        // we need to add return if we wrap function in {}
        let searchArray = searchValue.split('||')
        let found = false
        const x = myArray.filter(str => {
            found = false
            searchArray.forEach(element => {
                if ( Object.values(str).join().toUpperCase().includes( element.trim().toUpperCase()) ) {
                    found=true
                } else {
                    found=false
                }
                return found
            })
            return found
        })
       return x
     },
     uniqueColor(ord) {
        switch (ord) {
            case 0: return "green lighten-1"
            case 1: return "blue lighten-2"
            case 2: return "gold lighten-3"
            case 3: return "red lighten-2"
            case 4: return "gold"
            case 5: return "amber lighten-1"
            case 6: return "pink"
            case 7: return "deep-purple"
            case 8: return "brown lighten-1"
            case 9: return "blue-grey lighten-4"
            default : return 'gray lighten-4'
        }
      },
      createHeader(row) {
        if (row && typeof(row) != 'object') {
            console.log('util.createHeader',row,'is not an object')
            return []
        }
        let tHeader = []
        Object.keys(row).forEach(name => {
            tHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1)
                 , value: name} )
       })
       return tHeader
      }


}

//Handle date and time in java without a library
//hide this extra function, until we put it in it's own file
//https://thenextweb.com/news/how-to-manipulate-date-and-time-in-javascript
// let today = Date.now()
// let today = new Date()
// let someDate = new Date(2021,1,30)
// let someDate = new Date(2021,1,30,23,31,59)
// computer locale
// let likeComputer = Intl.DateTimeFormat().format(new Date())
// let td = today.toString()      //Sat Feb 10 2021 14:56..GMT...
// let td = today.toDateString()  //Sat Feb 10 2021
// let td = today.toLocaleTimeString() //2:56:11 PM

const zDateFunction = ( parm ) => {
    let dt = Date.now()
    if (parm  !== undefined) {
       let [yyyy, mm, dd] = parm
       util.cl('this is some fancy extra function ' , yyyy,mm,dd)
       dt = new Date(yyyy, mm, dd)
       util.cl(dt)
       return dt
    }
    util.cl('this is the end extra function ' , dt)
    util.cl(dt)
    return dt

}



