const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
let timerHandle = null

function loadAllData(getData) {
       console.log('loadAllData')
       getData.forEach(ele => {
         let ts = {sql: ele.sql, task: 'PlainSql'}
         zmlFetch(ts, processAllData, loadError, ele);
       })
}

function processAllData(response,task,queue) {
       console.log('process data got called for ', task, queue.id)
       getData[queue.id].workDone = READY
       getData[queue.id].response = response
       if (!timerHandle) {
          startTimer( 100, rollCall)
       }
}
function rollCall() {  
       console.info('workdone at start of rolecall ',this.getData[0].workDone,this.getData[1].workDone,this.getData[2].workDone)
       if (getData[0].workDone == READY) {
          getData[0].workDone = BUSY
          getData[0].workDone = DONE
       }
       if (getData[1].workDone == READY) {
         if (getData[0].workDone == DONE) {
           getData[1].workDone = BUSY
           processData(getData[1].response, getData[1].id)
         }
       }
       if (getData[2].workDone == READY) {
         if (getData[1].workDone == DONE) {
          getData[2].workDone = BUSY
          processMoreData(getData[2].response,getData[2].id)
         }
       }
       if (getData[0].workDone == workArr[DONE] 
        && getData[1].workDone == workArr[DONE]  
        && getData[2].workDone == workArr[DONE] )  {
          getData[0].workDone = workArr[WAIT] 
          getData[1].workDone = workArr[WAIT] 
          getData[2].workDone = workArr[WAIT] 
          if (timerHandle) {
            clearInterval(timerHandle) 
            timerHandle = null
          }
        }
        return "some feedback " + timerHandle
}
function startTimer(duration, funcToCall) {
       let loops = 3
          this.timerHandle = setInterval(function () {
            //console.log('timer ropecall started')
            //display.textContent = minutes + ":" + seconds;
            let x = funcToCall('dummy')
            console.log('feedback after function -- from rollcall ' , x, loops)
            if (--loops < 0) {
              clearInterval(this.timerHandle)
            }
          }, duration);
}

