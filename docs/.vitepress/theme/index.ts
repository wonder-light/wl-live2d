import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue'; // h函数
import SwitchTheme from './components/switchTheme.vue';
import { live2d } from './helper/live2d';
import { isSSR } from './helper/meta.js';
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
  async enhanceApp({ app }) {
    if (!isSSR()) await live2d();
  }
} satisfies Theme;
