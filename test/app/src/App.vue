<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo"/>
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="assets/vue.svg" class="logo vue" alt="Vue logo"/>
    </a>
  </div>
  <HelloWorld msg="Vite + Vue"/>
  <div id="live2d-id"></div>
</template>

<script>
import { FBasePlugin, wlLive2d } from '../../../lib';
import HelloWorld from './components/HelloWorld.vue';

class Plugin extends FBasePlugin {

  name = 'testPlugin';
  
  install(live2d) {
    console.log('vue app install plugin');
  }

  uninstall(live2d) {}
}

export default {
  components: {
    HelloWorld
  },
  mounted() {
    const live2d = wlLive2d({
      sayHello: false,
      selector: '#live2d-id',
      plugins: [
        new Plugin()
      ]
    });
  }
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style>
#live2d-id > .live2d-wrapper {
  left: auto;
  right: 0;
}
</style>
