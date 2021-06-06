SELECT p.surname,  s.shortname, c.* 
           FROM dkhs_lcontent c, dkhs_lperstemp p, dkhs_lsubject s 
            WHERE p.persid = c.persid 
              AND s.subjectid = c.subjectid 
              AND c.contentid in  
           (select contentid from (SELECT c.grade, c.subjectid, c.persid, max(c.contentid) contentid 
             FROM dkhs_lcontent c 
           where c.update_timestamp > NOW() - INTERVAL 5  DAY 
             and persid is not null 
             and sortorder != 0 
           group by c.grade, c.subjectid, c.persid   
           order by c.update_timestamp ) max)  
           order by grade + 0 DESC, s.shortname, p.surname;
           

Max contentid by grade, subject and personel
SELECT c.grade, c.subjectid, c.persid, max(c.contentid) contentid 
             FROM dkhs_lcontent c 
           where c.update_timestamp > NOW() - INTERVAL 5  DAY 
             and persid is not null 
             and sortorder != 0 
           group by c.grade, c.subjectid, c.persid   

SELECT p.surname,  s.shortname, c.* 
           FROM dkhs_lcontent c, dkhs_lperstemp p, dkhs_lsubject s 
            WHERE p.persid = c.persid 
              AND s.subjectid = c.subjectid 
              AND c.contentid in  (1378)

maar, ons wil die regte foldernaam ook insit. Vir in geval hulle rename het.
folder content het name, description en description is REGTE naam
So as jy 'n id select, en daai id het 'n foldernaam in folder, dan moet jy gaan soek vir sy folder maat
 deur sy description te match met huidige folder

select f.name displayfolder, c.* from dkhs_lcontent c
join dkhs_lcontent f on f.description = c.folder and f.grade = c.grade and f.subjectid = c.subjectid
where c.contentid = 1378

select name from dkhs_lcontent where description = folder and grade = and subjectid = 
 

select f.name displayfolder , c.* from dkhs_lcontent c
join dkhs_lcontent f on f.description = c.folder and f.grade = c.grade and f.subjectid = c.subjectid
where c.contentid < 500


select f.name displayfolder , c.* from dkhs_lcontent c, dkhs_lcontent f where c.type = 'folder' and f.description = c.folder and f.grade = c.grade and f.subjectid = c.subjectid;
select f.name displayfolder , c.* from dkhs_lcontent c, dkhs_lcontent f 
where f.description = c.folder and f.grade = c.grade and f.subjectid = c.subjectid
and c.contentid < 500


select f.name displayfolder, c.*, DATEDIFF(now(), c.update_timestamp) days 
           from dkhs_lcontent c, dkhs_lcontent f
          where  f.description = c.folder and f.grade = c.grade and f.subjectid = c.subjectid
            and c.sortorder != 0 
            and ((c.grade, c.subjectid, c.folder) 
              in (select grade,subjectid, description from dkhs_lcontent where contentid = 585) 
             or c.contentid = 585)
          order by c.sortorder, c.name