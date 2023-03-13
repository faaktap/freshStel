export const ws = {
  name:"wsDocStruct",

  assignStruct: function (data) {
    ws.struct = data
    ws.breakDown()
    console.log(ws.struct)
    console.log(ws.struct[0])
  },

  struct: [{name:'poppie', type:'text', value:'start'},{name:'dinges', type:'number', value:100}],

  fldNames:[],

  breakDown() {
    // Add all the new properties for the row in an array
    // Makes it easier to check
     ws.fldNames = []
     ws.struct.forEach(sObj => {
       ws.fldNames.push(sObj.name)
     })
  },

  // Once new properties and values was added to the table, we need to extend the tableHeader
  // We call this after the table rows has been added.
  fixHeader: function (tableHeader) {
    if (ws.fldNames.length == 0) {console.log('no fldname');return}
    if (!tableHeader) {console.log('no theader');return}
    // We add all the fieldnames that is missing from the header to missing
    let missing = []
    ws.fldNames.forEach(fldName => {
      let tabIndex = tableHeader.findIndex(e => e.text == fldName)
      if (tabIndex == -1) {
        missing.push(fldName)
      }
    })
    // then we add them to tableHeader - should lookup the type here ie. number or text.
    if (missing.length) {
      missing.forEach(fldName => {
        tableHeader.push({ text: fldName, value:fldName, edit:true})
      })
    }
  },

  // We use the structure we started with, to add them in each tableRow
  // We get the value for the fields in the tableRow, in jdocstructure.
  // So the "top" structure could theoretically recide in first tablerow, or another place.
  addStructure: function (tableRow) {
    if (!ws.struct) alert('struct not defined yet')
    if (!ws.fldNames.length) return

    let rowData = {}
    if (tableRow.jdocstructure) {
      rowData = tableRow.jdocstructure
    }
    if (!(ws.fldNames[0] in tableRow)) {
      ws.fldNames.forEach( fldName => {
        tableRow[fldName] = ''
        // Now we need to add a value, if there is one.
        //rowData contain a array of structs like {name:fldname, value:100}
        let curr = rowData.find(e => e.name == fldName)
        if (curr) tableRow[fldName] = curr.value
      })
      }
    },
    localUpdate: function (h,s) {
      //change the jdocstructure to resemble new values
      h.forEach(e => {
       if ('edit' in e && e.edit == true) {
        let fixed = false
        s.jdocstructure.forEach(j => {
            if (e.text == j.name) {
                 j.value = s[e.text]
                 fixed = true
            }
        })
        if (fixed == false) {
            let obj = {name: e.text, value: s[e.text] , type: 'text'}
            //this.$set(this.someObject, 'b', 2)
            //this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
            s.jdocstructure.push(obj)
        }
       }
      })
      console.log('end', s)

    }
}

// Step thru an object
  //  Object.entries(ws.struct).forEach(([key, value]) => {
  //    if (key == 'name') {
  //    }
  //    console.log('entryies = ', key,value)
  //   })
