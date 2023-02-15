<?php

//Examples:
//https://kuiliesonline.co.za/api/thumb/?name=_Subjects_GR08_EBW_MOSES_cash receipts journal.mp4  (will add jpg or png if not found)
//https://kuiliesonline.co.za/api/thumb/?name=hello world.png  (if png not found will pass jpg if found)
//https://kuiliesonline.co.za/api/thumb/?name=hello world.jpg  (will only show if we have a jpg)

//If we add the ignore, we are forcing the creation of a ffmpeg thumbnail called _Susject_GR08_Mathe.....mp4.jpg
//https://kuiliesonline.co.za/api/thumb/index.php?name=ignore.mp4&origin=/Subjects/GR08/Mathematics_Wiskunde/Afrikaans/Gr 8 Verhoudings Vb.19-20 bl.15 b.mp4

//If these where slashes, it will be converted to _
//https://kuiliesonline.co.za/api/thumb/index.php?name=_Subjects_GR08_Physical%20Sciences_Fisiese%20Wetenskappe_Edna%20Smit_George%20Pemba-1.mp4
//https://kuiliesonline.co.za/api/thumb/index.php?name=/Subjects/GR08/Physical Sciences_Fisiese Wetenskappe/Edna Smit/George Pemba-1.mp4

//If our cache is not in picture or video, we can specify it as folder=avatar - see below
//https://kuiliesonline.co.za/api/thumb/index.php?name=HeadQuestionOutline.png&folder=avatar


//Check for CORS complaince - every time - not only in options 
$allow = '*'; 
if (isset($_SERVER['HTTP_ORIGIN'])) {
   $goodones = ['102.132.39.135' ,'http://192.168.1.111:8080' ,'http://127.0.0.1' ,'http://localhost' ,'https://kuiliesonline.co.za' ,'https://vschool.kuiliesonline.co.za' ];
   if (in_array($_SERVER['HTTP_ORIGIN'], $goodones)) { 
     $allow = '*'; 
    } else { 
     $file = date("Y-m"); 
     $time = date("Y-m-d h:i:sa"); 
     $allow = 'https://poepies.co.za'; 
     file_put_contents("cors-prevent.$file.htm", $_SERVER['HTTP_ORIGIN'] . " - $time\n" ,FILE_APPEND | LOCK_EX); 
    } 
} 
header('Access-Control-Allow-Origin: '. $allow); // Access-Control headers are received during OPTIONS requests 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { 
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) 
       header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) 
       header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}"); 
    exit; 
    
} 

$debug = false;
//TEST FOR INCOMING VARIABLE-----------------------------------------------//
  $filename = array_key_exists('name',$_GET) ? $_GET['name'] : '';
  $originalVideoFile = array_key_exists('origin',$_GET) ? $_GET['origin'] : '';
  
  //forder will be used to say in what folder of cache we much check, default is picture for pic and video for mp4 but we also have avatar
  $folder = array_key_exists('folder',$_GET) ? $_GET['folder'] : '';
  if (!$filename) { die ('parameters wrong'); }
  $ext = strtolower(substr(strrchr($filename,"."),1));
  $weCall = '';
  if ($debug) echo "ext =  $ext, filename = $filename" ;
  switch( $ext ) {
    case "gif" :
    case "png" :
    case "jpeg" :
    case "jpg" :
    case "svg" : $weCall = 'picture' ; break;
    case "mkv" :
    case "mpg" :
    case "avi" :
    case "mp4": $weCall = 'video'; break;
    case "pdf": $weCall = 'pdf'; break;
    default:
  }  
  if ($weCall == '') { 
      if ($debug) echo "<br>we do not undestand extension : $ext";
      die('we not understand parameter '); 
  }
  if ($weCall == 'pdf') {
      include('pdfThumb.php');
      $answer = pdfThumb($filename);
      if ($answer) sendPhoto($answer, 'filenotfound');
      die('no more to do'); //pdfThumb handle it's own stuff
  }
  
  define('CACHE_FOLDER', '/home/kuilieso/cache/');
  
  include('vidThumb.php');

  if ($folder != '') {
     $cache = CACHE_FOLDER . $folder . '/';
  } else {
    if ($weCall == 'video')   { 
      $cache = CACHE_FOLDER . 'video/';
    }
    if ($weCall == 'picture') { 
      $cache = CACHE_FOLDER . 'picture/';
    }
  }
  
  $filename = str_replace('/','_',$filename);
  
  $cacheFile = $cache . $filename;
  
  if (file_exists($cacheFile)) {
      if ($debug) echo "<br>FOUND in cache : $cacheFile";
      sendPhoto($cacheFile, $filename);
  } else {
      checkOtherFilesAndPlaces($ext,$cacheFile,$filename,$weCall,$debug,$originalVideoFile);
  }
  die('end of process');
  
