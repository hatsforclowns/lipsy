import Vue from "vue";
import Vuetify from "vuetify/lib";
import styl from "../stylus/_variables.styl";

Vue.use(Vuetify, {
  theme: {
    primary: styl.colourPrimary,
    secondary: styl.colourSecondary
  },
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
});
