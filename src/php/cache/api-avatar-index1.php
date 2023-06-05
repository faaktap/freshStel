<?php

  /*
  Call with https://kuiliesonline.co.za/api/avatar/?size=400&value=WernerSmitDie%20GroterEne
  LOG_FILE  :  SendPhoto.log.htm
  CACHE_FOLDER  :  /home/kuilieso/cache/avatar/

  */
  
  
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
header('Expires: Sat, 13 Nov 2021 05:00:00 GMT' ); 
header('Last-Modified: ' . gmdate( 'D, d M Y H:i:s',time()+60*60*8 ) . ' GMT' ); 
header('Cache-Control: no-store, no-cache, must-revalidate' ); 
header('Cache-Control: post-check=0, pre-check=0', false ); 
header('Pragma: no-cache' );


// See : https://jdenticon.com/php-api/M_Identicon_getImageDataUri.html
// Sample : https://kuiliesonline.co.za/avatar/index.php?size=200&value=WernerSmit
// or : https://kuiliesonline.co.za/api/avatar/?size=200&value=WernerSmit

// or called from another php file...


my_autoload ('Jdenticon/Identicon');
my_autoload ('Jdenticon/IdenticonStyle');
my_autoload ('Jdenticon/Rendering/Rectangle');
my_autoload ('Jdenticon/Rendering/RendererInterface');
my_autoload ('Jdenticon/Rendering/IconGenerator');
my_autoload ('Jdenticon/Rendering/AbstractRenderer');
my_autoload ('Jdenticon/Rendering/InternalPngRenderer');
my_autoload ('Jdenticon/Rendering/ImagickRenderer');
my_autoload ('Jdenticon/Rendering/SvgRenderer');
my_autoload ('Jdenticon/Rendering/Transform');
my_autoload ('Jdenticon/Rendering/ColorTheme');
my_autoload ('Jdenticon/Shapes/ShapeCategory');
my_autoload ('Jdenticon/Shapes/ShapeDefinitions');
my_autoload ('Jdenticon/Color');
my_autoload ('Jdenticon/Canvas/Canvas');
my_autoload ('Jdenticon/Canvas/Rasterization/EdgeTable');
my_autoload ('Jdenticon/Canvas/CanvasContext');
my_autoload ('Jdenticon/Canvas/Matrix');
my_autoload ('Jdenticon/Shapes/Shape');
my_autoload ('Jdenticon/Rendering/Point');
my_autoload ('Jdenticon/Canvas/Point');
my_autoload ('Jdenticon/Canvas/ColorUtils');
my_autoload ('Jdenticon/Canvas/Rasterization/Edge');
my_autoload ('Jdenticon/Canvas/Rasterization/EdgeIntersection');
my_autoload ('Jdenticon/Canvas/Rasterization/Rasterizer');
my_autoload ('Jdenticon/Rendering/TriangleDirection');
my_autoload ('Jdenticon/Canvas/Rasterization/SuperSampleBuffer');
my_autoload ('Jdenticon/Canvas/Rasterization/LayerManager');
my_autoload ('Jdenticon/Canvas/Rasterization/SuperSampleRange');
my_autoload ('Jdenticon/Canvas/Rasterization/Layer');
my_autoload ('Jdenticon/Canvas/Rasterization/EdgeSuperSampleIntersection');
my_autoload ('Jdenticon/Canvas/Png/PngPalette');
my_autoload ('Jdenticon/Canvas/Png/PngEncoder');
my_autoload ('Jdenticon/Canvas/Png/PngBuffer');


    function my_autoload ($pClassName) {
        include(__DIR__ . "/" . $pClassName . ".php");
    }
    spl_autoload_register("my_autoload");

// ZML:If you do not use composer, it is tricky to decide where to place class file
// the 1st one will load fine, but everything afterwards is a trick
// Set max-age to a week to benefit from client caching (this is optional)




define('LOG_FILE', 'SendPhoto.log.htm');
define('CACHE_FOLDER', '/home/kuilieso/cache/avatar/');


debug("Start  <br>\n");

