export const loadJson = {
    getData: function(ourFullPath, dataTable, initialize) {
        if (dataTable.length == 0) {
           // Fetch the data from mysql or json
           fetch(ourFullPath)
           .then(response => response.json())
           .then((data) => {
               data.forEach(e => {
                   //console.log(e)
                   dataTable.push(e)
               })
             //dataTable = data //this assignment does not seem to work - rather do push above...
             initialize()
            })
           .catch((e) => {
                console.log('error on fetr',e)
                alert('we have a problem with ' + ourFullPath)
            })
           .finally(console.log('explainData Fetched'))
        } else {
          // data already fetched, just use it
          initialize()
        }
    }
}
