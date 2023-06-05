<?php
// Enable CORS (http://enable-cors.org/server_php.html)
header('Access-Control-Allow-Origin: *');
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
  exit;
}

function tryGetVars() {
	$req = $_SERVER['QUERY_STRING'];
	//http://localhost:81/api/base64/saveBase64Blob.php?format=txt&base64=SGFsbG8=&deliveryid=100&realName=hallo&ext=txt
	/* Werner, use this to quickly access a function via GET */
	if ($_SERVER['QUERY_STRING']) {
	        $pairs = explode("&",$_SERVER['QUERY_STRING']);
			//We have now a $pairs entry for each parameter
			$p = [];
			foreach ($pairs as $pair) {
				$namevalue = explode("=",$pair);
				//We now have a array with name and value, load it in $p
				$p[$namevalue[0]] = $namevalue[1];
			}
            return ($p);
    }
    return ('');
}
