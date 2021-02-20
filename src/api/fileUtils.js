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
    {ext:'m4a'  ,icon: 'mdi-file-music',        color:'indigo darken-1'},
    {ext:'sql'  ,icon: 'mdi-database',          color:'green darken-3'},
    ]

  
 export const getIcon = ( fileName) => {
     const ext = fileName.split('.').pop().toLowerCase()
     const index = i.findIndex(p => p.ext == ext)
     if (index > 0 ) {
       return i[index].icon
     } else {
       return "mdi-hospital-building"
     }
 }  

 export const getFilenameNoExtension = ( fileName ) => {
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
 