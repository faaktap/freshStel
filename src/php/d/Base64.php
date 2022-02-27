<?php

define('ATTACHSUBFOLDER' , '');

//--------------------------------------------------------------------------------
function saveBase64Blob($data) {
    if (!array_key_exists('base64',$data)) { $info =  ['error' => 'We need base64 data to save!'];    return $info; }
    if (!array_key_exists('extrapath',$data)) { $info =  ['error' => 'We need a extrapath above'.ATTACHSUBFOLDER.' !'];    return $info; }
    if (!array_key_exists('realname',$data)) { $info =  ['error' => 'We need a real name!'];    return $info; }
	$docroot = ''; // (we do pass the full path over...  no need for docroot!!   $_SERVER['DOCUMENT_ROOT'];
	$extraPath = $data['extrapath'];
    $fileDir = $docroot . ATTACHSUBFOLDER . $extraPath ;
    
    $fileDir = preg_replace('#/+#' ,'/' ,$fileDir);
    if (!is_dir($fileDir))	mkdir($fileDir);
	$fileDir .=  '/';
	
	$fileName = trim($data['realname']);
    $filePath = $fileDir . $fileName; 	
    
	//file_put_contents($filePath . '.b64', $data['base64']);
	
    $blobData = base64_decode( $data['base64'] ); 
    
    // // $blobData = base64url_decode($data['base64']); 
    if ($blobData == FALSE) {
        return ["error" => "base64 decoding failed", "errorcode" => "Sorry buddy " . strlen($data['base64']) ];
    }

    $size = file_force_contents($filePath, $blobData, LOCK_EX);
    if (array_key_exists('error',$size)) {
        return $size;
    }
    $done = "$filePath [ $size ] \n<br>";
    file_put_contents('uploads.txt', $done, FILE_APPEND | LOCK_EX);
    $data['base64'] = '..';
    file_put_contents('data.txt', json_encode($data,1) . "\n<br>\n" , FILE_APPEND | LOCK_EX);
    return ['result' => 'ok', 'size' => $size, 'filename' => $fileName, 'filePath' => $filePath,'fileName' => ATTACHSUBFOLDER . $extraPath . '/' . $fileName];
}

//-----------------------------------------------------------------------
function base64url_decode($data) {
  return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

//--------------------------------------------------------------------------------
function file_force_contents($dir, $contents, $flags = 0){
        $parts = explode('/', $dir);
        $file = array_pop($parts);
        $dir = '';
        foreach($parts as $part) {
            if(!is_dir($dir .= "/$part")) {
                if (!@mkdir($dir)) {
                    $error = error_get_last();
                    return ["error" => $error['message'], "errorcode" => "Error making dir $dir" ];
                }                
            }
        }
        return file_put_contents_atomically("$dir/$file", $contents, $flags);
}

//--------------------------------------------------------------------------------
//Watch out - we are not allowed to rename from the home folder.
// rename('/home/kuilieso/public_html/Subjects/GR08/Afrikaans Huistaal/werner/test.txt~','/home/kuilieso/public_html/Subjects/GR08/Afrikaans Huistaal/werner/test.txt~')
// will always fail when you come in from the web. then your "root path" is public_html
//--------------------------------------------------------------------------------
function file_put_contents_atomically($filename, $data, $flags = 0, $context = null) {
    $sizesaved = file_put_contents($filename, $data, $flags, $context);
    $sizedata = strlen($data);
    if ( $sizesaved == $sizedata ) {
        return $sizesaved;
    }
    @unlink($filename, $context);
    return FALSE;
}


//--------------------------------------------------------------------------------
// If blob gets to large, we might need to save it as file and then decode it and then delete it
//--------------------------------------------------------------------------------
function decode_file($Ifilename, $Efilename){
    $handle = fopen($Ifilename, 'rb');
    $outHandle = fopen($Efilename, 'wb');
    $bufferSize = 4 * 256; // 4 bytes of base64 decodes to 3 bytes of ASCII
    while(!feof($handle)){
        $buffer = fread($handle, $bufferSize);
        $dbuffer = base64_decode($buffer);
        fwrite($outHandle, $dbuffer);
    }
    fclose($handle);
    fclose($outHandle);
}
