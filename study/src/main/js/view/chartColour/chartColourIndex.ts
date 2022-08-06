import './../../common/common';
import * as studyChart from './../../study/chart/studyChart';
import * as studyListUtil from './../../study/list/studyListUtil';
import * as studyUtil from './../../study/util/studyUtil';

import * as bootstrap from 'bootstrap';

/**
 * ChartColourPrams画面で使用するパラメータの定義
 */
type ChartColourPrams = {
  qty: string;
  templateName: string;
  templateId: string;
  seedCoeffR: string;
  seedCoeffG: string;
  seedCoeffB: string;
  note: string;
  userId: string;
};

//bootstrap タブ切り替え時のイベントを取得し、現在開いているタブを記憶するように変更
//https://getbootstrap.jp/docs/5.0/components/navs-tabs/ のイベントを参照
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  //このイベントは、タブが表示された後のタブ表示時に発生します。event.target と event.relatedTarget を使用して、それぞれアクティブなタブと前のアクティブなタブをターゲットにします。
  tab.addEventListener('shown.bs.tab', function (event) {
    //event.target; // newly activated tab
    //event.relatedTarget; // previous active tab
    //datePickerに関係しているaタグを取得
    const datePicker: string[] = ['#reload'];
    datePicker.forEach((atagId) => {
      studyUtil.setAtagHrefParm(
        atagId,
        'tab',
        (event.target as HTMLAnchorElement)
          .getAttribute('href')
          .replace('#', '')
      );
    });
  });
});

//テーブルの内容を並び替えできるようにイベントを追加
//テンプレートカラーリスト
studyListUtil.addEventListenerOfSortAndFilterTable(
  'randomColourListTable',
  'AND'
);

//chart
//処理の実行
// urlからパラメーターを取得
const paaramQty: string = studyUtil.getLocationHrefParm('qty');
//qty java側で0の時は置換
const qty: string = paaramQty == null ? '0' : paaramQty;
//ドーナツ
const DOUGHNUT: string = 'ドーナッツ';
//ホライゾンバー
const HORIZONTAL_BAR: string = 'ホライゾンバー';
//表示するchart
const functions = [studyChart.doughnutChart, studyChart.barChart];

//tab1
//テンプレートチャート
//chartを表示するときの引数、1行で配列の中に配列を記載しようとthymeleafの変数参照の書き方とかぶってしまうため改行をはさんでいる
let functionArgs: string[][] = [
  ['doughnutActiveTemp', DOUGHNUT],
  ['barActiveTemp', HORIZONTAL_BAR],
];
const restActiveTempUrl: string = studyUtil.setAtagHrefParm(
  '#restActiveTemp',
  'qty',
  qty
);
studyUtil.ajax(
  'POST',
  restActiveTempUrl,
  '',
  studyUtil.PARALLEL,
  functions,
  functionArgs
);

//tab3
//ランダムチャート
const randomContainer: HTMLDivElement = document.getElementById(
  'randomContainer'
) as HTMLDivElement;
const randomCanvasIds: string[] = Array.prototype.map.call(
  randomContainer.querySelectorAll('canvas'),
  function (value: HTMLCanvasElement): string {
    return value.id;
  }
);
const randomCanvasHerfIds: string[] = Array.prototype.map.call(
  randomContainer.querySelectorAll('a'),
  function (value: HTMLAnchorElement): string {
    return value.id;
  }
);
const randomTableBodys: NodeListOf<HTMLTableSectionElement> =
  randomContainer.querySelectorAll('tbody');
randomCanvasHerfIds.forEach((value, index) => {
  //console.log('ランダム:' + index);
  functionArgs = [
    [randomCanvasIds[index * 2], DOUGHNUT],
    [randomCanvasIds[index * 2 + 1], HORIZONTAL_BAR],
  ];
  const tds: NodeListOf<HTMLTableCellElement> =
    randomTableBodys[index].querySelectorAll('td');
  const tdInoutBtn: HTMLButtonElement = tds[1].querySelector('button');
  //ボタンへのイベントの追加
  tdInoutBtn.addEventListener('click', function (event) {
    //console.log(event);
    //クリックした時のボタン
    const button: HTMLButtonElement = event.target as HTMLButtonElement;
    const tdsByButton: NodeListOf<HTMLTableCellElement> =
      button.parentNode.parentNode.querySelectorAll('td');
    const tdInputValue: string = tdsByButton[2].querySelector('input').value;
    //buttonからその行を特定しそれぞれの<td>タグの内容を取得
    const tdValuesbyButton: string[] = Array.prototype.map.call(
      tdsByButton,
      function (value: HTMLTableCellElement) {
        return value.textContent;
      }
    );
    //入力パラム
    const randomParamsByButton: ChartColourPrams = {
      qty: qty,
      templateName: tdInputValue,
      templateId: '',
      seedCoeffR: tdValuesbyButton[4],
      seedCoeffG: tdValuesbyButton[5],
      seedCoeffB: tdValuesbyButton[6],
      //'note': document.getElementById('templateNoteInput').value
      note: '',
      userId: '',
    };
    //送信url
    const submitUrl: string = (
      document.getElementById('saveRandomModalUrl') as HTMLAnchorElement
    ).href;
    //保存処理実行
    studyUtil.submit('POST', submitUrl, randomParamsByButton);
  });
  const tdValues: string[] = Array.prototype.map.call(
    tds,
    function (value: HTMLTableCellElement) {
      return value.textContent;
    }
  );
  const randomParams: ChartColourPrams = {
    qty: qty,
    templateName: '',
    templateId: '',
    seedCoeffR: tdValues[4],
    seedCoeffG: tdValues[5],
    seedCoeffB: tdValues[6],
    note: '',
    userId: '',
  };

  //確認用ドーナツチャート取得url
  const restRandomUrl: string = studyUtil.setAtagHrefParms(
    '#' + value,
    randomParams
  );
  //console.log(restRandomUrl);
  studyUtil.ajax(
    'POST',
    restRandomUrl,
    '',
    studyUtil.PARALLEL,
    functions,
    functionArgs
  );
});

