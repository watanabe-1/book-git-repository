import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import { isObjEmpty } from '../../../../study/util/studyUtil';

// チャート内で使用するものを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type BarAndLineChartProps = {
  /** データ */
  data: ChartData<'bar'>;
  /** 上に出す文字 */
  topTitle: string;
};

/**
 * ホライゾンバーとラインチャート
 *
 * @returns
 */
const BarAndLineChart: React.FC<BarAndLineChartProps> = ({
  data,
  topTitle,
}) => {
  const title = isObjEmpty(data.datasets[0].data)
    ? 'データがありません'
    : topTitle;
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: title,
      },
      //マウスオーバーした時に表示されるツールチップの内容の改変
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function (context) {
            //console.log(context);
            return context[0].label;
          },
          label: function (context) {
            const data = context.dataset.data as number[];
            const index = context.dataIndex;
            //\xA5は円マークのこと
            const text = `${context.dataset.label}：\xA5${data[index]}`;
            return [text];
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarAndLineChart;
