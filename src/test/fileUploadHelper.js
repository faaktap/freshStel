
// eslint-disable-next-line
function makeAWait(milisecs,nextProc,parm1, parm2 ,parm3) {
let openWin = new Promise((resolve) => {
  let wagbietjie = setTimeout(() => {
    clearTimeout(wagbietjie);
    console.log('start resolve', openWin);
 
    resolve( nextProc(parm1,parm2, parm3 )) ;
  }, milisecs)
})
}


function addToQueue(receivedFiles,fileList) {
  console.log('resolve 1 was launched')
  let problemFiles = 0
  receivedFiles.forEach(file => {
    if (file.size > 1024*1024*1024)  {
      file.ignore = true
      problemFiles += 1
    } else {
      file.ignore = false
    }
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

    if (file.ignore == false) {
       fileList.push(file);
    }
  })
  return problemFiles
}

function uploadFiles(fileUploader,files,updateProgress) {
  console.log('2nd resolve....',files)
  files.forEach(file => {
   let fr = new FileReader()
   fr.onload = function(response) {
     //console.log('start upload(read is finished) for ' , file.name)
     //fileUploader(response,files,file)
     makeAWait(2000,fileUploader,response, file)
   };
   fr.onerror = function(response,file) {
     console.log('res - Some Error!' ,file,response);
     console.log(files)
   };
   fr.onprogress = updateProgress;
   fr.readAsDataURL(file);

  });
}


export {makeAWait, addToQueue, uploadFiles } 