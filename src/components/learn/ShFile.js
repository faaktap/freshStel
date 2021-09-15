import { infoSnackbar } from '@/api/GlobalActions';
import { look } from "@/api/Lookups.js"
//import { getters } from "@/api/store";

export const shFile = {
    tester: (item) => {
        infoSnackbar('We saved your data, will email it as well ' + item.name)
        return "piepie"
    },
    actionlink: (item,type)  => {
        if (type == 'link') {
            return item.name
        } else {
            return item.img
        }
    },
    getIconColor: ( iconName) => {
        if (!iconName) return "green darken-3"
        const index = i.findIndex(p => p.icon == iconName)
        if (index > 0 ) {
          return i[index].color
        } else {
          return "green darken-3"
        }
    },
    icn: (days) => {
     //show color based on amount of days
     if (days < 8)  return "blue--text darken-"
     if (days < 30)  return "green--text"
     if (days < 150)  return "purple--text"
     return "indigo--text"
    },
    persMenemonic: (id) => {
        return look.persMenemonic(id)
    },
    doAttachment(item) {
        if (!look.isAuthenticated) {
            infoSnackbar('You need to login to access the material!');
            return {src:''}
        }
        let attachmentName = this.actionLink(item)
        console.log(attachmentName)
        let fileType = this.getFileType(item.icon)
        console.log(fileType)
        return {src:attachmentName, type:fileType}


    },
    actionLink: (item) => {
        if (item.type == 'link') {
            return item.name
        } else {
            return item.img
        }
    },  
    getFileType: (iconName) => {
        switch (iconName) {
          case 'mdi-image': return 'picture'
          case 'mdi-movie': return 'video'
          case 'mdi-file-music' : return 'sound'
          case 'mdi-file-pdf' : return 'pdf'
          case 'mdi-file-pdf-box' : return 'pdf'
          default :  return 'file'
        }
    },  
    lookupName: () => {
    }    
}

const i= [
    {ext:'html' ,icon: 'mdi-language-html5',    color:'blue'},
    {ext:'htm'  ,icon: 'mdi-language-html5',    color:'blue'},
    {ext:'js:'  ,icon: 'mdi-nodejs',            color:'blue'},
    {ext:'json' ,icon: 'mdi-code-json',         color:'blue'},
    {ext:'md'   ,icon: 'mdi-language-markdown', color:'blue'},
    {ext:'pdf'  ,icon: 'mdi-file-pdf-box',      color:'red darken-1'},
    {ext:'pdf'  ,icon: 'mdi-file-pdf',          color:'red darken-1'},
    {ext:'txt'  ,icon: 'mdi-file-document',     color:'blue'},
    {ext:'xls'  ,icon: 'mdi-file-excel',        color:'green'},
    {ext:'xlsx' ,icon: 'mdi-file-excel',        color:'green'},
    {ext:'doc'  ,icon: 'mdi-file-document',     color:'blue'},
    {ext:'docx' ,icon: 'mdi-file-document',     color:'blue'},
    {ext:'mp4'  ,icon: 'mdi-movie',             color:'indigo lighten-1'},
    {ext:'mpeg' ,icon: 'mdi-movie',             color:'indigo lighten-1'},
    {ext:'mpg'  ,icon: 'mdi-movie',             color:'indigo lighten-2'},
    {ext:'jpg'  ,icon: 'mdi-image',             color:'purple'},
    {ext:'jpeg' ,icon: 'mdi-file-image',        color:'green'},
    {ext:'png'  ,icon: 'mdi-file-image',        color:'purple'},
    {ext:'ppt'  ,icon: 'mdi-file-powerpoint',   color:'orange darken-2'},
    {ext:'pptx' ,icon: 'mdi-file-powerpoint',   color:'orange darken-2'},
    {ext:'zip'  ,icon: 'mdi-folder-zip',        color:'brown'},
    {ext:'mp3'  ,icon: 'mdi-music-note',        color:'orange'},
    {ext:'wav'  ,icon: 'mdi-music-note',        color:'orange'},
    {ext:'m4a'  ,icon: 'mdi-file-music',        color:'indigo darken-1'},
    {ext:'sql'  ,icon: 'mdi-database',          color:'green darken-3'},
    {ext:'com'  ,icon: 'mdi-link-box',          color:'green darken-3'},
    ]
