import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  icons: {
    dropdown: {
      component: "iconChevronDown"
    },
    checkboxOff: {
      component: "IconSquare"
    },
    checkboxOn: {
      component: "IconCheckSquare"
    }
  }
