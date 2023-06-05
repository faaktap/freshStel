<?php




//Test
//$vid = '/Subjects/GR08/Mathematics_Wiskunde/Klas videos/Gr 8 Magte en Wortels b2.mp4';
//echo ffmpeg($vid);


function ffmpeg($vid) {
$ffmpeg = '/home/kuilieso/bin/ffmpeg-git-20220910-i686-static/ffmpeg';
$cacheFolder = '/home/kuilieso/cache/video/';
$ext = ".jpg";
$timeInVideo = '00:00:29.000';
$stats = true;
$statsFile = 'vidThumbStats.htm';

  if ($stats) { 
    $today = date("F j, Y, g:i a");
    file_put_contents($statsFile,"<hr><b>$today</b> $vid \n<br>" , FILE_APPEND);  
    $time_start = microtime(true);
  }

  $saveName = str_replace("/","_",$vid) . $ext;
  if (file_exists("$cacheFolder$saveName")) {
      //If the file already exist, do we rewrite it?
      //The caller program might have a good reason for us to overwrite it,
      //So we ignore the fact that is does exist, but if you uncomment last line, we will not rebuild
      file_put_contents($statsFile,"<b>The cache file DOES exist!</b>$cacheFolder$saveName\n<br>" , FILE_APPEND);  
      // return "$cacheFolder$saveName";
  }
  
  if (substr($vid, 0, 4) == '/Sub') {
     $video = '/home/kuilieso/public_html/' . $vid;  
  } else {
     if (substr($vid, 0, 1) == '/') {
         $video = $vid;
     } else {
         file_put_contents($statsFile,"<b>we need a fullpath</b>$vid" , FILE_APPEND);  
         die('we need full path,' . substr($vid, 0, 4) );
     }
  }
  $videoName = basename($video) . $ext;
  $outputName = "./$videoName";

  //delete local file if exist
  if (file_exists($outputName)) {   unlink($outputName);  }
  
  //make sure our given file exist
  if (file_exists($video)) {  
      //Good -- time is 30sec in..
      runshell("$ffmpeg -i '$video' -ss $timeInVideo -s 640x480 -r 15  -vframes 1 '$outputName'");
  } else {
      file_put_contents($statsFile,"<b>ffmpeg did not work</b>$video" , FILE_APPEND);  
      die('no file');
  } 
  
  if ($stats) { 
      $time_end = microtime(true);
      $time = $time_end - $time_start;
  }
  
  if (!file_exists($outputName))
  {  
     file_put_contents($statsFile,"<b>thumbnail creation failed</b>$outputName" , FILE_APPEND);  
     die('thumbnail creation failed');
  } else {
     //move file to cache folder with correct name 
     rename($videoName,"$cacheFolder$saveName");
     if ($stats) {  
         file_put_contents($statsFile,"Did thumbnail generation of $videoName in $time microtime\n<br>" , FILE_APPEND);
     }
  }
  return "$cacheFolder$saveName";

}


function runme($cmd) {
  echo "<h4>EX: $cmd</h4>";    
  $output=null;
  $retval=null;
  exec($cmd, $output, $retval);
  echo "Returned with status $retval and output:\n<br>";
  print_r($output);
  var_dump($output);
  echo "<hr>";
}

function runshell($cmd) {
  //echo "<h4>SH: $cmd</h4>";    
  $output = shell_exec($cmd);
  //echo "Output: <pre>$output</pre>";
}


?>