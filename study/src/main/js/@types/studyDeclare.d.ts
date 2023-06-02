import { ChartType } from 'chart.js';

/**
 * chart.jsのプラグインtypeの拡張
 */
declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType = ChartType> {
    doughnutChart?: {
      title?: string;
    };
  }
}
