import './../../common/common';
import * as studyChart from './../../study/chart/studyChart';
import * as studyListUtil from './../../study/list/studyListUtil';
import * as studyUtil from './../../study/util/studyUtil';

import * as bootstrap from 'bootstrap';

//bootstrap タブ切り替え時のイベントを取得し、現在開いているタブを記憶するように変更
//https://getbootstrap.jp/docs/5.0/components/navs-tabs/ のイベントを参照
const tabEl = document.querySelectorAll('[data-bs-toggle="tab"]');
for (var i = 0; i < tabEl.length; i++) {
  //このイベントは、タブが表示された後のタブ表示時に発生します。event.target と event.relatedTarget を使用して、それぞれアクティブなタブと前のアクティブなタブをターゲットにします。
  tabEl[i].addEventListener('shown.bs.tab', function (event) {
    //event.target; // newly activated tab
    //event.relatedTarget; // previous active tab
    //datePickerに関係しているaタグを取得
    const datePicker = ['#reload'];
    for (var i = 0; i < datePicker.length; i++) {
      studyUtil.setAtagHrefParm(
        datePicker[i],
        'tab',
        event.target.getAttribute('href').replace('#', '')
      );
    }
  });
}

//テーブルの内容を並び替えできるようにイベントを追加
//テンプレートカラーリスト
studyListUtil.addEventListenerOfSortAndFilterTable(
  'randomColourListTable',
  'AND'
);

//chart
//処理の実行
// urlからパラメーターを取得
const paaramQty = studyUtil.getLocationHrefParm('qty');
//qty java側で0の時は置換
const qty = paaramQty == null ? 0 : paaramQty;
//ドーナツ
const DOUGHNUT = 'ドーナッツ';
//ホライゾンバー
const HORIZONTAL_BAR = 'ホライゾンバー';
//表示するchart
const functions = [studyChart.doughnutChart, studyChart.barChart];

