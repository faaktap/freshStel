<?php

include_once "static.php";
include_once "Base64.php";
require_once('database.php');
require_once('config.inc.php');
require_once('newStaticPDO.php');
error_reporting(E_ALL & ~E_WARNING);

  $JSON = json_decode(file_get_contents('php://input'), true);
  if (!$JSON) $JSON = tryGetVars();
  if (!$JSON) { echo "Could not process incoming vars!"; return;}
  processRequestForQuery($JSON);

function processRequestForQuery($JSON) {
  $task = array_key_exists('task',$JSON) ? $JSON['task'] : '';
  if (!$task) $task = array_key_exists('method',$JSON) ? $JSON['method'] : '';
  if(isset($task)) {
	switch (strtolower($task)) {
		case "upload":
           $info = saveData($JSON); 
           echo json_encode($info);
		   break;
         default:   
           echo json_encode(["error" => "we do not understand " . $task]);
		   break;
    }
  } else {
      echo json_encode(["error" => "we do not have a task"]);
  }
}
           

function saveData($data) {
    if (!array_key_exists('base64',$data)) { $info =  ['error' => 'We need base64 data to save!'];    return $info; }
    if (!array_key_exists('extrapath',$data)) { $info =  ['error' => 'We need a extrapath above!'];    return $info; }  // like /home/kuilieso/cache?
    if (!array_key_exists('realname',$data)) { $info =  ['error' => 'We need a real name!'];    return $info; }
    if (!array_key_exists('size',$data)) { $info =  ['error' => 'We need a size!'];    return $info; }
    //if (!array_key_exists('format',$data)) { $info =  ['error' => 'We need a format!'];    return $info; }
    
    if (!allowedFiles($data['realname'])) { $info =  ['error' => 'We need a super match'];    return $info; }
    
    $info = saveBase64Blob($data);
    return $info;
}

function allowedFiles($somefile) {
   file_put_contents('checking.txt', $somefile, FILE_APPEND | LOCK_EX);
   $supported_files = ['php',    'php3',    'js',    'zip',  'arj', 'jar'];

  $src_file_name = $somefile;
  $ext = strtolower(pathinfo($src_file_name, PATHINFO_EXTENSION)); // Using strtolower to overcome case sensitive
  file_put_contents('checking.txt', "\next" . $ext, FILE_APPEND | LOCK_EX);
  file_put_contents('checking.txt', "\inarray" . in_array($ext, $supported_files), FILE_APPEND | LOCK_EX);
  if (in_array($ext, $supported_files)) {
      file_put_contents('checking.txt', "\nbadnews" . $ext, FILE_APPEND | LOCK_EX);
      return false;
  } else {
      file_put_contents('checking.txt', "\ngoodnews" . $ext, FILE_APPEND | LOCK_EX);
      return true;
  }
}