// This function is called from other php module, above stuff is when called from web
function makeOneFromPhp($value, $size) {
  debug("makeOneFromPhp $value $size  <br>\n" );
  $size = min(max(intval($size), 20), 500);
  $icon = new \Jdenticon\Identicon(array(
    'value' => $value,
    'size' => $size
  ));
  $val =  $icon->getImageDataUri('png');
  return ( $val );
  die();
}
  

// This function is called if we have GET values. (called from browser)
// We build the avatar, and then we save it.
// If it exist, we do no build it again.

// if (array_key_exists('value',$_GET)) {
  $value = array_key_exists('value',$_GET) ? $_GET['value'] : '';
  $size = array_key_exists('size',$_GET) ? $_GET['size'] : '200';
  $size = min(max(intval($size), 20), 500);
  $nodisplay = array_key_exists('display',$_GET) ? $_GET['display'] : '';
  debug("GET PROCESS $value $size $nodisplay  <br>\n" );
  // Parse query string parameters
  // $value = $_GET['value'];
  // $size = min(max(intval($_GET['size']), 20), 500);

  if ($value == '' || $value == 'missing') { 
      
     debug("MISSING $value $size $nodisplay  <br>\n" );
     
     $missing = CACHE_FOLDER . 'HeadQuestionOutline.png';
     sendPhoto($missing,$value);
     die(); 
  }

  if ($value && $size) {
      
   $file = CACHE_FOLDER .  $value . '.png';
   
   debug("BEFORE CHECK EXIST : $file  <br>\n" );
   
   if (file_exists($file)) {
     debug("IT DOES CHECK EXIST : $file  <br>\n" );      
     sendPhoto($file, $value.'.png');
     die();
   }
   file_put_contents(LOG_FILE,  "RENDER ICON : $file  <br>\n" );      
   // Render icon
   $icon = new \Jdenticon\Identicon();
   $icon->setValue($value);
   $icon->setSize($size);
   
   // Save the file for next use
   $img =  $icon->getImageDataUri('png');
   list($type, $b64data) = explode(';', $img);
   list(, $b64data)      = explode(',', $b64data);
   $blobData = base64_decode($b64data);
   // Save the file for next use , when we come in with _GET, we have a % at end of string
   $value = str_replace('%','',$value);
   
   debug("SAVE RENDERED ICON : CACHE_FOLDER$value.png  <br>\n" );      
   file_put_contents($file, $blobData);
   
   if (!$nodisplay) {
      //Display it
      file_put_contents(LOG_FILE,  "DISPLAY ICON : $file  <br>\n" );      
      //header('Cache-Control: max-age=604800');
      $icon->displayImage('png');
   }
   die();
  } 
  /*
} else {
  file_put_contents(LOG_FILE,  "WE RECEIVED NO VALUE IN GET  <br>\n" );      
}
*/


function sendPhoto($file, $name) {
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
  header("Content-Type: $ctype");
  fpassthru($fp);    
  exit();

}
  
  
/* DOES NOT WORK = WANTS To DOWNLOAD in BROWSER */ 
function sendPhotoAsBase64Stream($filename, $name){
    debug("SENDPHOTO : $filename $name  <br>\n" );      
    if (!file_exists($filename)) {
        debug("SENDPHOTO FILE IS MISSING $filename  %name  <br>\n" );
        die('File does not exist');
    }
    
    // Read the image path and convert it to
    // base64
    $base64_encode = base64_encode(file_get_contents($filename));

    // Prepare the image for use in an img src tag
    $mime_type = mime_content_type($filename);
    $image_source = 'data: ' . $mime_type . ';base64,' . $base64_encode;

    debug("SENDPHOTO : $mime_type $size  <br>\n" );
    debug("SENDPHOTO : $image_source  <br>\n");      
    header("Content-Type: $mime_type");
    $size = strlen($image_source);
    header("Content-Length: $size");  
    header("Content-Disposition: Attachment; filename:'$name.png'");
    //fpassthru($fp);    
    echo $image_source;
}

function debug($text) {
    file_put_contents(LOG_FILE,  $text ,FILE_APPEND | LOCK_EX);
}
?>