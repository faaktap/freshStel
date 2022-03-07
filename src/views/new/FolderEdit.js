import { extNames, fileTypes } from '@/api/extensions.js'
import { folFilter } from '@/views/new/folderFilter.js';

export const feh = {
  someGlobals: 'this is lookup',
  // getZml : getters.getState({ object: "gZml" }),
  fixSlash: (path) => {
    const examinePath = path
      .replace(/\/+/g, '/') // replace consecutive slashes with a single slash
      .replace(/\/+$/, '') // remove trailing slashes
    return examinePath + '/'
  },
  getExtensionInfo: (fileExt) => {
    let fileType = ''
    const keys = Object.keys(extNames)
    // console.log('TTTTT1:fileExt = ', fileExt)
    keys.forEach((key) => {
      const k2 = Object.keys(extNames[key])
      // k2 is video and x is array of extensions
      const ext = extNames[key][k2]
      if (ext.includes(fileExt.toLowerCase())) {
        fileType = k2
        return true
      }
    })
    // console.log(`TTT2:we found ${fileExt} , and it is a ${fileType}`)
    // for some reason filetype is a array of length 1 since i moved it to js file - weird!
    return feh.getExtensionType(fileType[0])
  },
  getExtensionType: (fileType) => {
    // console.log('TTTTT3:fileType = ', fileType)
    // eslint-disable-next-line
    const obj = fileTypes.find(e => e.type === fileType)
    // console.log('TTTTT4:fileType = ', obj)
    if (obj) {
      return [obj.icon, obj.color]
    } else {
      return ['mdi-bomb-off', 'error']
    }
  },
  allowInDir(element) {
    return folFilter.allowInDir(element)

  },
  // This is to read a flat single directory.
  processReadDirectoryResult (result) {
    const files = []
    const folders = []
    result.forEach((element) => {
      // add a new element property?
      element.selected = false

      if (element.dir) {
        if (!feh.allowInDir(element)) return
        // console.log('allowed : ', element.filename);
        [element.icon, element.color] = feh.getExtensionInfo('folder') // extension is always "folder"
        if (element.filename[0] !== '.' && element.filename[0] !== '.') {
          folders.push(element)
          // We add the folders into our file list, but hide them if we are not moving...
          files.push(element)
        }
        return
      }
      if (element.filename[0] !== '.') {
        [element.icon, element.color] = feh.getExtensionInfo(element.ext)
        files.push(element)
      } else {
        console.log('skipped : ', element.filename)
      }
      // console.log('element=', element)
      if (element.ext == 'link') {
         console.log(element)
         alert('we found one - should do internal processing for link')
      }
    })
    return [files, folders]
  }
  // isAuthenticated: ()  => {
  //     return getters.getState({ object: "gZml" }).login.isAuthenticated
  // },
}
