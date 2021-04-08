import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

//import VueFriendlyIframe from 'vue-friendly-iframe';
//Vue.component('vue-friendly-iframe', VueFriendlyIframe);

import AppLayout from '@/layouts/AppLayout'
Vue.component('AppLayout', AppLayout)

Vue.config.productionTip = false

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import VueHtmlToPaper from 'vue-html-to-paper';
const paperOptions = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}
Vue.use(VueHtmlToPaper, paperOptions);

// eslint-disable-next-line
export const cs = {
  // eslint-disable-next-line
  l: (...args) => {   
    // console.log(...args);   
    }
}



Vue.prototype.$history = window.history;
Vue.prototype.$cs = cs;

import { af,en } from '@/api/translate'
const messages = {
  en,
  af
}
let i18n = new VueI18n({
  locale: 'af',
  fallbackLocale: 'en',
  formatFallbackMessages: true,
  messages: messages
})

new Vue({
  i18n,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
