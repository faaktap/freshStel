SELECT p.surname,c.persid,max(update_timestamp) , count(*)
FROM dkhs_lcontent c,dkhs_lperstemp p
where p.persid = c.persid
group by p.surname,c.persid
order by count(*)

SELECT p.surname,c.persid,s.shortname, c.grade ,max(c.update_timestamp) , max(contentid)
FROM dkhs_lcontent c,dkhs_lperstemp p, dkhs_lsubject s
where c.update_timestamp > NOW() - INTERVAL 5 DAY
 and p.persid = c.persid
 and s.subjectid = c.subjectid
group by p.surname,c.persid,s.shortname, c.grade 

SELECT p.surname,c.persid,s.shortname, c.grade ,max(c.update_timestamp) , max(contentid)
FROM dkhs_lcontent c,dkhs_lperstemp p, dkhs_lsubject s
where c.update_timestamp > NOW() - INTERVAL 5 DAY
 and p.persid = c.persid
 and s.subjectid = c.subjectid
group by p.surname,c.persid,s.shortname, c.grade 

SELECT p.surname,  c.grade ,s.shortname, c.name, c.folder, c.update_timestamp, c.contentid
  FROM dkhs_lcontent c, dkhs_lperstemp p, dkhs_lsubject s
 WHERE p.persid = c.persid
   AND s.subjectid = c.subjectid
   AND c.contentid in 
(select contentid from (SELECT c.grade, c.subjectid, c.persid, max(c.contentid) contentid
  FROM dkhs_lcontent c
where c.update_timestamp > NOW() - INTERVAL 8 DAY
  and persid is not null
group by c.grade, c.subjectid, c.persid  
order by c.update_timestamp ) max) 
order by grade DESC, p.surname,s.shortname

Het nou net 'n eureka oomblik gehad glo ek. Ek sukkel vreeslik met jou idee om seker leers "shortcuts" te maak -
nie omdat dit moeilik is nie - maar eerder omdat dit nie reg voel nie. Jy gaan elke dag 'n nuwe link moet uitdink
en byvoeg, en dit vir kinders stuur. Dit voel net vir my verkeerd. Te veel werk, en boonop gaan die links
verourderd raak, en daar gaan later vreeslik baie wees.
Toe begin ek paar goedjies uitcheck, en sukkel sukkel kom ek toe by volgende idee uit. Sondagaand 22:57.
Wat van ons iets soos "latest" het? As jy na iets soos www.kuiliesonline.co.za/latest toe gaan, dan wys ek alle
"content" wat in afgelope "x" periode gelaai is. Ek kan selfs iets soos /latest/5 maak om afgelope 5 dae se
werk te sien. En ek wys dit per graad en per vak en per onderwyser!
So dit werk nie net vir jou nie, maar vir alle onnies. one time!



SELECT contentid, grade, s.shortname, s.subjectid,name, type, folder , l.description
  FROM dkhs_lcontent l, dkhs_lsubject s
where (s.subjectid = l.subjectid
and grade  =12 and s.subjectid = 17)
 and (type = 'mdi-folder'
  or folder is not null)
order by type

select *, DATEDIFF(now(), update_timestamp) days 
 from dkhs_lcontent 
where sortorder != 0 
  and ((grade, subjectid, folder) 
   in (select grade,subjectid, description from dkhs_lcontent where description = 'TERM 1 / KWARTAAL 1') 
   and grade = 8 and subjectid = 17);
   
   
select *, DATEDIFF(now(), update_timestamp) days '
           from dkhs_lcontent 
          where sortorder != 0 
          and subjectid = 17 and grade = 8
         
//--------------------------------------------------------------------------------
function getLContentFolderNo($json) {
    $data = $json['data'];
    $filter = '';
    if (array_key_exists('login',$data)) {
        $login = $data['login'];   //check if this is a student...
        if ($login['type'] == 'student' || $login['type'] == '') {
            $filter = ' and accesstype != "teacher" ';
        }
    } 
    $folder = ''; $folderid = 0; $subjectid = 0; $grade = 0;
    if (array_key_exists('folderid',$data)) $folderid = $data['folderid'];
    if (array_key_exists('subjectid',$data)) $subjectid = $data['subjectid'];
    if (array_key_exists('grade',$data)) $grade = $data['grade'];
    if (array_key_exists('folder',$data)) $folder = $data['folder'];
    
    if ($folderid > 0) {
        $sql = 'select *, DATEDIFF(now(), update_timestamp) days '
         . '  from dkhs_lcontent '
         . ' where sortorder != 0 '
         . $filter
         . '   and ((grade, subjectid, folder) '
         . '     in (select grade,subjectid, name from dkhs_lcontent where contentid = :folderid) '
         . '    or contentid = :folderid)';
    
        $stmt = DB::prepare($sql);   
        $stmt->bindParam(':folderid'     ,$data['folderid']  , PDO::PARAM_INT);  
    } else if ($foldername) {
        $sql = 'select *, DATEDIFF(now(), update_timestamp) days '
         . ' from dkhs_lcontent '
         . 'where sortorder != 0 '
         . '  and ((grade, subjectid, folder) '
         . '   in (select grade,subjectid, name from dkhs_lcontent where description = :folder) '
         . '   and grade = :grade and subjectid = :subjectid)';
        $stmt = DB::prepare($sql);   
        $stmt->bindParam(':subjectid' ,$data['subjectid'], PDO::PARAM_INT);           
        $stmt->bindParam(':grade'     ,$data['grade']    , PDO::PARAM_INT);           
        $stmt->bindParam(':folder'    ,$data['folder']   , PDO::PARAM_INT);           
    }
    //Load the data from above sql
  try {
     $stmt->execute();
  } catch (Exception $e){
     $result = ['errorcode' => 149,'result' => 'exception','exception' => 'on select dkhs ' , 'error' => json_encode($e), 'sql' => $sql];
	 return $result;
  }  
  if ($stmt->rowCount() >= 1) {
      $dbdata = $stmt->fetchAll(PDO::FETCH_ASSOC);
  }  else {
      $dbdata =  ['errorcode' => 2, 'error' => 'No content exist for the search criteria'];
  }
  return $dbdata;

}




1. GetFolder - php : getLContentByFolderNo  - Jy het 'n folder nommer, en soek die items in daai folder, en die folder homself.
   1ste lyn is die folder
   2de en ander lyne is die files (of ander folders)
   
2. getLContentPrevFolder

   