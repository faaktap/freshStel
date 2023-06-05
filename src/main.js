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
export const cs = {
  // eslint-disable-next-line
  l: (...args) => {
       // console.log(...args);
    },
  scrollToTop: (containerID) => {
      let e = document.getElementById(containerID || "app")
      if (e) { e.scrollIntoView({ behavior: "smooth" })} else { cs.l('ELEMENT DOES NOT EXIST')}
  }
}

Vue.component('BaseDate', () => import('@/components/base/BaseDate.vue') )

Vue.prototype.$history = window.history;
Vue.prototype.$cs = cs;


Vue.use(vuetify);
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
