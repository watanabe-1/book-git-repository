import './../../common/common';
import * as studyCalendar from './../../study/calendar/studyCalendar';
import * as studyChart from './../../study/chart/studyChart';
import * as studyListUtil from './../../study/list/studyListUtil';
import * as studyUtil from './../../study/util/studyUtil';

import flatpickr from 'flatpickr';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index';
import flatpickr_ja from 'flatpickr/dist/l10n/ja';

//flatpickr
document.addEventListener('DOMContentLoaded', function () {
  /* 同画面内の全flatpickerの設定値を変更する場合
      const defaltConfig = {
          defaultDate: date
      };
      //強制的に同画面内の全flatpickerのデフォルト値を変更する場合
      flatpickr.setDefaults(defaltConfig);
      //強制的に同画面内の全flatpickerのロケールを変更する場合
      flatpickr.localize(flatpickr.l10ns.ja);
      */

  //呼び出すflatpickrに渡すconfigの設定 このconfigを渡されたflatpickrだけに有効
  //https://tr.you84815.space/flatpickr/index.html 参照
  const config = {
    //月だけのカレンダーを呼ぶ(pligins)
    plugins: [
      new monthSelectPlugin({
        shorthand: true, // デフォルトはfalse
        dateFormat: 'Y/m', // デフォルトは"F Y"
        altFormat: 'F Y', // デフォルトは"F Y"
        theme: 'dark', // デフォルトは"light"
      }),
    ],
    //言語設定
    locale: 'ja',
    //初期選択日付けのはずだが年月までしか反映されない…
    //そのため年までセットされたあとに初期選択をクリアするようにした(onReady)
    defaultDate: date,
    //カレンダーの準備完了時に選択済みの日付をクリア(画面には選択した日付ではなくプレースホルダを表示したいため)
    onReady: [
      function () {
        this.clear(false);
      },
    ],
    //カレンダーを開いたとき
    onOpen: [
      function () {
        //setDate(date, triggerChange, dateStrFormat) triggerChangeをtrueにすることでonValueUpdate、onChangeを発火可能
        //this.setDate(date, false);
        //this.currentMonth = date.getMonth();
      },
    ],

    //月を選択して値が書き換えられたときに発火
    onValueUpdate: [
      function () {
        const selectDate = this.selectedDates[0]; // 入力値を取得 選択した日付
        //ページ遷移
        //次月へのaタグからurlを取得し、日付けだけ書き換えて送信
        //uriはエンコードしている
        window.location.href = studyUtil.setAtagHrefParm(
          '#datepicker-right',
          'date',
          selectDate
        );
      },
    ],
  };
  //カレンダー(月だけ)
  flatpickr('#js-datepicker', config);
  //通常(月だけの表示にしていない)のカレンダーの場合
  //flatpickr('js-datepicker', {
  //  locale: 'ja'
  //});
});

//bootstrap タブ切り替え時のイベントを取得し、現在開いているタブを記憶するように変更
//https://getbootstrap.jp/docs/5.0/components/navs-tabs/ のイベントを参照
const tabEl = document.querySelectorAll('[data-bs-toggle="tab"]');
for (var i = 0; i < tabEl.length; i++) {
  //このイベントは、タブが表示された後のタブ表示時に発生します。
  //event.target と event.relatedTarget を使用して、それぞれアクティブなタブと前のアクティブなタブをターゲットにします。
  tabEl[i].addEventListener('shown.bs.tab', function (event) {
    //event.target; // newly activated tab
    //event.relatedTarget; // previous active tab
    //datePickerに関係しているaタグを取得
    const datePicker = ['#datepicker', '#datepicker-right', '#datepicker-left'];
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
//リスト_支出
studyListUtil.addEventListenerOfSortAndFilterTable(
  'bookslistByExpensesTable',
  'AND'
);
//リスト_収入
studyListUtil.addEventListenerOfSortAndFilterTable(
  'bookslistByIncomeTable',
  'AND'
);

//グローバル日付けの定義
//dateパラメーターが設定されていたらそれを、設定されていなかったら本日の日付を設定
const date = studyUtil.getStudyDate();

//chart
//処理の実行
//barとline（年ごとのチャート）
const restBarAndLineByYearUrl = studyUtil.setAtagHrefParm(
  '#restBarAndLineByYear',
  'date',
  date
);
let functionArgs = ['barAndLineByYear', '過去12ヶ月'];
studyUtil.ajax(
  'POST',
  restBarAndLineByYearUrl,
  '',
  studyUtil.PARALLEL,
  studyChart.barAndLineChart,
  functionArgs
);

//表示するchart
const functions = [studyChart.doughnutChart, studyChart.barChart];
//カテゴリーごとのチャート
const restCategoryUrl = studyUtil.setAtagHrefParm(
  '#restCategory',
  'date',
  date
);
//chartを表示するときの引数、1行で中に配列の中に配列を記載しようとtymeleafeの変数参照の書き方とかぶってしまうため改行をはさんでいる
functionArgs = [
  ['doughnutCategory', 'カテゴリー別'],
  ['barCategory', 'カテゴリー別'],
];
studyUtil.ajax(
  'POST',
  restCategoryUrl,
  '',
  studyUtil.PARALLEL,
  functions,
  functionArgs
);

//支払いごとのチャート
const restMethodUrl = studyUtil.setAtagHrefParm('#restMethod', 'date', date);
//chartを表示するときの引数、1行で中に配列の中に配列を記載しようとtymeleafeの変数参照の書き方とかぶってしまうため改行をはさんでいる
functionArgs = [
  ['doughnutMethod', '支払い別'],
  ['barMethod', '支払い別'],
];
studyUtil.ajax(
  'POST',
  restMethodUrl,
  '',
  studyUtil.PARALLEL,
  functions,
  functionArgs
);

//祝日リスト取得用url
const syukujitsuUrl = studyUtil.setAtagHrefParm(
  '#syukujitsuList',
  'date',
  date
);
//日にちごとのお金取得用url
const AmountByDayUrl = studyUtil.setAtagHrefParm(
  '#AmountByDayList',
  'date',
  date
);
//tab4 カレンダーの表示
studyCalendar.initStudyCalendar(
  date,
  'tabCalendar',
  'booksListbytabCalendar',
  syukujitsuUrl,
  AmountByDayUrl
);
