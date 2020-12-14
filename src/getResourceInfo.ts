import _ from 'lodash';

type PerfMonitorResourceType = {
  type: string,
  href: string,
  originHref: string,
  duration: number
}

type ResourceInfoConfig = {
  bufferSize?: number,
  wait?: number,
}

interface onReportType {
  (perfData: PerfMonitorResourceType[]): void
}

const processData = (perfData: PerformanceEntryList): PerfMonitorResourceType[] => {
  return perfData.map(data => {
    // @ts-ignore
    const { duration, initiatorType, name } = data;
    const href = _.get(_.split(name, '?'), '0');

    return {
      type: initiatorType,
      originHref: name,
      href,
      duration,
    }
  });
}

const getResourceInfo = (onReport: onReportType = _.noop, config: ResourceInfoConfig = {}) => {
  if (PerformanceObserver) {
    const DEFAULT_BUFF_SIZE = 20;
    const DEFAULT_WAIT = 3000;
    const { bufferSize = DEFAULT_BUFF_SIZE, wait = DEFAULT_WAIT } = config;

    let startTime = performance.now();
    let perf_data_buffer: PerformanceEntryList = [];

    const perf_observer_cb: PerformanceObserverCallback = (list: PerformanceObserverEntryList, observer) => {
      const perfEntries = list.getEntries();

      perf_data_buffer.push(...perfEntries);

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (perf_data_buffer.length >= bufferSize || duration > wait) {
        const resData = processData(perf_data_buffer);

        onReport(resData);

        perf_data_buffer = [];
        startTime = performance.now();
      }
    };

    const perf_observer: PerformanceObserver = new PerformanceObserver(perf_observer_cb);

    perf_observer.observe({ entryTypes: ['resource'] });
  } else {
    throw Error('暂不支持 performance 接口');
  }
}

export { getResourceInfo };