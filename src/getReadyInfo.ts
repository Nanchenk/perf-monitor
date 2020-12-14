import _ from 'lodash';
import { getTTFB, Metric } from 'web-vitals';

type UseType = 'direct' | 'embed';

export interface ReadyDataType {
  /** 页面加载完成的时间，包含异步代码与资源 */
  loaded: number;
  /** html文档加载完毕，并且引用的内联 js、以及外链 js 的同步代码都执行完毕后触发。 */
  domContentLoaded: number;
  /** DOM 从请求的数据返回后，解析所需要经历的时间，网页内资源加载完成并且准备就绪的时间 */
  domReady: number;
  /** 页面重定向耗费的时间 */
  redirect: number;
  /** DNS 查询时间 */
  DNS: number;
  /** 读取页面第一个字节的时间 */
  ttfb: number;
  /** 资源请求完成的时间 */
  request: number;
  /** 资源响应完成的时间 */
  response: number;
  /** 执行 onload 回调函数的时间 */
  onLoad: number;
  /** DNS 缓存时间 */
  appcache: number;
  /** 卸载页面的时间 */
  unload: number;
  /** TCP 建立连接完成握手的时间 */
  TCP: number;
  /** 页面经过了多少次重定向 */
  redirectCount: number;
  /** 页面进入的方式 */
  type: string;
  /** 页面的被使用方式 */
  useType: UseType;
  /** 直连的链接 */
  href: string;
  /** 嵌入的链接 */
  referrer: string;
  /** 服务端耗时 */
  serverTime: number;
  /** 前端耗时 */
  frontEndTime: number;
};

interface onReportType {
  (perfData: ReadyDataType): void
}

const getUseType = () => {
  const res: {
    useType: UseType,
    href: string,
    referrer: string,
  } = {
    useType: 'direct',
    href: '',
    referrer: '',
  };

  if (window.self === window.top) {
    res.useType = 'direct';
    res.href = _.get(location, 'href', '');
  } else {
    res.useType = 'embed';
    res.referrer = _.get(document, 'referrer', '');
  }

  return res;
};

const processData = (onReport: onReportType) => {
  return (metric: Metric) => {
    const useTypeInfo = getUseType();
    const pt: PerformanceNavigationTiming = _.get(metric, 'entries.0');

    const perfData = {
      loaded: pt.loadEventEnd - pt.startTime,
      domContentLoaded: pt.domContentLoadedEventEnd - pt.startTime,
      redirect: pt.redirectEnd - pt.redirectStart,
      appcache: pt.domainLookupStart - pt.fetchStart,
      DNS: pt.domainLookupEnd - pt.domainLookupStart,
      TCP: pt.connectEnd - pt.connectStart,
      request: metric.value - pt.requestStart,
      response: pt.responseEnd - pt.responseStart,
      domReady: pt.domComplete - pt.responseEnd,
      onLoad: pt.loadEventEnd - pt.loadEventStart,
      unload: pt.unloadEventEnd - pt.unloadEventStart,
      ttfb: metric.value,
      redirectCount: pt.redirectCount,
      type: pt.type,
      useType: useTypeInfo.useType,
      href: useTypeInfo.href,
      referrer: useTypeInfo.referrer,
      serverTime: pt.responseEnd - pt.startTime,
      frontEndTime: pt.loadEventEnd - pt.responseEnd,
    };

    onReport(perfData);
  };
};


/** prompt for unload => redirect => App cache => DNS => TCP => Request => Response => Processing => onLoad => Unload */
export const getReadyInfo = (onReport: onReportType = _.noop) => {
  if (!window.performance) {
    throw new Error('performance is undefined');
  }

  getTTFB(processData(onReport));
};