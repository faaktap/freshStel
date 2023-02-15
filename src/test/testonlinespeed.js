function testSpeed(callback) {
    
  const startFetch = performance.now();
  fetch("https://kuiliesonline.co.za/speed/api.php")
    .then(response => {
       if (!response.ok) {
           callback('problem', response);
       }
       return response.json();
    })
    .then((response) => {
       // compute fetch duration
       const elapsedFetch = (performance.now() - startFetch).toFixed(2);
       // record result
       console.log(elapsedFetch);
       callback(elapsedFetch, response);
    })
    .catch((err) => {
       console.log(err);
       callback('offline', err);
    });
}

function showResult(speed,response) {
  if ('ra' in response) {
    concatID('werner',speed + ' ' + response.ra);
  } else {
    concatID('werner',speed + ' ' + response);
  }
  console.log(speed);
}

function concatID(id,str) {
  document.getElementById(id).innerHTML = 
     str + '<br>' + document.getElementById(id).innerHTML;
}