//tab1
//テンプレートチャート
//chartを表示するときの引数、1行で配列の中に配列を記載しようとthymeleafの変数参照の書き方とかぶってしまうため改行をはさんでいる
let functionArgs = [
  ['doughnutActiveTemp', DOUGHNUT],
  ['barActiveTemp', HORIZONTAL_BAR],
];
const restActiveTempUrl = studyUtil.setAtagHrefParm(
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
const randomContainer = document.getElementById('randomContainer');
const randomCanvasIds = Array.prototype.map.call(
  randomContainer.querySelectorAll('canvas'),
  function (value) {
    return value.id;
  }
);
const randomCanvasHerfIds = Array.prototype.map.call(
  randomContainer.querySelectorAll('a'),
  function (value) {
    return value.id;
  }
);
const randomTableBodys = randomContainer.querySelectorAll('tbody');
randomCanvasHerfIds.forEach((value, index) => {
  //console.log('ランダム:' + index);
  functionArgs = [
    [randomCanvasIds[index * 2], DOUGHNUT],
    [randomCanvasIds[index * 2 + 1], HORIZONTAL_BAR],
  ];
  const tds = randomTableBodys[index].querySelectorAll('td');
  const tdInoutBtn = tds[1].querySelector('button');
  //ボタンへのイベントの追加
  tdInoutBtn.addEventListener('click', function (event) {
    //console.log(event);
    //クリックした時のボタン
    const button = event.target;
    const tdsByButton = button.parentNode.parentNode.querySelectorAll('td');
    const tdInputValue = tdsByButton[2].querySelector('input').value;
    //buttonからその行を特定しそれぞれの<td>タグの内容を取得
    const tdValuesbyButton = Array.prototype.map.call(
      tdsByButton,
      function (value) {
        return value.textContent;
      }
    );
    //入力パラム
    const randomParamsByButton = {
      qty: qty,
      templateName: tdInputValue,
      seedCoeffR: tdValuesbyButton[4],
      seedCoeffG: tdValuesbyButton[5],
      seedCoeffB: tdValuesbyButton[6],
      //'note': document.getElementById('templateNoteInput').value
    };
    //送信url
    const submitUrl = document.getElementById('saveRandomModalUrl').href;
    //保存処理実行
    studyUtil.submit('POST', submitUrl, randomParamsByButton);
  });
  const tdValues = Array.prototype.map.call(tds, function (value) {
    return value.textContent;
  });
  const randomParams = {
    qty: qty,
    seedCoeffR: tdValues[4],
    seedCoeffG: tdValues[5],
    seedCoeffB: tdValues[6],
  };

  //確認用ドーナツチャート取得url
  const restRandomUrl = studyUtil.setAtagHrefParms('#' + value, randomParams);
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
const confirmModalEl = document.getElementById('confirmModal');
const confirmModalElObj = new bootstrap.Modal(confirmModalEl);

document.querySelectorAll('.confirmModalBtn').forEach((button, index) => {
  button.addEventListener('click', async (e) => {
    //エラー判定用
    let isModalErr = false;

    //model内に入力したテンプレート名の値を挿入
    document.getElementById('templateNameConfirm').innerHTML =
      'テンプレート名：' + document.getElementById('templateNameInput').value;
    //chartのupdate
    //確認用パラム
    const confirmParams = {
      qty: qty,
      seedCoeffR: document.getElementById('seedCoeffRInput').value,
      seedCoeffG: document.getElementById('seedCoeffGInput').value,
      seedCoeffB: document.getElementById('seedCoeffBInput').value,
    };
    //確認用ドーナツチャート取得url
    const restConfirmTempUrl = studyUtil.setAtagHrefParms(
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
const confirmModalSaveButton =
  confirmModalEl.querySelector('#saveConfirmModal');
confirmModalSaveButton.addEventListener('click', function (event) {
  //入力パラム
  const confirmParams = {
    qty: qty,
    templateName: document.getElementById('templateNameInput').value,
    seedCoeffR: document.getElementById('seedCoeffRInput').value,
    seedCoeffG: document.getElementById('seedCoeffGInput').value,
    seedCoeffB: document.getElementById('seedCoeffBInput').value,
    note: document.getElementById('templateNoteInput').value,
  };
  //送信url
  const submitUrl = document.getElementById('saveConfirmModalUrl').href;
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
const listModalEl = document.getElementById('listModal');
const listModalElObj = new bootstrap.Modal(listModalEl);
const listModalDeleteEl = document.getElementById('listModalDelete');
const listModalDeleteElObj = new bootstrap.Modal(listModalDeleteEl);

document.querySelectorAll('.listModalBtn').forEach((button, index) => {
  button.addEventListener('click', async (e) => {
    //エラー判定用
    let isModalErr = false;
    //buttonからその行を特定しそれぞれの<td>タグの内容を取得
    const tdValues = Array.prototype.map.call(
      button.parentNode.parentNode.querySelectorAll('td'),
      function (value) {
        return value.textContent;
      }
    ); //.filter(function (v) {
    //	return v !== "";
    //});
    //console.log(tdValues);
    //model内に入力したテンプレート名の値を挿入
    document.getElementById('templateIdList').value = tdValues[0];
    document.getElementById('templateNameList').value = tdValues[2];
    document.getElementById('templateUserId').value = tdValues[7];

    //chartのupdate
    //確認用パラム
    const confirmParams = {
      qty: qty,
      seedCoeffR: tdValues[4],
      seedCoeffG: tdValues[5],
      seedCoeffB: tdValues[6],
    };

    //確認用ドーナツチャート取得url
    const restConfirmTempUrl = studyUtil.setAtagHrefParms(
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
const listModalDeleteButton = listModalEl.querySelector(
  '#toggleToDeleteListModalBtn'
);
listModalDeleteButton.addEventListener('click', function (event) {
  listModalElObj.toggle();
  listModalDeleteElObj.toggle();
});
const listModalButton = listModalDeleteEl.querySelector(
  '#toggleToListModalBtn'
);
listModalButton.addEventListener('click', function (event) {
  listModalElObj.toggle();
  listModalDeleteElObj.toggle();
});

//list model-change-button
const listModalSaveButton = listModalEl.querySelector('#saveListModal');
listModalSaveButton.addEventListener('click', function (event) {
  //入力パラム
  const listParams = {
    qty: qty,
    templateName: document.getElementById('templateNameList').value,
    templateId: document.getElementById('templateIdList').value,
  };
  const submitUrl = document.getElementById('savelistModalUrl').href;
  //保存処理実行
  studyUtil.submit('POST', submitUrl, listParams);
});

//list model delete
const listModaldeleteButton =
  listModalDeleteEl.querySelector('#deleteListModal');
listModaldeleteButton.addEventListener('click', function (event) {
  //入力パラム
  const listDeleteParams = {
    qty: qty,
    templateId: document.getElementById('templateIdList').value,
    userId: document.getElementById('templateUserId').value,
  };
  const submitUrl = document.getElementById('deletelistModalUrl').href;
  //削除処理実行
  studyUtil.submit('POST', submitUrl, listDeleteParams);
});