//TEST FOR INCOMING VARIABLE END-------------------------------------------//  




function checkOtherFilesAndPlaces($ext,$cacheFile,$filename,$weCall,$debug,$originalVideoFile) {      
      if ($ext !== 'jpg') {
          //check if we don't have a jpg for this file
          
          //First remove extension, and add jpg
          if (file_exists(substr($cacheFile, 0, strrpos($cacheFile, ".")). '.jpg')) {
              sendPhoto(substr($cacheFile, 0, strrpos($cacheFile, ".")). '.jpg', $filename);
              die('good');
          } 
          //2nd keep extension, and add jpg
          if (file_exists($cacheFile . '.jpg')) {
              sendPhoto($cacheFile . '.jpg', $filename);
              die('good');
          } 
          //3rd keep extension, and add png
          if (file_exists($cacheFile . '.png')) {
              sendPhoto($cacheFile . '.png', $filename);
              die('good');
          } 
          if ($weCall == 'video') {
              //Now we have tried all options, and did not find a picture
              //So we create one for next use..
              //however, we need to fix the filename!!
              //We can pass it as a seperate name from caller? 
              // or we can try to work it out from the name given.
              if ($originalVideoFile != '') {
                 $answer = ffmpeg($originalVideoFile);
                 if ($debug) echo "<br>started ffmpeg process on  : $filename, $originalVideoFile, $answer";
                 die('try again later');
              } else {
              if ($debug) echo "<br>origin not passed   : cannot laucn ffmp<br>";
              die('origin not passed');
              }
          } else {
              if ($debug) echo "<br>wecall not video  : It is $weCall<br>";
              die('wecall is not video');
          }

      } else {
          die('extension is jpg, we search no more');
      }
}

function sendPhoto($file, $name) {
header('Expires: Sat, 13 Nov 2021 05:00:00 GMT' ); 
header('Last-Modified: ' . gmdate( 'D, d M Y H:i:s',time()+60*60*8 ) . ' GMT' ); 
header('Cache-Control: no-store, no-cache, must-revalidate' ); 
header('Cache-Control: post-check=0, pre-check=0', false ); 
header('Pragma: no-cache' );

  $filename = basename($file);
  $file_extension = strtolower(substr(strrchr($filename,"."),1));
  $ctype = 'application/octet-stream';
  switch( $file_extension ) {
    case "gif": $ctype="image/gif";     break;
    case "png": $ctype="image/png";     break;
    case "jpeg":
    case "jpg": $ctype="image/jpeg";    break;
    case "svg": $ctype="image/svg+xml"; break;
    case "mp4": $ctype="video/mp4"; break;
    default:
  }
  debug("SENDPHOTO : $filename $file $name $file_extension $ctype <br>\n" );        
  $fp = fopen($file, 'rb');
  //header("Content-Disposition: attachment; filename=$file"); //add this if you want to pop save as download in browser...  
  //header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($file)).' GMT', true, 200); - this will check of browser has it in cache - carefull with same names!
  header("Content-Length: " . filesize($file));  
  //https://www.geeksforgeeks.org/http-headers-content-type/
  header("Content-Type: $ctype");
  header("Content-Location: $name");
  fpassthru($fp);    
  exit();

}
  

function debug($text) {
    file_put_contents('debug.txt.htm',  $text ,FILE_APPEND | LOCK_EX);
}
?>