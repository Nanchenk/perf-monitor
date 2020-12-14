# front-end performance monitor

## 目的

提供统一的衡量口径，去收集前端的性能指标，方便统一进行判断。

## 使用

```typescript
import { getCLS, getFID, getLCP, getFCP, getTTFB, getReadyInfo, getResourceInfo, getFPS, uuid } from 'perf-montior';

// web-vitals's function
getCLS(console.log, reportAllChanges?: boolean));
getLCP(console.log, reportAllChanges?: boolean));

getFID(console.log); // Does not take a `reportAllChanges` param
getFCP(console.log);
getTTFB(console.log);
uuid();

/**
 * performance's function
 * you can get the following information by perfMertirc
 * perfMertirc {
 *  // 页面加载完成的时间，包含异步代码与资源
 *  loaded
 *  // html文档加载完毕，并且 html 所引用的内联 js、以及外链 js 的同步代码都执行完毕后触发。
 *  domContentLoaded
 *  // DOM 从请求的数据返回后，解析所需要经历的时间，网页内资源加载完成并且准备就绪的时间
 *  domReady
 *  // 页面重定向耗费的时间
 *  redirect
 *  // DNS 查询时间
 *  DNS
 *  // 读取页面第一个字节的时间
 *  ttfb
 *  // 资源请求完成的时间
 *  request
 *  // 资源响应完成的时间
 *  response
 *  // 执行 onload 回调函数的时间
 *  onLoad
 *  // DNS 缓存时间
 *  appcache
 *  // 卸载页面的时间
 *  unload
 *  // TCP 建立连接完成握手的时间
 *  TCP
 *  // 页面经过了多少次重定向
 *  redirectCount
 *  // 页面进入的方式
 *  type
 *  // 页面的被使用方式
 *  useType
 *  href
 *  referrer
 *  // 服务端耗时
 *  serverTime
 *  // 前端耗时
 *  frontEndTime
 * }
 **/
getReadyInfo((perfMertirc) => {
});

getResourceInfo(console.log, { bufferSize:20, wait: 2000 });
```

## Browser Support

This code has been tested and will run without error in all major browsers as well as Internet Explorer back to version 9 (when transpiled to ES5). However, some of the APIs required to capture these metrics are only available in Chromium-based browsers (e.g. Chrome, Edge, Opera, Samsung Internet).

Browser support for each function is as follows:

- getCLS(): Chromium  
- getFCP(): Chromium  
- getFID(): Chromium, Firefox, Safari, Internet Explorer (with polyfill, see below)  
- getLCP(): Chromium  
- getTTFB(): Chromium, Firefox, Safari, Internet Explorer  

更多的信息参考 [web-vitals](https://github.com/GoogleChrome/web-vitals)