// eslint-disable-next-line

export function uploadFiles(fileUploader,files,updateProgress) {
  files.forEach(file => {
    console.log(file);
    if (file.ignore == false) {
       let fr = new FileReader()
       fr.onload = function(response) {
         makeAWait(2000,fileUploader,response, file)
       };
       fr.onerror = function(response,file) {
         console.log('res - Some Error!' ,file,response);
       };
       fr.onprogress = updateProgress;
       fr.readAsDataURL(file);
    }
  });
}


export function makeAWait (milisecs,nextProc,parm1, parm2 ,parm3) {
 let openWin = new Promise((resolve) => {
   let wagbietjie = setTimeout(() => {
     console.log('makewait timeout',openWin)
     clearTimeout(wagbietjie)
     resolve( nextProc(parm1,parm2, parm3 ))
     if (parm3 ) {
        console.log('Parm3 after tm',parm3)
        parm3=false
     }
   }, milisecs)
 })
 console.log('makewait',openWin)
}


export function addToQueue (receivedFilesReal,fileList) {
  console.log('recfilesinaddtoq',receivedFiles)
  const receivedFiles = [...receivedFilesReal]
  if (receivedFiles.length == 0) {
      return 100
  }
  let problemFiles = 0
  receivedFiles.forEach(file => {
    file.ignore = false
    //check if in list already
    fileList.forEach(already => {
      if (file.name == already.name)  {
        problemFiles += 1
        file.ignore = true
      }
    })
    file.done = false

    if (!file.type && file.size%4096 == 0) {
      // The file is a folder
      file.ignore = true
    }
    console.log('file.name',file.name)
    if (file.ignore == false) {
      file.ext = ''
      file.ext = file.name.split('.').pop().toLowerCase()
      file.realname = file.name
      fileList.push(file);
    }
  })
  console.log('ProblemFiles in Add2Q is : ' , problemFiles)
  return problemFiles
}



// export {makeAWait, addToQueue, uploadFiles }