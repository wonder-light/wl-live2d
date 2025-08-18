export const live2d = async function () {
  let model = await import('https://fastly.jsdelivr.net/npm/wl-live2d/dist/es/index.js') as any;
  model.wlLive2d({
    models: [
      {
        path: 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2/yiselin/model.json',
        scale: 0.7
      },
      {
        path: 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%20girls%20Frontline/live2dold/old/kp31/normal/model.json',
        scale: 0.5
      }
    ]
  });
};
