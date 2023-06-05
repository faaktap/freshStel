import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeStart from '@/stel/HomeStart'

import { getters } from "@/stel/store";
import { zmlLog } from '@/stel/zmlLog.js';

Vue.use(VueRouter)

const la = ["AppLayoutDefault","AppLayoutBasic","AppLayoutBlue","AppLayoutGray","AppLayoutDrawer"]

const routes = [
   {
    component: HomeStart,
    path: '/',
    name: 'HomeStart',
    meta: {layout: la[3],
    authentication: "public"}
  },
  {
    path: '/register/:surveyidPassed',
    name: 'register',
    props:true,
    params: {surveyidPassed: '20113'},
    component: () => import(/* webpackChunkName: "venue" */ '@/stel/register.vue'),
    meta: {layout: la[0], authentication: "public" }
  },
  {
    path: '/venue/:surveyidPassed',
    name: 'Venue',
    props:true,
    params: {surveyidPassed: '4'},
    component: () => import(/* webpackChunkName: "venue" */ '@/stel/Venue.vue'),
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/stel/About.vue'),
    path: '/about', name: 'About',
    meta: {layout: la[0], authentication: "werner" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/stel/vfbase/vfbasetest.vue'),
    path: '/vfbasetest', name: 'vfBaseTest',
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/stel/Calendar.vue'),
    path: '/calendar', name: 'Calendar',
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/stel/CurrentTime.vue'),
    path: '/currenttime', name: 'CurrentTime',
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "home" */ '@/stel/AutoRoute.vue'),
    path: '/ar',
    name: 'AutoRoute',
    meta: {layout: la[3], authentication: "public"}
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/stel/Test.vue'),
    path: '/test', name: 'Test',
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/components/picload/CameraButton.vue'),
    path: '/cameratest', name: 'CameraTest',
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/components/picload/Enroll.vue'),
    path: '/enroll', name: 'Enroll',
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/stel/StreamLineDB.vue'),
    path: '/streamline', name: 'StreamLineDB',
    meta: {layout: la[0], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/stel/single.vue'),
    path: '/single', name: 'single',
    meta: {layout: la[3], authentication: "public" }
  },
  {
    component: () => import(/* webpackChunkName: "error" */ '@/stel/ErrorPage.vue')
    ,name: 'ErrorPage'
    ,path: '*'
    ,meta: {layout: la[0], authentication: "public"}
  },
]

import { publicPath } from '../../vue.config'
import { ls } from '@/stel/localStorage.js'
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      console.log(to,from,savedPosition)
    }
  },
  mode: 'history',
  base: publicPath, //'virtual-school',    //This works : /zmltest/  but ./ does not work for layouts
  werner: 'werner',      //see if I can add my own stuff.
  routes
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
    //Vue.prototype.$cs.l('R - Auth Meta:', to.meta.authentication,userAuth, userType);
    if (to.meta.authentication != 'public' && userAuth == false && to.name != 'Login') {
      //Vue.prototype.$cs.l('R - ForceLogin')
      next({name: 'Login', meta:{message:'Bad Authentication for ' + to.name}})
    } else if (to.meta.authentication == 'teacher' && userType == 'student' && to.name != 'Login') {
      //Vue.prototype.$cs.l('R - ForceLogin - student not allowed')
      next({name: 'Login'
          , props: { errorMessage: 'there was an error' }
          , meta:{message:'Bad Authentication for ' + to.name}})
    }
    else if (to.meta.authentication == 'admin' && userType == 'student' && to.name != 'Login') {
      //Vue.prototype.$cs.l('R - ForceLogin - student not allowed')
      next({name: 'Login'
          , props: { errorMessage: 'there was an error' }
          , meta:{message:'Bad Authentication for ' + to.name}})
    }
    else {
      //Vue.prototype.$cs.l('R - Just Next', to)
      next();
    }
  }
});

export default router
