# Vedio 二次封装组件

`video.js: ^7.20.2`

> vediojs 播放 m3u8/mp4 格式的视频

# 使用

## 注册

```js
// main.js
import useVedio from "./components/Video/use.js";
Vue.use(useVedio);
```

## 在组件中使用

`只需要传入2个参数`

```html
<VedioPlugin :urls="urls" :splitP="splitP"></VedioPlugin>
```

```js
import VedioPlugin from "../../components/Video/index.vue";
data(){
    return {
        urls: [{ url: "asd", label: "test" }],  // 视频源数组
        splitP: 1                              // 多少分屏
    }
}
```
