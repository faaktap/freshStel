import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Hover from '@/components/Hover'
import i18nTest from '@/components/i18nTest'
import EmptyRouterView from '@/components/EmptyRouterView'

import login from '@/components/Login'

//import { getters } from "@/api/store"; //not needed, we do not redirect at the moment...

Vue.use(VueRouter)

const la = ["AppLayoutDefault","AppLayoutBasic","AppLayoutBlue","AppLayoutGray"]

const routes = [
  /*
  { path: '/a', redirect: '/about' },
  { path: '/h', redirect: '/hover' },
  { path: '/1', redirect: { name: 'Werner' }},
  */
  {
    component: Home,     path: '/',  name: 'Home',    meta: {layout: la[3], authentication: "public"}
  },  {
    component: Home,     path: '/home',  name: 'RealHome',    meta: {layout: la[3], authentication: "public"}
  },
  {
    path: '/ff',
    name: 'ff',
    component: () => import(/* webpackChunkName: "vfbasetest" */ '../components/vfbase/vfbasetest'),
    meta: {layout: la[3], authentication: "public" }
  },
  {
    path: '/choosesubjects',
    name: 'skool',
    component: () => import(/* webpackChunkName: "vfbasetest" */ '../components/vfbase/skool'),
    meta: {layout: la[3], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),    path: '/about', name: 'About',    meta: {layout: la[3], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "bates" */ '../views/bates/Outline.vue'),    path: '/bates', name: 'Bates',    meta: {layout: la[3], authentication: "public" }
  },  { 
    //test
    component:EmptyRouterView,   path: '/hover', 
    children: [
       { name: 'Hover',   path: '',    component: Hover,   meta: {layout: la[3], authentication: "learner"}}, 
       //{ name: 'Hover',   path: '',    component: Hover,   meta: {layout: la[3], authentication: "learner"}} 
    ]
  }, { 
    path: '/dkhsawards',   name: 'dkhsawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardStories.vue'),    meta: {layout: la[0], authentication: "public" }
  }
  ,{
     path: '/virtualawards', redirect: '/virtualawards/25/0' 
  }
  ,{ 
    //Actual award!
    path: '/virtualawards/:chapterid/:orderid',    name: 'virtualawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardCarousel.vue'),
    props: true,    params: {chapterid: 25, orderid: 1, editmode: false},    meta: {layout: la[0], authentication: "public" }
  }
  ,{ 
    //award
    path: '/va/:chapterid',    name: 'va',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/zmlCarousel.vue'),
    props: true,    params: {chapterid: 4, editmode: false},    meta: {layout: la[0], authentication: "public" }
  },  {
    //award - edit
    path: '/studentawards',    name: 'studentawards',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/StudentAwardTable.vue'),
    meta: {layout: la[1], authentication: "public" }
  },  {
    path: '/awardedit',
    name: 'awardedit',
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AwardEdit.vue'),
    meta: {layout: la[3], authentication: "public" }
  },  {
    //award
    component: () => import(/* webpackChunkName: "awards" */ '@/views/awards/AKandidate.vue')
    ,name: 'AKandidate'    ,path: '/a'    ,meta: {layout: la[0], authentication: "public"}
  },
  //  {
  //  component: () => import(/* webpackChunkName: "leer" */ '../views/learn/LearnTree.vue'),
  //  path: '/learntree',     name: 'LearnTree',
  //  meta: {layout: la[3], authentication: "learner" },    props: {default:true},
  //  params: {currentSubjectID:'2', grade:'12'}
  //},
  //learning stuff
  //   was for teachers -not used anymore
  // {
  //  component: () => import(/* webpackChunkName: "leer" */ '@/views/learn/viewLearn.vue'),
  //  path: '/viewlearn', name: 'ViewLearn',    meta: {layout: la[3], authentication: "teacher" },
  //  children: [
  //         //editItem component is rendered when /user/:id is matched
  //         { path: ':id'
  //          , component: () => import(/* webpackChunkName: "leer" */ '@/views/learn/editItem.vue')
  //          , props: {default:true} }  ]
  //  },
  //  {
  //  component: () => import(/* webpackChunkName: "leer" */ '../views/learn/Grade.vue'),
  //  path: '/grade',    name: 'Grade',   props: true,    meta: {layout: la[3], authentication: "learner" }
  //},
  // {
  //  component: () => import(/* webpackChunkName: "leer" */ '../views/learn/SelectGrade.vue'),
  //  path: '/grade/:gradeno',    name: 'SelectGrade',
  //  props: true,    params: {heading: 'Grade', gradeno:10},    meta: {layout: la[3], authentication: "learner" }
  //},
  //  {
  //  component: () => import(/* webpackChunkName: "leer" */ '@/views/learn/StudentHub.vue'),
  //  path: '/studenthub',    name: 'StudentHub',   props: true,
  //  params: {currentSubjectID:'2', grade:'12'},
  //  meta: {layout: la[3], authentication: "learner" }
  //},
  //  {
  //  component: () => import(/* webpackChunkName: "leer" */ '@/views/learn/StudentHub2.vue'),
  //  path: '/hub/:grade/:currentSubjectID',    
  //  name: 'StudentHub2',
  //  props: true,
  //  params: {currentSubjectID:'2', grade:'12'},
  //  meta: {layout: la[3], authentication: "learner" }
  //},
    {
     component: () => import(/* webpackChunkName: "leer" */ '@/views/learn/ViewSubjects.vue')
    ,name: 'ViewSubjects'    ,path: '/subjects'  ,meta: {layout: la[0], authentication: "public"}
  },  {
    component: () => import(/* webpackChunkName: "homework" */ '@/views/learn/LoadHomework.vue')
    ,name: 'LoadHomework'    ,path: '/loadhomework'
    ,meta: {layout: la[3], authentication: "teacher"}
  },  {
    component: () => import(/* webpackChunkName: "homework" */ '@/views/student/StudentList.vue'),
    path: '/studentlist',    name: 'studentlist',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/student/StudentInfo.vue'),
    path: '/student',    name: 'StudentInfo',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/student/PersonelInfo.vue'),
    path: '/personel',    name: 'PersonelInfo',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/components/student/PersonelMenemonic.vue'),
    path: '/sgrade1',    name: 'sgrade1',    meta: {layout: la[3], authentication: "admin" }
  },  {
    component: () => import(/* webpackChunkName: "admin" */ '@/components/student/PersonelLookup.vue'),
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
  },  {
    component: login,path: '/login', name: 'Login',
    meta: {layout: la[3], authentication: "public"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/student/ViewStudentTestGrid.vue')
    ,name: 'sview'
    ,path: '/sview'
    ,meta: {layout: la[3], authentication: "public"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/learn/WernerTest.vue')
    ,name: 'ws'
    ,path: '/ws'
    ,meta: {layout: la[3], authentication: "public"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/Bland.vue')
    ,name: 'bland'
    ,path: '/bland'
    ,meta: {layout: la[3], authentication: "public"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/components/FlexGridStuff.vue')
    ,name: 'flex'
    ,path: '/flex'
    ,meta: {layout: la[0], authentication: "public"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/learn/sh.vue')
    ,name: 'sh'
    ,path: '/sh/:propfolder'
    ,props: true,    params: {propfolder: 585} 
    ,meta: {layout: la[3], authentication: "student"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/learn/sh.vue')
    ,name: 'sh-nofolder'
    ,path: '/sh'
    ,props: true,    params: {propfolder: 585} 
    ,meta: {layout: la[3], authentication: "student"}
  },  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/learn/Latest.vue')
    ,name: 'latestNoPath'
    ,path: '/latest'
    ,props: true,    params: {days: 5} 
    ,meta: {layout: la[3], authentication: "student"}
  },  
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/learn/Latest.vue')
    ,name: 'latest'
    ,path: '/latest/:days'
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
    component: () => import(/* webpackChunkName: "test" */ '@/components/base/baseTabAndEdit.vue')
    ,name: 'basetabandedit'
    ,path: '/basetabandedit'
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    //emailheck
    component: () => import(/* webpackChunkName: "test" */ '@/views/StreamLineDB.vue')
    ,name: 'streamline'
    ,path: '/streamline'
    ,meta: {layout: la[0], authentication: "public"}
  },      
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/EmailCheck.vue')
    ,name: 'EmailCheck'
    ,path: '/emailcheck'
    ,meta: {layout: la[0], authentication: "public"}
  },
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
  //{
  //  component: () => import(/* webpackChunkName: "test" */ '@/views/TestExpand.vue')
  //  ,name: 'TextExpand'
  //  ,path: '/expand'
  //  ,meta: {layout: la[0], authentication: "public"}
  //},      
  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/ViewLog.vue')
    ,name: 'ViewLog'
    ,path: '/userlist'
    ,meta: {layout: la[3], authentication: "public"}
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
    ,path: '/photos'
    ,meta: {layout: la[3], authentication: "public"}
  },      
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/awards/TestRoute.vue')
    ,name: 'TestRoute'
    ,path: '/tr/:chapterid/:storyid/:orderid'
    ,props: true
    ,meta: {layout: la[0], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "test" */ '@/views/ErrorPage.vue')
    ,name: 'ErrorPage'
    ,path: '*'
    ,meta: {layout: la[3], authentication: "public"}
  },  
]


const router = new VueRouter({
  mode: 'history',
  base: "/vschool/",    //This works : /zmltest/  but ./ does not work for layouts
  werner: 'werner',      //see if I can add my own stuff.
  routes
})

router.beforeEach((to, from,next) => {
  console.log('R - From.name, to.name |', from.name,'|', to.name,'|', from.path,'|', to.path);
  ////this.$cs.l('Auth Meta:', to.params);
  if (to.name == from.name) {
    if (to.params && to.params == from.params){
    //do nothing
    } else {
      next();
    }
  } else {
    /*
    if (to.name == 'Home' ) {
       if (getters.getState({ object:"gZml" }).login.isAuthenticated == true) {
            //this.$cs.l('Logged in : take hime to other home')
            next({name: 'About'})
        } else {
          next();
        }
    } else {
      */
    next();
  }
});

export default router
