import Vue from "vue";

// Vuetify
import "./plugins/vuetify";
import "./stylus/_settings.styl";

// Circular font
import "./fonts/_circular.scss";

// Feather icons
import {
  RefreshCcwIcon,
  ClipboardIcon,
  ChevronDownIcon,
  SquareIcon,
  CheckSquareIcon
} from "vue-feather-icons";
Vue.component("IconRefresh", RefreshCcwIcon);
Vue.component("IconClipboard", ClipboardIcon);
Vue.component("IconChevronDown", ChevronDownIcon);
Vue.component("IconSquare", SquareIcon);
Vue.component("IconCheckSquare", CheckSquareIcon);

// Clipboard integration lib
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

// App
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
