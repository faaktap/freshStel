import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import HomeStart from '@/views/home/HomeStart'
//import Hover from '@/components/Hover'
//import i18nTest from '@/components/i18nTest'
//import EmptyRouterView from '@/components/EmptyRouterView'

import login from '@/components/Login'

import { getters } from "@/api/store";
import { zmlLog } from '@/api/zmlLog.js';

Vue.use(VueRouter)

const la = ["AppLayoutDefault","AppLayoutBasic","AppLayoutBlue","AppLayoutGray","AppLayoutDrawer"]

const routes = [
  /*
  { path: '/a', redirect: '/about' },
  { path: '/h', redirect: '/hover' },
  { path: '/1', redirect: { name: 'Werner' }},
  */
  {
    component: HomeStart,
    path: '/',
    name: 'HomeStart',
    meta: {layout: la[3],
    authentication: "public"}
  },
  {
    component: Home,
    path: '/home',
    name: 'Home',
    meta: {layout: la[3],
    authentication: "public"}
  },
  {
    component: login,
    path: '/login/:forgot?',
    name: 'Login',
    props:true,
    params: {errorMessage:''},
    meta: {layout: la[3], authentication: "public"}
  },
  { path: '/drive', redirect: '/folder' },
  {
    path: '/folder/:grade?/:subject?/:level1?/:level2?/:level3?/:level4?',
    name: 'Folder',
    component: () => import(/* webpackChunkName: "folder" */ '@/views/new/FolderEdit.vue'),
    props:true,
    params: {grade: 'Gr08', subject: 'Accounting_Rekeningkunde'},
    meta: {layout: la[3], authentication: "student" }
  },
  {
    path: '/virtualawards', redirect: '/virtualawards/27/0'
  }
 ,{
   //Actual award!
     path: '/virtualawards/:chapterid/:orderid?',    name: 'virtualawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardCarousel.vue')
   , props: true,    params: {chapterid: 26, orderid: 1, editmode: false}
   , meta: {layout: la[0], authentication: "public" }
  },
  {
     path: '/loadhomework/:StudentID?'
    ,name: 'LoadHomework',
    component: () => import(/* webpackChunkName: "atten" */ '@/views/LoadHomework.vue')
    ,alias: '/homex'
    ,params: {studentID:'20113'}
    ,meta: {layout: la[3], authentication: "student"}
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Admin'),
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    path: '/calstud/:studentid?',
    name: 'CalStudent',
    props:true,
    params: {studentid: '20113'},
    component: () => import(/* webpackChunkName: "kal" */ '@/components/CalendarStudent'),
    meta: {layout: la[3], authentication: "student" }
  },
  {
    path: '/calteach/:menemonic?',
    name: 'CalendarTeacher',
    props:true,
    params: {menemonic: 'SDVM'},
    component: () => import(/* webpackChunkName: "kal" */ '@/components/Calendar'),
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    path: '/choosesubjects',
    name: 'skool',
    component: () => import(/* webpackChunkName: "pers" */ '@/components/vfbase/skool'),
    meta: {layout: la[3], authentication: "public" }
  },
  {
    path: '/register/:surveyidPassed?',
    name: 'register',
    props:true,
    params: {surveyidPassed: '3'},
    component: () => import(/* webpackChunkName: "pers" */ '@/components/vfbase/register'),
    meta: {layout: la[0], authentication: "public" }
  },
  {
    path: '/rekenaar/:surveyidPassed?',
    name: 'rekenaar',
    props:true,
    params: {surveyidPassed: '4'},
    component: () => import(/* webpackChunkName: "pers" */ '@/components/vfbase/rekenaar.vue'),
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    path: '/about', name: 'About',
    meta: {layout: la[3], authentication: "werner" }
  },
  {
    path: '/kalender',
    name: 'Kalender',
    component: () => import(/* webpackChunkName: "kal" */ '@/components/cal/Kalender.vue'),
    meta: {layout: la[0], authentication: "teacher" }
  },
  {
    path: '/periodtable',
    name: 'PeriodTable',
    component: () => import(/* webpackChunkName: "kal" */ '@/components/cal/PeriodTable.vue'),
    meta: {layout: la[0], authentication: "teacher" }
  },
  {
    path: '/rooster/:user_name?',
    name: 'Rooster',
    props:true,
    params: {user_name: 'TVRB'},
    component: () => import(/* webpackChunkName: "kal" */ '@/components/learn/rooster.vue'),
    meta: {layout: la[0], authentication: "teacher" }
  },
  {
    path: '/systemview',
    name: 'SystemView',
    component: () => import(/* webpackChunkName: "test" */ '@/views/SystemView.vue'),
    meta: {layout: la[0], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/components/FundRaiser.vue')
    ,name: 'FundRaiser'
    ,path: '/thermometer'
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    path: '/repexp',
    name: 'BasePrintTable',
    component: () => import(/* webpackChunkName: "test" */ '@/components/base/BasePrintTable.vue'),
    props:true,
    meta: {layout: la[0], authentication: "teacher" }
  },
//import BasePrintTable from '@/components/base/BasePrintTable.vue'
  {
    path: '/dkhsawards',   name: 'dkhsawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardStories.vue'),
    meta: {layout: la[1], authentication: "werner" }
  },
  {
    //award - edit
    path: '/studentawards',    name: 'studentawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/StudentAwardTable.vue'),
    meta: {layout: la[1], authentication: "werner" }
  },  {
    path: '/awardedit', name: 'awardedit',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardEdit.vue'),
    meta: {layout: la[3], authentication: "werner" }
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/views/ViewSubjects.vue')
    ,name: 'ViewSubjects'
    ,path: '/subjects'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/views/student/MainStudentClassList.vue'),
    path: '/studentlist',
    name: 'studentlist',
    meta: {layout: la[3], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentClass.vue'),
    path: '/class/:gc?',
    name: 'ClassList',
    params: {title:"studentClassList",gc:{ g: "G12", c: "E1" }},
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/TeacherClassList.vue'),
    path: '/teacherlist',
    name: 'teacherlist',
    meta: {layout: la[3], authentication: "admin" },
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/components/homework/TeacherClassEdit.vue'),
    path: '/tce/:listID?',
    name: 'TeacherClassEdit',
    props:true,
    meta: {layout: la[3], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/views/student/StudentInfo.vue'),
    path: '/student/:studentid?',
    name: 'StudentInfo',
    props:true,
    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "pers" */ '@/views/PersonelInfo.vue'),
    path: '/personel',
    name: 'PersonelInfo',
    meta: {layout: la[3], authentication: "public" }
  },  {
    component: () => import(/* webpackChunkName: "pers" */ '@/components/staff/PersonelNameCardDemo.vue'),
      path: '/personel/:persName?',
      name: 'PersonelCard',
      props: true,
      params: {persName: 'what'},
      meta: {layout: la[3], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/ViewFunctions.vue'),
    path: '/viewfunctions',    name: 'ViewFunctions',    meta: {layout: la[3], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "folder" */ '@/views/learn/Latest.vue')
    ,name: 'latest'
    ,path: '/latest/:days?'
    ,props: true,    params: {days: 7}
    ,meta: {layout: la[3], authentication: "student"}
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/components/email/EmailBulletins.vue')
    ,name: 'newsletters'
    ,path: '/newsletters/:emailSearch?'
    ,props: true,    params: {emailSearch: 'd'}
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "work" */ '@/views/LogCheck.vue')
    ,name: 'checklog'
    ,path: '/checklog'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    component: () => import(/* webpackChunkName: "email" */ '@/views/EmailCheck.vue')
    ,name: 'EmailCheck'
    ,path: '/emailcheck'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    component: () => import(/* webpackChunkName: "work" */ '@/views/Werner.vue')
    ,name: 'Werner'
    ,path: '/werner'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    component: () => import(/* webpackChunkName: "work" */ '@/views/test/WernerTest.vue')
    ,name: 'WernerTest'
    ,path: '/wernertest'
    ,meta: {layout: la[3], authentication: "werner"}
  },

  {
    component: () => import(/* webpackChunkName: "email" */ '@/components/email/EmailDeliveryReport.vue')
    ,name: 'EmailDeliveryReport'
    ,path: '/emaildeliver/:deliverid?'
    ,props:true
    ,meta: {layout: la[3], authentication: "teacher"}
  },
  {
    path: '/emailssent/:subid?',    name: 'emailssent',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/EmailsSent.vue'),
    props: true,    params: {subid: 6229, editmode: false},
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "vote" */ '@/views/vote/ViewCampaigns.vue')
    ,name: 'ViewCampaigns'
    ,path: '/elections'
    ,meta: {layout: la[3], authentication: "student"}
  },
{
    component: () => import(/* webpackChunkName: "vote" */ '@/views/vote/ViewVote.vue')
    ,name: 'ViewVote'
    ,path: '/candidates/:campaignid'
    ,params: {campaignid: false}
    ,props: true
    ,meta: {layout: la[3], authentication: "student"}
  },
  {
    component: () => import(/* webpackChunkName: "vote" */ '@/views/vote/ApplicantRegister.vue')
    ,name: 'ApplicantRegister'
    ,path: '/applicant/:campaignid'
    ,props: true
    ,meta: {layout: la[3], authentication: "student"}
  },
  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/UserList.vue')
    ,name: 'UserList'
    ,path: '/userlist'
    ,meta: {layout: la[3], authentication: "teacher"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/components/TextColorPicker.vue')
    ,name: 'color'
    ,path: '/color'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "home" */ '@/views/AutoRoute.vue'),
    path: '/ar',
    name: 'AutoRoute',
    meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/views/IncomingPhotoLink.vue')
    ,name: 'IncomingPhotoLink'
    ,path: '/photohelp'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/views/AllPhotos.vue')
    ,name: 'AllPhotos'
    ,path: '/photos/:switch?'
    ,meta: {layout: la[3], authentication: "teacher"}
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/views/Reinette.vue')
    ,name: 'eksamendruk'
    ,path: '/eksamendruk'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    path: '/wifi/:studentid?',    name: 'wifi',
    component: () => import(/* webpackChunkName: "pers" */ '@/components/student/StudentWiFi.vue'),
    props: true,
    params: {studentid: 17033, editmode: false},
    meta: {layout: la[3], authentication: "student" }
  },
  {
    path: '/att/:studentid?',    name: 'StudentAttendance',
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentAttendance.vue'),
    props: true,
    params: {studentid: 17033, editmode: false},
    meta: {layout: la[3], authentication: "student" }
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/views/BookReturn.vue'),
    path: '/bookreturn',
    name: 'BookReturn',
    props:true,
    meta: {layout: la[3], authentication: "admin" }
  },
  {
    path: '/meritadd/:meritid/:studentid?/:description?',
    name: 'MeritStepper',
    component: () => import(/* webpackChunkName: "pers" */ '@/components/merit/MeritStepper.vue'),
    props: true,
    params: {meritid: 1,studentid:'', description:''},
    meta: {layout: la[3], authentication: "student" }
  },
  {
    path: '/meritpoint',
    name: 'MeritPoint',
    component: () => import(/* webpackChunkName: "pers" */ '@/components/merit/MeritPoint.vue'),
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/components/merit/MeritStart.vue'),
    path: '/meritstart',
    name: 'MeritStart',
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/components/staff/PersonelMeritList.vue'),
    path: '/persmeritlist',
    name: 'PersMeritList',
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/components/merit/MeritTable.vue'),
    path: '/merittable',
    name: 'MeritTable',
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "pers" */ '@/components/merit/MeritForm.vue'),
    path: '/meritedit/:id',
    name: 'MeritForm',
    props:true,
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/HelloWorld.vue'),
    path: '/helloworld/:menemonic?',
    name: 'HelloWorld',
    props:true,
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    path: '/attendance/:date?',    name: 'AttendanceView',
    component: () => import(/* webpackChunkName: "atten" */ '@/views/AttendanceViewOld.vue'),
    props: true,
    params: {date: '', editmode: false},
    meta: {layout: la[3], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/views/Attendance4.vue'),
    path: '/attload',
    name: 'Attendance4',
    props:true,
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentAttendanceList.vue'),
    path: '/attendanceadd',
    name: 'AttendanceList',
    props:true,
    params: {studentList: [],checkList:['yes','no'],attendanceDetail: {staffSurname:'', location:'', period:'', }},
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/views/StartGenList.vue')
    ,name: 'StartGenList'
    ,path: '/vglist'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentGeneralList.vue'),
    path: '/generaladd',
    name: 'GeneralList',
    props:true,
    params: {studentList: [],checkList:['yes','no'],listDetail: {staffSurname:'', location:'', period:'', }},
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentGenListView.vue'),
    path: '/genlistview',
    name: 'GeneralListView',
    props:true,
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentGenListSession.vue'),
    path: '/genlistsession/:sessionid?',
    name: 'GenListSession',
    props:true,
    params: {sessionid:0},
    meta: {layout: la[3], authentication: "teacher" }
  },
  // {
  //   component: () => import(/* webpackChunkName: "atten" */ '@/components/homework/ViewGeneralList.vue'),
  //   path: '/gtlist',
  //   name: 'ViewGeneralList',
  //   props:true,
  //   params: {listid: 0},
  //   meta: {layout: la[3], authentication: "teacher" }
  // },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentAttendanceView.vue'),
    path: '/attview',
    name: 'AttendanceView4',
    props:true,
    params: {},
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "atten" */ '@/components/student/StudentAttendanceSession.vue'),
    path: '/attsession/:sessionid?',
    name: 'AttendanceSession',
    props:true,
    params: {sessionid:0},
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/JdocViewEdit.vue'),
    path: '/jdoc',
    name: 'JdocViewEdit',
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "cal" */ '@/views/BaseCalenViewEdit.vue'),
    path: '/basecalendaredit/:seldate?',
    name: 'BaseCalenViewEdit',
    props:true,
    params: {seldate:'2023-04'},
    meta: {layout: la[3], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "reports" */ '@/views/Reports.vue'),
    path: '/reports',
    name: 'Reports',
    props:true,
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/ErrorPage.vue')
    ,name: 'ErrorPage'
    ,path: '*'
    ,meta: {layout: la[3], authentication: "public"}
  },
]

