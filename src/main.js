import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

import AppLayout from '@/layouts/AppLayout'
Vue.component('AppLayout', AppLayout)

Vue.config.productionTip = false

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

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
