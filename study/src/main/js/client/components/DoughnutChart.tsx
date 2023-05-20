import React from 'react';
import { Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';
import { fontString } from 'chart.js/helpers';
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

/**
 * ドーナツ図
 *
 * @param data データ
 * @param date 日付け
 * @param middleTitle 真ん中に出す文字
 * @returns
 */
const DoughnutChart = ({
  data,
  date,
  middleTitle,
}: {
  data: ChartData<'doughnut'>;
  date: Date;
  middleTitle: string;
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
          label: function (context): string {
            return date.getFullYear() + '/' + date.getMonth();
          },
          //bodyの方が見栄えが良さそうなのでafterLabelから変更
          afterBody: function (context): string[] {
            const data: number[] = context[0].dataset.data as number[];
            const index: number = context[0].dataIndex;
            const label: string = context[0].label;
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
            const text: string = label + ':' + ratio + '  \xA5' + data[index];
            return [text];
          },
        },
      },
      doughnutChart: {
        title: title,
      },
    },
  };
  const plugins = [
    {
      id: 'doughnutChart',
      // 真ん中に表示する
      beforeDraw(chart, argsAny, options) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
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
      afterDatasetsDraw: function (chart, easing) {
        const ctx: CanvasRenderingContext2D = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              //文字の色
              ctx.fillStyle = 'rgb(255, 255, 255)';

              const fontSize: number = 16;
              const fontStyle: string = 'normal';
              const fontFamily: string = 'Helvetica Neue';
              ctx.font = fontString(fontSize, fontStyle, fontFamily);

              const dataString: string = chart.data.labels[index] as string; //+ ' : ' + dataset.data[index].toString();

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              const padding: number = 5;
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
