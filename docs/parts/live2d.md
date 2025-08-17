```js
import { wlLive2d } from 'wl-live2d';

wlLive2d({
  models: [
    {
      path: 'https://fastly.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json',
      position: { x: -10, y: 20 }
    }
  ]
})
```

```html
<script type="module">
  import { wlLive2d } from 'wl-live2d';
  
  wlLive2d({
    models: [
      {
        path: 'https://fastly.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json',
        position: { x: -10, y: 20 }
      }
    ]
  })
</script>
```
