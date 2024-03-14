import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
// import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')