//tab4 手動で登録
//確認用デフォルトパラム
const confirmDefData = {
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
};
//確認用デフォルトドーナツチャート
const doughnutConfirmTempChart = studyChart.doughnutChart(confirmDefData, [
  'doughnutConfirmTemp',
  DOUGHNUT,
]);
//確認用デフォルトのホライゾンバーチャート
const barConfirmTempChart = studyChart.barChart(confirmDefData, [
  'barConfirmTemp',
  HORIZONTAL_BAR,
]);
//confirm model
const confirmModalEl: HTMLDivElement = document.getElementById(
  'confirmModal'
) as HTMLDivElement;
const confirmModalElObj = new bootstrap.Modal(confirmModalEl);

document.querySelectorAll('.confirmModalBtn').forEach((button, index) => {
  button.addEventListener('click', async (e) => {
    //エラー判定用
    let isModalErr: boolean = false;

    //model内に入力したテンプレート名の値を挿入
    document.getElementById('templateNameConfirm').innerHTML =
      'テンプレート名：' +
      (document.getElementById('templateNameInput') as HTMLInputElement).value;
    //chartのupdate
    //確認用パラム
    const confirmParams: ChartColourPrams = {
      qty: qty,
      templateName: '',
      templateId: '',
      seedCoeffR: (
        document.getElementById('seedCoeffRInput') as HTMLInputElement
      ).value,
      seedCoeffG: (
        document.getElementById('seedCoeffGInput') as HTMLInputElement
      ).value,
      seedCoeffB: (
        document.getElementById('seedCoeffBInput') as HTMLInputElement
      ).value,
      note: '',
      userId: '',
    };
    //確認用ドーナツチャート取得url
    const restConfirmTempUrl: string = studyUtil.setAtagHrefParms(
      '#restConfirmTemp',
      confirmParams
    );
    const charts = [doughnutConfirmTempChart, barConfirmTempChart];
    const functions = [studyChart.updateDataDoughnut, studyChart.updateDataBar];
    //確認用のjsonデータを取得しchartを更新
    await studyUtil
      .ajax(
        'POST',
        restConfirmTempUrl,
        '',
        studyUtil.PARALLEL,
        functions,
        charts
      )
      //エラーの時
      .catch(function (error) {
        //エラー判定用フラグをtrue
        isModalErr = true;
        //画面にerrの内容を表示
        alert(error.message);
      });

    if (!isModalErr) {
      confirmModalElObj.show();
    }
  });
});

//model内のボタンにイベントの追加
//confirm model-save-button
//const confirmModalSaveButton = document.getElementById('saveConfirmModal');
const confirmModalSaveButton: HTMLDivElement =
  confirmModalEl.querySelector('#saveConfirmModal');
confirmModalSaveButton.addEventListener('click', function (event) {
  //入力パラム
  const confirmParams: ChartColourPrams = {
    qty: qty,
    templateName: (
      document.getElementById('templateNameInput') as HTMLInputElement
    ).value,
    templateId: '',
    seedCoeffR: (document.getElementById('seedCoeffRInput') as HTMLInputElement)
      .value,
    seedCoeffG: (document.getElementById('seedCoeffGInput') as HTMLInputElement)
      .value,
    seedCoeffB: (document.getElementById('seedCoeffBInput') as HTMLInputElement)
      .value,
    note: (document.getElementById('templateNoteInput') as HTMLInputElement)
      .value,
    userId: '',
  };
  //送信url
  const submitUrl: string = (
    document.getElementById('saveConfirmModalUrl') as HTMLAnchorElement
  ).href;
  //保存処理実行
  studyUtil.submit('POST', submitUrl, confirmParams);
});

