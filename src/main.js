import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './stel/router.js'

//import VueFriendlyIframe from 'vue-friendly-iframe';
//Vue.component('vue-friendly-iframe', VueFriendlyIframe);

import AppLayout from '@/stel/layouts/AppLayout'
Vue.component('AppLayout', AppLayout)

Vue.config.productionTip = false


window.onerror = function(message, url, lineNumber) {
  alert(message + lineNumber + url)
  return true;
};

Vue.prototype.$playSound = (path, volume = .5) => {
  var audio = new Audio(path);
  audio.volume = volume
  audio.play();
}



// eslint-disable-next-line
Vue.prototype.$cs = {
  // eslint-disable-next-line
  l: (...args) => {
        console.log('mj',...args);
    },
  scrollToTop: (containerID) => {
      let e = document.getElementById(containerID || "app")
      if (e) { e.scrollIntoView({ behavior: "smooth" })} else { cs.l('ELEMENT DOES NOT EXIST')}
  },
}

<<<<<<< HEAD
Vue.component('BaseDate', () => import('@/components/base/BaseDate.vue') )

=======
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
Vue.prototype.$history = window.history;
//Vue.prototype.$cs = cs;
Vue.prototype.$super = Vue.observable({
  user: false,
  fullname: '',
  userid: '',
  message: 'message',
  test: 'test'
});
//Vue.prototype.$superUser = false;  //we will attempt to link this when we logged in
//Vue.prototype.$test = "This is a test message"  //we will attempt to link this when we logged in

// How to add components globally so all can see them - testing with small one
Vue.component('v-back', resolve => { require(['@/components/base/VBack.vue'], resolve) })


Vue.use(vuetify);
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
