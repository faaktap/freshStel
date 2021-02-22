//import EventBus, { ACTIONS } from '@/api/event-bus';

const i= [
    {ext:'html' ,icon: 'mdi-language-html5',    color:'blue'},
    {ext:'htm'  ,icon: 'mdi-language-html5',    color:'blue'},
    {ext:'js:'   ,icon: 'mdi-nodejs',           color:'blue'},
    {ext:'json' ,icon: 'mdi-code-json',         color:'blue'},
    {ext:'md'   ,icon: 'mdi-language-markdown', color:'blue'},
    {ext:'pdf'  ,icon: 'mdi-file-pdf',          color:'red'},
    {ext:'txt'  ,icon: 'mdi-file-document',     color:'blue'},
    {ext:'xls'  ,icon: 'mdi-file-excel',        color:'green'},
    {ext:'xlsx' ,icon: 'mdi-file-excel',        color:'green'},
    {ext:'doc'  ,icon: 'mdi-file-document',     color:'blue'},
    {ext:'docx' ,icon: 'mdi-file-document',     color:'blue'},
    {ext:'mp4'  ,icon: 'mdi-movie',             color:'indigo lighten-1'},
    {ext:'mpeg' ,icon: 'mdi-movie',             color:'indigo lighten-1'},
    {ext:'mpg'  ,icon: 'mdi-movie',             color:'indigo lighten-1'},
    {ext:'jpg'  ,icon: 'mdi-image',             color:'purple'},
    {ext:'jpeg' ,icon: 'mdi-file-image',        color:'green'},
    {ext:'png'  ,icon: 'mdi-file-image',        color:'purple'},
    {ext:'ppt'  ,icon: 'mdi-file-powerpoint',   color:'black'},
    {ext:'pptx' ,icon: 'mdi-file-powerpoint',   color:'black'},
    {ext:'zip'  ,icon: 'mdi-folder-zip',        color:'brown'},
    {ext:'mp3'  ,icon: 'mdi-music-note',        color:'orange'},
    {ext:'wav'  ,icon: 'mdi-music-note',        color:'orange'},
    {ext:'m4a'  ,icon: 'mdi-file-music',        color:'indigo darken-1'},
    {ext:'sql'  ,icon: 'mdi-database',          color:'green darken-3'},
    {ext:'com'  ,icon: 'mdi-link-box',          color:'green darken-3'},
    ]

  
 export const getIcon = ( fileName) => {
   console.log('geticon', fileName)
     const ext = fileName.split('.').pop().toLowerCase()
     console.log('geticon', ext)  
     const index = i.findIndex(p => p.ext == ext)
      
     if (index > 0 ) {
       console.log('geticon', i[index].icon) 
       return i[index].icon
     } else {
      console.log('geticon', 'hospital') 
       return "mdi-hospital-building"
     }
 }  
 export const getFileType = ( iconName) => {
  console.log('getFT')
  switch (iconName) {
    case 'mdi-image': return 'picture'
    case 'mdi-movie': return 'video'
    case 'mdi-file-music' : return 'sound'
    default :  return 'unknown'
  }
}  

 export const getFilenameNoExtension = ( fileName ) => {
  console.log('getFilename')
  const pieces =   fileName.split('.') 
  const l = pieces.length - 2
  if (l >= 0) {
     return  pieces[l]
  } else {
    return ""
  }
 }

 export const getFilename = ( fileName ) => {
  const fnNoExt = getFilenameNoExtension(fileName)
  const  pieces =   fileName.split('/') 
  const l = pieces.length - 1
  if (l >= 0) {
     return  pieces[l]
  } else {
    return fnNoExt
  }
 }

 export default getIcon;
 