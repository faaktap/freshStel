<?php

/*
$file = false;
if( isset( $_GET["f"] ) ){
    $file = htmlspecialchars($_GET["f"]);
}

if ($file == false) {
    //die('file is false');
    $file = 'Subjects/GR12/LO/dbe-2020-covid-19-booklet.pdf';
}
pdfThumb($file);
*/

//Example
//https://kuiliesonline.co.za/api/thumb/?name=Subdddddddddddddd0Unit%205.pdf
function pdfThumb($file) {
  $debug = true;
  $statsFile = 'pdfStats.htm';
  $file = str_replace("https://kuiliesonline.co.za/", "/", $file);
  $file = str_replace("https://www.kuiliesonline.co.za/", "/", $file);
  $cachefile = str_replace("/", "_", $file);   
  $cache = $_SERVER['DOCUMENT_ROOT'].'/cache/';
  $ext = "jpg";//just the extension    
  $dest = $cache.$cachefile.'.'.$ext;    
  if ($debug) file_put_contents($statsFile, "<br><hr>PDF File to search for is: $dest", FILE_APPEND);
  if (file_exists($dest)) {
    // cache file has been build, we just pass it back
    if ($debug) file_put_contents($statsFile, "<br>file was found: $dest", FILE_APPEND);
    return($dest);
    
    //$img = new Imagick();
    //$img->readImage($dest);
    
 } else {    
    // file does not exist, we need to create it, save it and then pass it along
    if ($debug) file_put_contents($statsFile,  "<br>file was NOT found - trying to build it: put $file into $dest", FILE_APPEND);
    
    $pdfFile = $_SERVER['DOCUMENT_ROOT'] . '/' . $file;
    if (!file_exists($pdfFile)) {
       if ($debug) file_put_contents($statsFile,  "<br>file-exists return false!", FILE_APPEND);
       return('/home/kuilieso/public_html/cache/PDFFileNotFound.jpg');
    }
    $img = new Imagick($pdfFile);
    $img->setImageFormat($ext);    
    $width = $img->getImageheight();
    //$img->cropImage($width, $width, 0, 0);
    $img->scaleImage(320, 240, true);
    $img->writeImage($dest);    
    $size = filesize($dest);
    if ($debug) file_put_contents($statsFile,  "<br>file Size:  $size for $dest", FILE_APPEND);
    return($dest);
  }
  //header('Content-Length: '.filesize($dest));
  //header( "Content-Type: image/jpg" );
  //echo $img;
  //exit();
    
}
?>