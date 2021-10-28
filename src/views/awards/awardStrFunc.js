function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


export const awardStrFunc = {
    splitALine(aLine) {
 // console.log('aLine = ', aLine)
        let subjects = aLine.split(',')
        let retArr = []
        subjects.forEach(e => {
 // console.log('trimmy',e)
            e = e.trim()                      // remove extra spaces
               .replace(/(\r\n|\n|\r)/gm, "") // remove line endings
               .split(' ')                    // split on space (math literacy)
               .map(function(word) {
                    return word[0].toUpperCase() + word.substr(1).toLowerCase() // capitalize each word
                })
                .join(' ')                    // join the lot together with space in between
            retArr.push( e )   //push to to our array
         })
         return retArr
    },
    convertTextToArray(incomingStringList) {
        let stringList = incomingStringList
        let miniList = []
        //rip out the last semicolon
        if (stringList[stringList.length - 1] == ';') {
          stringList = stringList.substring(0, stringList.length - 1);
        }
        // Look for any semicolons...
        let awards  = stringList.split(';') 

        awards.forEach(e => {
          let twoParts  = e.split(':')  // split diploma and subjects
          if (twoParts.length == 0) {
            alert('this is not a minilist  - try another type...')
          }
          if (twoParts.length != 2) {
           alert('We have more than : between ; - error on : ' + stringList)
          }
          let cnt = randomIntFromInterval(100,999) 
          miniList.push( {awardid:cnt, dip:twoParts[0],sub:'' } )  // add diploma
          let arr = awardStrFunc.splitALine(twoParts[1])  //breakup subjects
          arr.forEach(e => {
            cnt += randomIntFromInterval(1000,9900) 
            miniList.push( {awardid:cnt, dip:'', sub:e })   //add subjects
          })
        })
        return miniList
      },
      imageDisplay(page) {
        //console.log('imageDisplay : ', page.type)
        let img = ''
        switch (page.type) {
            case '1':  {
                if (page.otherid > 0) {
                   img = 'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=a&studentno=' + page.otherid 
                } else {
                   img = "https://www.kuiliesonline.co.za/img/logo60edit.svg"
                }
                break
            }
            case '3':  {
              if (page.otherid > 0) {
                 img = 'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=a&studentno=' + page.otherid 
              } else {
                 img = "https://www.kuiliesonline.co.za/img/logo60edit.svg"
              }
              break
            }
            case '2': 
            case '4': 
            {
               if (page.otherid) {
                   img = 'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=a&studentno=' + page.otherid
               } else {
                   img = ""
               }
               break
            }
            case '5': img = "/img/trophyback6.jpg"  ; break
            default: img = "/img/trophyback5.jpg"  ; break
        }
        return img
     },
}
