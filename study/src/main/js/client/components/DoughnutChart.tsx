import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Plugin,
} from 'chart.js';
import { fontString } from 'chart.js/helpers';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { AnyObject } from 'yup';

import { isObjEmpty } from '../../study/util/studyUtil';

// チャート内で使用するものを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type DoughnutChartProps = {
  /** データ */
  data: ChartData<'doughnut'>;
  /** 日付 */
  date: Date;
  /** 真ん中に出す文字 */
  middleTitle: string;
};

/**
 * ドーナツ図
 *
 * @returns
 */
const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  date,
  middleTitle,
}) => {
  const title = isObjEmpty(data.datasets[0].data)
    ? 'データがありません'
    : middleTitle;
  //console.log(`DoughnutChart title:${title}`);
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      //ラベルはいらないので削除
      legend: {
        display: false,
        position: 'left',
      },
      //マウスオーバーした時に表示されるツールチップの内容の改変
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function (): string {
            return `${date.getFullYear()}/${date.getMonth()}`;
          },
          //bodyの方が見栄えが良さそうなのでafterLabelから変更
          afterBody: function (context): string[] {
            const data = context[0].dataset.data as number[];
            const index = context[0].dataIndex;
            const label = context[0].label;
            //金額(dataに定義した)の合計
            const dataSum = data.reduce((sum, num) => sum + num);
            //割合(小数点なし)*1/1の値を両方10倍すると小数点の桁数が一つ増える
            const ratio = Math.round((data[index] / dataSum) * 100 * 1) / 1;
            //\xA5は円マークのこと
            const text = `${label}:${ratio}%  \xA5${data[index]}`;
            return [text];
          },
        },
      },
      doughnutChart: {
        title: title,
      },
    },
  };
  const plugins: Plugin<'doughnut', AnyObject>[] = [
    {
      id: 'doughnutChart',
      // 真ん中に表示する
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, width, height },
        } = chart;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(width / 2, top + height / 2, 0, 0);
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        //表示する文字(options内で設定している値を参照)
        ctx.fillText(options.title, width / 2, top + height / 2);
      },
      //ラベルをつける
      afterDatasetsDraw: function (chart) {
        const ctx: CanvasRenderingContext2D = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              //文字の色
              ctx.fillStyle = 'rgb(255, 255, 255)';

              const fontSize = 16;
              const fontStyle = 'normal';
              const fontFamily = 'Helvetica Neue';
              ctx.font = fontString(fontSize, fontStyle, fontFamily);

              const dataString: string = chart.data.labels[index] as string; //+ ' : ' + dataset.data[index].toString();

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              const padding = 5;
              const position = element.tooltipPosition(true);
              ctx.fillText(
                dataString,
                position.x,
                position.y - fontSize / 2 - padding
              );
            });
          }
        });
      },
    },
  ];

  return <Doughnut data={data} options={options} plugins={plugins} />;
};

export default DoughnutChart;
