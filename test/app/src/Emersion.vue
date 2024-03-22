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
</template>

<script setup>
import '../../../packages/live2dcubism2core.min.js';
import '../../../packages/live2dcubism4core.min.js';
import { Live2DModel } from 'pixi-live2d-display';
import * as PIXI from 'pixi.js';
import HelloWorld from './components/HelloWorld.vue';
// 复现  再现
async function loadModel() {
  window.PIXI = PIXI;
  PIXI.utils.skipHello();
  let canvas = document.createElement('canvas');
  let live2d = document.createElement('div');
  live2d.style.position = 'fixed';
  live2d.style.left = '0';
  live2d.style.bottom = '0';

  live2d.appendChild(canvas);
  document.body.appendChild(live2d);

  const app = new PIXI.Application({
    view: canvas,
    backgroundAlpha: 0,
    backgroundColor: 0x000000,
    resolution: 2,
    autoStart: true,
    autoDensity: true,
    resizeTo: live2d
  });
  
  // 移除上一个模型
  app.stage.removeChildren(0, app.stage.children.length);
  const model = await Live2DModel.from("https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%20girls%20Frontline/live2dold/old/kp31_/destroy/model.json");
  // transforms
  model.x = 0;
  model.y = 0;
  model.scale.set(0.15);
  app.stage.addChild(model);
  // interaction
  model.on('hit', async (hitAreas) => {
    await model.motion(`tap_${ hitAreas[0] }`) || await this.model.motion(hitAreas[0]);
  });
  
  live2d.style.width = canvas.style.width = `${model.width}px`;
  live2d.style.height = canvas.style.height = `${model.height}px`;
  app.resize();
}

loadModel();
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
