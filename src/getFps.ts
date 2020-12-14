import _ from 'lodash';

export interface FpsDataType {
  max: number;
  min: number;
  avg: number;
  duration: number;
}

interface onReport {
  (reportInfo: FpsDataType): void
}

/**
 * 统计 duration 时间内的 fps 情况
 * @param { function } onReport 回调函数
 * @param { number } duration 监控时间 ms
 */
export const getFPS = function getFPS(onReport: onReport, duration: number) {
  const startTime = performance.now();
  let frameStartTime = performance.now();
  let frameCount = 0;

  const fpsList: number[] = [];
  let watcherId;

  const getReportInfo = fpsList => {
    const avgFps = Math.round(
      fpsList.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / fpsList.length,
    );

    return {
      max: _.max(fpsList),
      min: _.min(fpsList),
      avg: avgFps,
      duration,
    };
  };

  const watchFps = () => {
    const now = performance.now();
    const frameGap = now - frameStartTime;

    frameCount++;

    if (now - startTime > duration) {
      const fpsInfo = getReportInfo(fpsList);

      onReport(fpsInfo);

      if (watcherId) {
        window.cancelAnimationFrame(watcherId);
      }
    } else {
      // 废弃第一帧，因为调用该函数时，上一帧不一定刚好执行完备了
      if (frameCount !== 1) {
        // 每隔 500 ms 计算一次 fps
        if (frameGap >= 500) {
          const fps = Math.round((frameCount / frameGap) * 1000);

          fpsList.push(fps);

          frameStartTime = performance.now();
          frameCount = 0;
        }
      }

      watcherId = window.requestAnimationFrame(watchFps);
    }
  };

  watcherId = window.requestAnimationFrame(watchFps);
};
