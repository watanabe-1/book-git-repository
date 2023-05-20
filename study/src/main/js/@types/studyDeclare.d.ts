import { ChartType, Plugin } from 'chart.js';

/**
 * chart.jsのプラグインtypeの拡張
 */
declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType = ChartType> {
    doughnutChart?: {
      title?: string;
    };
  }
}
