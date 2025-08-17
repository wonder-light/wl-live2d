import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue'; // h函数
import SwitchTheme from './components/switchTheme.vue';
import './custom.css';

/*------------------ runWithContext ------------------
------------------ setup ------------------
------------------ Layout ------------------*/

export default {
  extends: DefaultTheme,
  Layout() {
    return h(SwitchTheme, null, {
      // 这里是其他插槽组件
    });
  },
  setup() {},
  enhanceApp({ app }) {
    app.runWithContext(() => { });
  }
} satisfies Theme;
