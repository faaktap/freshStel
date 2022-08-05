import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Hover from '@/components/Hover'
import i18nTest from '@/components/i18nTest'
import EmptyRouterView from '@/components/EmptyRouterView'

import login from '@/components/Login'

import { getters } from "@/api/store";

Vue.use(VueRouter)

const la = ["AppLayoutDefault","AppLayoutBasic","AppLayoutBlue","AppLayoutGray"]

const routes = [
  /*
  { path: '/a', redirect: '/about' },
  { path: '/h', redirect: '/hover' },
  { path: '/1', redirect: { name: 'Werner' }},
  */
  {
    component: Home,
    path: '/home',
    name: 'Home',
    meta: {layout: la[3],
    authentication: "public"}
  },
  // {
  //   component: login,path: '/login', name: 'Login', props:true,
  //   meta: {layout: la[3], authentication: "public"}
  // },
  {
    component: login,
    path: '/login/:forgot?',
    name: 'Login',
    alias: '/',
    props:true,
    meta: {layout: la[3], authentication: "public"}
  },
  {
    component: Home,
    path: '/home',
    name: 'RealHome',
    meta: {layout: la[3],
    authentication: "public"}
  },
  {
    path: '/ff',
    name: 'ff',
    component: () => import(/* webpackChunkName: "vfbasetest" */ '../components/vfbase/vfbasetest'),
    meta: {layout: la[3],
    authentication: "public" }
  },
  {
    path: '/wernertest',
    name: 'WernerTest',
    component: () => import(/* webpackChunkName: "test" */ '../views/test/WernerTest'),
    meta: {layout: la[3], authentication: "admin" }
  },
  { path: '/drive', redirect: '/folder' },
  {
    path: '/folder/:grade?/:subject?/:level1?/:level2?/:level3?/:level4?',
    name: 'Folder',
    component: () => import(/* webpackChunkName: "homework" */ '@/views/new/FolderEdit.vue'),
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
   component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardCarousel.vue'),
   props: true,    params: {chapterid: 26, orderid: 1, editmode: false},
   meta: {layout: la[0], authentication: "public" }
  },
  {
     path: '/loadhomework/:StudentID?'
    ,name: 'LoadHomework'
    ,component: () => import(/* webpackChunkName: "homework" */ '@/views/LoadHomework.vue')
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
    path: '/choosesubjects',
    name: 'skool',
    component: () => import(/* webpackChunkName: "vfbasetest" */ '../components/vfbase/skool'),
    meta: {layout: la[3], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    path: '/about', name: 'About',
    meta: {layout: la[3], authentication: "werner" }
  },
  {
    component: () => import(/* webpackChunkName: "bates" */ '../views/bates/Outline.vue'),
    path: '/bates', name: 'Bates',
    meta: {layout: la[3], authentication: "werner" }
  },  {
    //test
    component:EmptyRouterView,   path: '/hover',
    children: [
       { name: 'Hover',   path: '',    component: Hover,   meta: {layout: la[3], authentication: "admin"}},
    ]
  }, {
    path: '/dkhsawards',   name: 'dkhsawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardStories.vue'),
    meta: {layout: la[0], authentication: "werner" }
  },
  // {
  //   path: '/va/:chapterid',    name: 'va',
  //   component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/zmlCarousel.vue'),
  //   props: true,    params: {chapterid: 4, editmode: false},    meta: {layout: la[0], authentication: "public" }
  // },
  {
    //award - edit
    path: '/studentawards',    name: 'studentawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/StudentAwardTable.vue'),
    meta: {layout: la[1], authentication: "werner" }
  },  {
    path: '/awardedit', name: 'awardedit',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardEdit.vue'),
    meta: {layout: la[3], authentication: "werner" }
  },  {
    //award
    component: () => import(/* webpackChunkName: "test" */ '@/views/test/AKandidate.vue')
    ,name: 'AKandidate'
    ,path: '/a'
    ,meta: {layout: la[0], authentication: "werner"}
  },
  {
     component: () => import(/* webpackChunkName: "homework" */ '@/views/ViewSubjects.vue')
    ,name: 'ViewSubjects'
    ,path: '/subjects'
    ,meta: {layout: la[3], authentication: "admin"}
  },    {
    component: () => import(/* webpackChunkName: "homework" */ '@/views/student/StudentClassList.vue'),
    path: '/studentlist',
    name: 'studentlist',
    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/student/StudentInfo.vue'),
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
    component: () => import(/* webpackChunkName: "pers" */ '@/components/staff/PersonelMenemonic.vue'),
    path: '/sgrade1',    name: 'sgrade1',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "pers" */ '@/components/staff/PersonelLookup.vue'),
    path: '/sgrade2',    name: 'sgrade2',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/components/student/StudentLookup.vue'),
    path: '/sgrade3',    name: 'sgrade3',    meta: {layout: la[3], authentication: "test" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/components/student/StudentClass.vue'),
    path: '/sgrade',    name: 'sgrade',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/ViewFunctions.vue'),
    path: '/viewfunctions',    name: 'ViewFunctions',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: i18nTest,path: '/translate', name: 'Translate',
    meta: {layout: la[3]}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/test/Bland2.vue')
    ,name: 'bland'
    ,path: '/bland'
    ,meta: {layout: la[3], authentication: "werner"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/test/FlexGridStuff.vue')
    ,name: 'flex'
    ,path: '/flex'
    ,meta: {layout: la[0], authentication: "werner"}
  },
  {
    component: () => import(/* webpackChunkName: "learn" */ '@/views/learn/Latest.vue')
    ,name: 'latest'
    ,path: '/latest/:days?'
    ,props: true,    params: {days: 5}
    ,meta: {layout: la[3], authentication: "student"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/components/base/WhackAMole.vue')
    ,name: 'game'
    ,path: '/game'
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/test/baseTabAndEdit.vue')
    ,name: 'basetabandedit'
    ,path: '/basetabandedit'
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "email" */ '@/views/test/StreamLineDB.vue')
    ,name: 'streamline'
    ,path: '/streamline'
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "email" */ '@/components/email/EmailBulletins.vue')
    ,name: 'newsletters'
    ,path: '/newsletters/:emailSearch?'
    ,props: true,    params: {emailSearch: 'd'}
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "email" */ '@/views/LogCheck.vue')
    ,name: 'checklog'
    ,path: '/checklog'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "email" */ '@/views/EmailCheck.vue')
    ,name: 'EmailCheck'
    ,path: '/emailcheck'
    ,meta: {layout: la[3], authentication: "public"}
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
    component: () => import(/* webpackChunkName: "email" */ '@/views/EmailsSent.vue'),
    props: true,    params: {subid: 6229, editmode: false},
    meta: {layout: la[3], authentication: "teacher" }
  },
  // {
  //   path: '/emailall/:search?',    name: 'emailssent',
  //   component: () => import(/* webpackChunkName: "email" */ '@/views/EmailAll.vue'),
  //   props: true,
  //   params: {search: '', editmode: false},
  //   meta: {layout: la[3], authentication: "admin" }
  // },
  {
    component: () => import(/* webpackChunkName: "vote" */ '@/views/vote/ViewCampaigns.vue')
    ,name: 'ViewCampaigns'
    ,path: '/elections'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "vote" */ '@/views/vote/ViewVote.vue')
    ,name: 'ViewVote'
    ,path: '/candidates/:campaignid'
    ,props: true
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "vote" */ '@/views/vote/ApplicantRegister.vue')
    ,name: 'ApplicantRegister'
    ,path: '/applicant/:campaignid'
    ,props: true
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/UserList.vue')
    ,name: 'UserList'
    ,path: '/userlist'
    ,meta: {layout: la[3], authentication: "teacher"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/test/TestUpload.vue')
    ,name: 'testUpload'
    ,path: '/testupload'
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/components/TextColorPicker.vue')
    ,name: 'color'
    ,path: '/color'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/IncomingPhotoLink.vue')
    ,name: 'IncomingPhotoLink'
    ,path: '/photohelp'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/AllPhotos.vue')
    ,name: 'AllPhotos'
    ,path: '/photos/:switch?'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/calendarSetup.vue')
    ,name: 'DaySet'
    ,path: '/dayset'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/components/Calendar.vue')
    ,name: 'Calendar'
    ,path: '/calendar/:menemonic?'
    ,props:true
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/Reports.vue')
    ,name: 'reports'
    ,path: '/reports'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "newone" */ '@/views/Reinette.vue')
    ,name: 'eksamendruk'
    ,path: '/eksamendruk'
    ,meta: {layout: la[3], authentication: "admin"}
  },
  {
    path: '/wifi/:studentid?',    name: 'wifi',
    component: () => import(/* webpackChunkName: "student" */ '@/components/student/StudentWiFi.vue'),
    props: true,
    params: {studentid: 17033, editmode: false},
    meta: {layout: la[3], authentication: "student" }
  },
  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/BookReturn.vue'),
    path: '/bookreturn',
    name: 'BookReturn',
    props:true,
    meta: {layout: la[3], authentication: "admin" }
  },
  {
    component: () => import(/* webpackChunkName: "merit" */ '@/components/merit/MeritMenu.vue'),
    path: '/merit',
    name: 'MeritMenu',
    meta: {layout: la[3], authentication: "student" }
  },
  {
    component: () => import(/* webpackChunkName: "homework" */ '@/components/student/StudentClass.vue'),
    path: '/class',
    name: 'ClassList',
    params: {title:"studentClassList",gc:{ g: "G12", c: "E1" }},
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "merit" */ '@/components/merit/MeritTable.vue'),
    path: '/meritview',
    name: 'MeritTable',
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "merit" */ '@/components/merit/MeritForm.vue'),
    path: '/meritedit/:id',
    name: 'MeritForm',
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
  routes
})

router.beforeEach((to, from,next) => {
  if (ls.test('zmllogin')  && getters.getState({ object: "gZml" }).login.type == 'guest' ) {
    getters.getState({ object: "gZml" }).login = ls.load('zmllogin')
    if (ls.test('zmlPersM')) {
      getters.getState({ object: "gZml" }).persMenemonic = ls.load('zmlPersM')
    }

  }
  const userAuth = getters.getState({ object: "gZml" }).login.isAuthenticated
  const userType = getters.getState({ object: "gZml" }).login.type


  Vue.prototype.$cs.l('R - From.name, to.name |', from.name,'|', to.name,'|', from.path,'|', to.path);
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
