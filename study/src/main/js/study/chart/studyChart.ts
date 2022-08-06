import * as studyUtil from './../util/studyUtil';
import Chart, {
  BubbleDataPoint,
  ChartData,
  ChartTypeRegistry,
  ScatterDataPoint,
} from 'chart.js/auto';
import { fontString } from 'chart.js/helpers';

/**
 * ドーナツチャート
 *
 * @param {ChartData} jsonData chartのdataに使用
 * @param {string[]} args 表示などに使用
 */
export function doughnutChart(jsonData: ChartData, args: string[]): Chart {
  const doughnutChart: HTMLCanvasElement = document.getElementById(
    args[0]
  ) as HTMLCanvasElement;
  if (jsonData.datasets[0].data.length === 0) {
    //console.log(jsonData.datasets[0].data)
    args[1] = 'データがありません';
  }
  //描画
  return new Chart(doughnutChart, {
    type: 'doughnut',
    data: jsonData,
    /*
    data: {
      labels: ['項目1', '項目2', '項目3', '項目4'],
      datasets: [
        {
          data: [10000, 20000, 3000, 4000],
          backgroundColor: [
            'rgba(255, 112, 166, 0.5)',
            'rgba(255, 151, 112, 0.5)',
            'rgba(255, 214, 112, 0.5)',
            'rgba(112, 214, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 112, 166, 1)',
            'rgba(255, 151, 112, 1)',
            'rgba(255, 214, 112, 1)',
            'rgba(112, 214, 255, 1)',
          ],
        },
      ],
    },
    */
    options: {
      responsive: true,

      plugins: {
        //ラベルはいらないので削除
        legend: {
          display: false,
          position: 'left',
        },
        /*
        title: {
          display: true,
          text: '円グラフ',
          position: 'top',
          align: 'center',
        },
        */
        /*
        centerAndEachLabel: {
          fontColor: 'red',
          fontSize: '50px',
          fontFamily: 'sans-serif',
        },
        */
        //マウスオーバーした時に表示されるツールチップの内容の改変
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label: function (context): string {
              //dateパラメーターが設定されていたらそれを、設定されていなかったら本日の日付を設定
              //studyUtil.getStudyDate()の呼び出し
              const date: Date = studyUtil.getStudyDate();
              return date.getFullYear() + '/' + date.getMonth();
            },
            /*
            afterLabel: function (context) {
              const data = context.dataset.data;
              const index = context.dataIndex;
              //金額(dataに定義した)の合計
              let dataSum = 0;
              data.forEach(function (element) {
                dataSum += element;
              });
              //割合(小数点以下1桁まで)
              const ratio =
                (
                  Math.round((data[index] / dataSum) * 100 * 10) / 10
                ).toString() + '%';
              //\xA5は円マークのこと
              const label =
                context.label + ':' + ratio + '  \xA5' + data[index];
              return [label];
            },
            */
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
      },
    },
    plugins: [
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

          // 位置調整
          //console.log("width", width);
          //console.log("height", height);
          //console.log("top", top);
          //console.log("width / 2, top + (height / 2)", width / 2, top + (height / 2));

          //表示する文字
          ctx.fillText(args[1], width / 2, top + height / 2);
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
                const position = element.tooltipPosition();
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
    ],
  });
}

/**
 * ホライゾンバーチャート
 *
 * @param {ChartData} jsonData chartのdataに使用
 * @param {string[]} args 表示などに使用
 */
export function barChart(jsonData: ChartData, args: string[]): Chart {
  const barChart: HTMLCanvasElement = document.getElementById(
    args[0]
  ) as HTMLCanvasElement;
  //console.log(jsonData);
  //console.log(jsonData.datasets[0].data);
  const maxData: number = Math.max(...(jsonData.datasets[0].data as number[]));
  //console.log(maxData);
  if (jsonData.datasets[0].data.length === 0) {
    //console.log(jsonData.datasets[0].data)
    args[1] = 'データがありません';
  }
  //描画
  return new Chart(barChart, {
    type: 'bar',
    data: jsonData,
    options: {
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
              //dateパラメーターが設定されていたらそれを、設定されていなかったら本日の日付を設定
              //studyUtil.getStudyDate()の呼び出し
              const date: Date = studyUtil.getStudyDate();
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
          text: args[1],
        },
      },
    },
    plugins: [
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

                const position = element.tooltipPosition();
                ctx.fillText(dataString, position.x, position.y);
              });
            }
          });
        },
      },
    ],
  });
}

/**
 * ホライゾンバーチャート
 *
 * @param {ChartData} jsonData chartのdataに使用
 * @param {string[]} args 表示などに使用
 */
export function barAndLineChart(jsonData: ChartData, args: string[]) {
  const barAndLineChart: HTMLCanvasElement = document.getElementById(
    args[0]
  ) as HTMLCanvasElement;
  if (jsonData.datasets[0].data.length === 0) {
    //console.log(jsonData.datasets[0].data)
    args[1] = 'データがありません';
  }
  //console.log(config);
  //描画
  return new Chart(barAndLineChart, {
    type: 'bar',
    data: jsonData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: args[1],
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
              const data: number[] = context.dataset.data as number[];
              const index: number = context.dataIndex;
              //\xA5は円マークのこと
              const text: string =
                context.dataset.label + '：\xA5' + data[index];
              return [text];
            },
          },
        },
      },
    },
  });
}

/**
 * ドーナツチャートの表示データを更新
 *
 * @param {ChartData} jsonData 置き換えるデータ
 * @param {Chart} chart 更新対象
 */
export function updateDataDoughnut(jsonData: ChartData, chart: Chart) {
  chart.data = jsonData;
  chart.update();
}

/**
 * ホライゾンバーチャートの表示データを更新
 *
 * @param {ChartData} jsonData 置き換えるデータ
 * @param {Chart} chart 更新対象
 */
export function updateDataBar(
  jsonData: ChartData,
  chart: {
    options: { scales: { x: { suggestedMax: number } } };
    data: ChartData<
      keyof ChartTypeRegistry,
      (number | ScatterDataPoint | BubbleDataPoint)[],
      unknown
    >;
    update: () => void;
  }
) {
  const maxData: number = Math.max(...(jsonData.datasets[0].data as number[]));
  chart.options.scales.x.suggestedMax = maxData / 10 + maxData;
  chart.data = jsonData;
  chart.update();
}

/**
 * 図の表示データを追加 kari
 *
 * @param {Chart} chart 更新対象
 * @param {string} label 追加するラベル
 * @param {number | ScatterDataPoint | BubbleDataPoint} data 追加するデータ
 */
function addData(
  chart: Chart,
  label: string,
  data: number | ScatterDataPoint | BubbleDataPoint
) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

/**
 * 図のデータを削除する kari
 *
 * @param {Chart} chart 更新対象
 */
function removeData(chart: Chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}
