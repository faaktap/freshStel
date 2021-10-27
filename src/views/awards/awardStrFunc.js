function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


export const awardStrFunc = {
    splitALine(aLine) {
        let subjects = aLine.split(',')
        let retArr = []
        subjects.forEach(e => {
          console.log(e);
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
    convertTextToArray(stringList) {
        let miniList = []
        // Look for any semicolons...
        let awards  = stringList.split(';') 
        let cnt = randomIntFromInterval(10,99)
        awards.forEach(e => {
          let twoParts  = e.split(':')  // split diploma and subjects
          if (twoParts.length != 2) {
           alert('We have more than : between ; - error on : ' + stringList)
          }
          miniList.push( {awardid:cnt, dip:twoParts[0],sub:'' } )  // add diploma
          let arr = awardStrFunc.splitALine(twoParts[1])  //breakup subjects
          arr.forEach(e => {
            cnt++ 
            miniList.push( {awardid:cnt, dip:'', sub:e })   //add subjects
          })
        })
        return miniList
      },
}
