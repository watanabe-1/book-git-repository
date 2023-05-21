import React from 'react';
import { Bar } from 'react-chartjs-2';
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
} from 'chart.js';
import { fontString } from 'chart.js/helpers';
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

/**
 * 棒グラフ
 *
 * @param data データ
 * @param date 日付け
 * @param middleTitle 真ん中に出す文字
 * @returns
 */
const BarChart = ({
  data,
  date,
  topTitle,
}: {
  data: ChartData<'bar'>;
  date: Date;
  topTitle: string;
}) => {
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
            //console.log(context);
            const label: string = context[0].label;
            return (
              label + '(' + date.getFullYear() + '/' + date.getMonth() + ')'
            );
          },
          label: function (context): string[] {
            const data: number[] = context.dataset.data as number[];
            const index: number = context.dataIndex;
            //金額(dataに定義した)の合計
            let dataSum: number = 0;
            data.forEach(function (element) {
              dataSum += element;
            });
            //割合(小数点なし)*1/1の値を両方10倍すると小数点の桁数が一つ増える
            const ratio: string =
              (Math.round((data[index] / dataSum) * 100 * 1) / 1).toString() +
              '%';
            //\xA5は円マークのこと
            const text: string = ratio + '  \xA5' + data[index];
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
  const plugins = [
    {
      id: 'studyBarChart',
      //棒の頭にラベルをつける
      afterDatasetsDraw: function (chart, easing) {
        const ctx: CanvasRenderingContext2D = chart.ctx;
        //console.log(ctx);
        chart.data.datasets.forEach(function (dataset, i) {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              //文字の色
              ctx.fillStyle = 'rgb(0, 0, 0)';

              const fontSize: number = 10;
              const fontStyle: string = 'normal';
              const fontFamily: string = 'Helvetica Neue';
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