//tab2
//list model
//確認用デフォルトドーナツチャート
const doughnutConfirmTempListChart = studyChart.doughnutChart(confirmDefData, [
  'doughnutConfirmTempList',
  DOUGHNUT,
]);
//確認用デフォルトのホライゾンバーチャート
const barConfirmTempListChart = studyChart.barChart(confirmDefData, [
  'barConfirmTempList',
  HORIZONTAL_BAR,
]);
//list model
const listModalEl: HTMLDivElement = document.getElementById(
  'listModal'
) as HTMLDivElement;
const listModalElObj = new bootstrap.Modal(listModalEl);
const listModalDeleteEl: HTMLDivElement = document.getElementById(
  'listModalDelete'
) as HTMLDivElement;
const listModalDeleteElObj = new bootstrap.Modal(listModalDeleteEl);

document.querySelectorAll('.listModalBtn').forEach((button, index) => {
  button.addEventListener('click', async (e) => {
    //エラー判定用
    let isModalErr: boolean = false;
    //buttonからその行を特定しそれぞれの<td>タグの内容を取得
    const tdValues: string[] = Array.prototype.map.call(
      button.parentNode.parentNode.querySelectorAll('td'),
      function (value: HTMLTableCellElement) {
        return value.textContent;
      }
    ); //.filter(function (v) {
    //	return v !== "";
    //});
    //console.log(tdValues);
    //model内に入力したテンプレート名の値を挿入
    (document.getElementById('templateIdList') as HTMLInputElement).value =
      tdValues[0];
    (document.getElementById('templateNameList') as HTMLInputElement).value =
      tdValues[2];
    (document.getElementById('templateUserId') as HTMLInputElement).value =
      tdValues[7];

    //chartのupdate
    //確認用パラム
    const confirmParams: ChartColourPrams = {
      qty: qty,
      templateName: '',
      templateId: '',
      seedCoeffR: tdValues[4],
      seedCoeffG: tdValues[5],
      seedCoeffB: tdValues[6],
      note: '',
      userId: '',
    };

    //確認用ドーナツチャート取得url
    const restConfirmTempUrl: string = studyUtil.setAtagHrefParms(
      '#restConfirmTempList',
      confirmParams
    );
    const charts = [doughnutConfirmTempListChart, barConfirmTempListChart];
    const functions = [studyChart.updateDataDoughnut, studyChart.updateDataBar];
    //確認用のjsonデータを取得しchartを更新
    await studyUtil
      .ajax(
        'POST',
        restConfirmTempUrl,
        '',
        studyUtil.PARALLEL,
        functions,
        charts
      )
      //エラーの時
      .catch(function (error) {
        //エラー判定用フラグをtrue
        isModalErr = true;
        //画面にerrの内容を表示
        alert(error.message);
      });
    if (!isModalErr) {
      listModalElObj.show();
    }
  });
});

//model内のボタンにイベントの追加
//list model-delete-button
const listModalDeleteButton: HTMLButtonElement = listModalEl.querySelector(
  '#toggleToDeleteListModalBtn'
) as HTMLButtonElement;
listModalDeleteButton.addEventListener('click', function (event) {
  listModalElObj.toggle();
  listModalDeleteElObj.toggle();
});
const listModalButton: HTMLButtonElement = listModalDeleteEl.querySelector(
  '#toggleToListModalBtn'
) as HTMLButtonElement;
listModalButton.addEventListener('click', function (event) {
  listModalElObj.toggle();
  listModalDeleteElObj.toggle();
});

//list model-change-button
const listModalSaveButton: HTMLButtonElement = listModalEl.querySelector(
  '#saveListModal'
) as HTMLButtonElement;
listModalSaveButton.addEventListener('click', function (event) {
  //入力パラム
  const listParams: ChartColourPrams = {
    qty: qty,
    templateName: (
      document.getElementById('templateNameList') as HTMLInputElement
    ).value,
    templateId: (document.getElementById('templateIdList') as HTMLInputElement)
      .value,
    seedCoeffR: '',
    seedCoeffG: '',
    seedCoeffB: '',
    note: '',
    userId: '',
  };
  const submitUrl = (
    document.getElementById('savelistModalUrl') as HTMLAnchorElement
  ).href;
  //保存処理実行
  studyUtil.submit('POST', submitUrl, listParams);
});

//list model delete
const listModaldeleteButton: HTMLDivElement = listModalDeleteEl.querySelector(
  '#deleteListModal'
) as HTMLDivElement;
listModaldeleteButton.addEventListener('click', function (event) {
  //入力パラム
  const listDeleteParams: ChartColourPrams = {
    qty: qty,
    templateName: '',
    templateId: (document.getElementById('templateIdList') as HTMLInputElement)
      .value,
    seedCoeffR: '',
    seedCoeffG: '',
    seedCoeffB: '',
    note: '',
    userId: (document.getElementById('templateUserId') as HTMLInputElement)
      .value,
  };
  const submitUrl: string = (
    document.getElementById('deletelistModalUrl') as HTMLAnchorElement
  ).href;
  //削除処理実行
  studyUtil.submit('POST', submitUrl, listDeleteParams);
});
