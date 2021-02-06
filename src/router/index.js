import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import MyPageView from '@/views/MyPageView'
import zmlDialog from '@/components/zmlDialog'
import Hover from '@/components/Hover'
import i18nTest from '@/components/i18nTest'
import EmptyRouterView from '@/components/EmptyRouterView'

import login from '@/components/Login'

Vue.use(VueRouter)

const la = ["AppLayoutDefault","AppLayoutBasic","AppLayoutBlue","AppLayoutGray"]

const routes = [
  {
    component: Home, path: '/',  name: 'Home',
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
    path: '/files', name: 'Files',
    meta: {layout: la[3], authentication: "learner" }
  },
  {
    component: () => import(/* webpackChunkName: "learn" */ '@/views/learn/viewLearn.vue'),
    path: '/viewlearn', name: 'ViewLearn',
    meta: {layout: la[3], authentication: "teacher" }
  },
  {
    component: () => import(/* webpackChunkName: "learn" */ '../views/Material.vue'),
    path: '/material/:heading',
    name: 'Material',
    props: true,
    meta: {layout: la[3], authentication: "learner" }
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
    next();
  }
});

export default router