import { publicPath } from '../../vue.config'
import { ls } from '@/api/localStorage.js'
const router = new VueRouter({
  mode: 'history',
  base: publicPath, //'virtual-school',    //This works : /zmltest/  but ./ does not work for layouts
  werner: 'werner',      //see if I can add my own stuff.
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {      return savedPosition
  //   } else {      return { top: 0,  behavior: 'smooth' }   }
  // },
  // eslint-disable-next-line
  scrollBehavior(to, from, savedPosition) {
    console.log('ind:ScrollBehavior(',to, from, savedPosition,')' )
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  },

})

router.beforeEach((to, from,next) => {
  if (ls.test('zmllogin') && getters.getState({ object: "gZml" }).login.type == 'guest' ) {
    getters.getState({ object: "gZml" }).login = ls.load('zmllogin')
    if (ls.test('zmlPersM')) {
      getters.getState({ object: "gZml" }).persMenemonic = ls.load('zmlPersM')
    }
  }
  const userAuth = getters.getState({ object: "gZml" }).login.isAuthenticated
  const userType = getters.getState({ object: "gZml" }).login.type

  // Vue.prototype.$cs.l('R - From.name, to.name |', from.name,'|', to.name,'|', from.path,'|', to.path);

  zmlLog(getters.getState({ object: "gZml" }).login.username
        ,"Route"
        , `${from.name}->${to.name} : ${from.path} -> ${to.path}`)

  if (to.name == from.name) {
    if (to.params && to.params == from.params){
    //do nothing
    } else {
      next();
    }
  } else {
    Vue.prototype.$cs.l('R - Auth Meta:', to.meta.authentication,userAuth, userType);
    if (to.meta.authentication != 'public' && userAuth == false && to.name != 'Login') {
      Vue.prototype.$cs.l('R - ForceLogin')
      next({name: 'Login', meta:{message:'Bad Authentication for ' + to.name}})
    } else if (to.meta.authentication == 'teacher' && userType == 'student' && to.name != 'Login') {
      Vue.prototype.$cs.l('R - ForceLogin - student not allowed')
      next({name: 'Login'
          , props: { errorMessage: 'there was an error' }
          , meta:{message:'Bad Authentication for ' + to.name}})
    }
    else if (to.meta.authentication == 'admin' && userType == 'student' && to.name != 'Login') {
      Vue.prototype.$cs.l('R - ForceLogin - student not allowed')
      next({name: 'Login'
          , props: { errorMessage: 'there was an error' }
          , meta:{message:'Bad Authentication for ' + to.name}})
    }
    else {
      Vue.prototype.$cs.l('R - Just Next', to)
      next();
    }
    /*
    if (to.name == 'Home' ) {
       if (getters.getState({ object:"gZml" }).login.isAuthenticated == true) {
            //Vue.prototype.$cs.l('Logged in : take hime to other home')
            next({name: 'About'})
        } else {
          next();
        }
    } else {
      */
  }
});

export default router
