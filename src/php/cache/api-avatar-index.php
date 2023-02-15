<?php

  /*
  Call with https://kuiliesonline.co.za/api/avatar/?size=400&value=WernerSmitDie%20GroterEne
  */
  
  
  $name = array_key_exists('name',$_GET) ? $_GET['name'].'%' : '';
  $name = trim($name);
  $name = str_replace('%','',$name);  
  // Check if file exist
  
  sendPhoto('/home/kuilieso/cache/avatar/' . $name . '.png');
  
  
  
function sendPhoto($filename, $name){
    $ctype="image/png";
    $fp = fopen($filename, 'rb');
    $size = filesize($filename);

    header("Content-Length: $size");  
    header("Content-Type: $ctype");
    header("Content-Disposition: Attachment;filename:$name.png");
    fpassthru($fp);    
}
  
?>
  