import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Plugin,
} from 'chart.js';
import { fontString } from 'chart.js/helpers';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { AnyObject } from 'yup';

import { isObjEmpty } from '../../study/util/studyUtil';

// チャート内で使用するものを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type BarChartProps = {
  /** データ */
  data: ChartData<'bar'>;
  /** 日付 */
  date: Date;
  /** 上に出す文字 */
  topTitle: string;
};

/**
 * 棒グラフ
 *
 * @returns
 */
const BarChart: React.FC<BarChartProps> = ({ data, date, topTitle }) => {
  const title = isObjEmpty(data.datasets[0].data)
    ? 'データがありません'
    : topTitle;
  const maxData: number = Math.max(...(data.datasets[0].data as number[]));
  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    //縦横の比率を自動的に調整するか-いったん縦軸を長くしたいのでfalse
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        suggestedMin: 0,
        //棒の先に金額を表示したところ、そのままだと見切れてしまうことがあった
        //そのため最大値を少しあげることで、余白を作るようにし見切れるのを防止
        suggestedMax: maxData / 10 + maxData,
        beginAtZero: true,
        /*間隔を指定
          ticks: {
              stepSize: 10000,
          }
          */
      },
      y: {
        ticks: {
          crossAlign: 'far',
        },
      },
    },
    plugins: {
      //ラベルはいらないので削除
      legend: {
        display: false,
        position: 'right',
      },
      //マウスオーバーした時に表示されるツールチップの内容の改変
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function (context): string {
            return `${context[0].label}(${date.getFullYear()}/${
              date.getMonth() + 1
            })`;
          },
          label: function (context): string[] {
            const data = context.dataset.data as number[];
            const index = context.dataIndex;
            //金額(dataに定義した)の合計
            const dataSum = data.reduce((sum, num) => sum + num);
            //割合(小数点なし)*1/1の値を両方10倍すると小数点の桁数が一つ増える
            const ratio = Math.round((data[index] / dataSum) * 100 * 1) / 1;
            //\xA5は円マークのこと
            const text = `${ratio}%  \xA5${data[index]}`;
            return [text];
          },
        },
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
  const plugins: Plugin<'bar', AnyObject>[] = [
    {
      id: 'studyBarChart',
      //棒の頭にラベルをつける
      afterDatasetsDraw: function (chart) {
        const ctx: CanvasRenderingContext2D = chart.ctx;
        //console.log(ctx);
        chart.data.datasets.forEach(function (dataset, i) {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              //文字の色
              ctx.fillStyle = 'rgb(0, 0, 0)';

              const fontSize = 10;
              const fontStyle = 'normal';
              const fontFamily = 'Helvetica Neue';
              ctx.font = fontString(fontSize, fontStyle, fontFamily);

              const dataString: string =
                ' \xA5' + dataset.data[index].toString();
              //文字列の位置の基準点
              //start, end, left, right, center
              ctx.textAlign = 'start';
              //middle, top, bottom
              ctx.textBaseline = 'middle';

              const position = element.tooltipPosition(true);
              ctx.fillText(dataString, position.x, position.y);
            });
          }
        });
      },
    },
  ];

  return <Bar data={data} options={options} plugins={plugins} />;
};

export default BarChart;
