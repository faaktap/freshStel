import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import MyPageView from '@/views/MyPageView'
import zmlDialog from '@/components/zmlDialog'
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
    path: '/',  name: 'Home',
    meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    path: '/about', name: 'About',
    meta: {layout: la[3], authentication: "public" }
  },
  {
    path: '/hover', 
    component:EmptyRouterView,
    children:[{
      name: 'Hover',
      path: '', 
      component: Hover,
      meta: {layout: la[3], authentication: "learner"}
    }]
  },
  { 
    //Actual award!
    path: '/virtualawards',
    name: 'prizes',
    component: () => import(/* webpackChunkName: "about" */ '../views/awards/Prizes.vue'),
    meta: {layout: la[1], authentication: "public" }
  },  
  {
    path: '/studentawards',
    name: 'studentawards',
    component: () => import(/* webpackChunkName: "awards" */ '../views/awards/StudentAwardTable.vue'),
    meta: {layout: la[1], authentication: "public" }
  },  
  {
    component: () => import(/* webpackChunkName: "learn" */ '../views/learn/LearnTree.vue'),
    path: '/learntree', 
    name: 'LearnTree',
    meta: {layout: la[3], authentication: "learner" },
    props: {default:true},
    params: {currentSubjectID:'2', grade:'12'}
  },
  {
    component: () => import(/* webpackChunkName: "learn" */ '@/views/learn/viewLearn.vue'),
    path: '/viewlearn', name: 'ViewLearn',
    meta: {layout: la[3], authentication: "teacher" },
    children: [
           //editItem component is rendered when /user/:id is matched
           { path: ':id'
            , component: () => import(/* webpackChunkName: "learn1" */ '@/views/learn/editItem.vue')
            , props: {default:true}, }
              ]
  },
  {
    component: () => import(/* webpackChunkName: "learn" */ '../views/learn/Grade.vue'),
    path: '/grade',
    name: 'Grade',
    props: true,
    meta: {layout: la[3], authentication: "learner" }
  },    
  {
    component: () => import(/* webpackChunkName: "learn" */ '../views/learn/SelectGrade.vue'),
    path: '/grade/:gradeno',
    name: 'SelectGrade',
    props: true,
    params: {heading: 'Grade', gradeno:10},
    meta: {layout: la[3], authentication: "learner" }
  },  
  {
    component: () => import(/* webpackChunkName: "learn" */ '@/views/learn/StudentHub.vue'),
    path: '/studenthub',
    name: 'StudentHub',
    props: true,
    params: {currentSubjectID:'2', grade:'12'},
    meta: {layout: la[3], authentication: "learner" }
  },
  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/student/StudentInfo.vue'),
    path: '/student',
    name: 'StudentInfo',
    meta: {layout: la[3], authentication: "admin" }
  },  
  {
    component: () => import(/* webpackChunkName: "admin" */ '@/views/student/PersonelInfo.vue'),
    path: '/personel',
    name: 'PersonelInfo',
    meta: {layout: la[3], authentication: "admin" }
  },    
  {
    path: '/nested',
    component: EmptyRouterView,
    children: [{
        name: 'nested',
        path: '',
        component: MyPageView,
        meta: {layout: la[3]}
    }, {
        name: 'nested.dialog',
        path: 'dialog',
        meta: {layout: la[3]},
        components: {
            default: MyPageView,
            dialog: zmlDialog
        }
    }],
  },
  {
    component: i18nTest,path: '/translate', name: 'Translate',
    meta: {layout: la[3]}
  },
  {
    component: login,path: '/login', name: 'Login',
    meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "learn" */ '@/views/RouteTest.vue')
    ,name: 'WernerNoParm'
    ,path: '/werner'
    ,meta: {layout: la[3], authentication: "public"}
  },
  {
     component: () => import(/* webpackChunkName: "learn" */ '@/views/RouteTest.vue')
    ,name: 'Werner'
    ,path: '/werner/:id'
    ,props: true 
    ,params:{ id:33, post: "sadfpkpokepoer poker" }
    ,meta: {layout: la[3], authentication: "public"}
    ,alias: '/smit/:id' 
    ,children: [
      // UserHome will be rendered inside User's <router-view>
      // when /user/:id is matched
      { path: 'route1/:rid'
        , name: 'Route1'
        , props: true
        , component: () => import(/* webpackChunkName: "learn" */ '@/views/Route1.vue') 
        , meta: {layout: la[3], authentication: "public"}
        , params:{ rid: 120, rpost: "sdfsdfsdfsdfsdf" }
      },

      // ...other sub routes
    ]
  }
    
]


const router = new VueRouter({
  mode: 'history',
  base: "/virtual-school/",    //This works : /zmltest/  but ./ does not work for layouts
  routes
})

router.beforeEach((to, from,next) => {
  console.log('R - From.name, to.name |', from.name,'|', to.name,'|', from.path,'|', to.path);
  console.log('Auth Meta:', to.params);
  if (to.name == from.name) {
    if (to.params && to.params == from.params){
    //do nothing
    } else {
      next();
    }
  } else {
    if (to.name == 'Home' ) {
       if (getters.getState({ object:"gZml" }).login.isAuthenticated == true) {
          if (getters.getState({ object:"gZml" }).login.type == 'student') {
            console.log('we need to take him to student home')
            next({name: 'About'})
          } else {
            console.log('we need to take him to TEACHER home')
            next({name: 'About'})
          }
        } else {
          next();
        }
    } else {
    next();
    }
  }
});

export default router
