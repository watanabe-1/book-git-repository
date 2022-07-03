// let selectDayByCalendar = new Date();
//studyUtil.getStudyDate()の呼び出し
let selectDayByCalendar = getStudyDate();
// 祝日一覧 初期化時に設定
let syukujitsuList;
// 日にちごとのお金のリスト
let AmountByDayList;
/**
 * 初期化処理
 *
 * @param {Date} date 選択日
 * @param {string} targetId 対象カレンダーID
 * @param {string} targetBooksID 対象家計簿ID
 * @param {string} syukujitsuUrl 祝日取得用url
 * @param {string} AmountByDayListUrl 日にちごとのお金取得用url
 */
function initStudyCalendar(
  date,
  targetId,
  targetBooksID,
  syukujitsuUrl,
  AmountByDayListUrl
) {
  //スタイルタグの追加
  addCalendarStyle();
  //祝日一覧の取得
  if (syukujitsuList) {
    showCalendarProcess(date, targetId, targetBooksID);
  } else {
    ajax('POST', syukujitsuUrl)
      .then(
        //前の処理が成功した時
        function (response) {
          syukujitsuList = response;
          //console.log(response);
          return response;
        },
        //前の処理がエラーの時はthrowを行い後続の処理を実行しないようにする
        function (error) {
          throw new Error(error);
        }
      )
      .then(
        //前の処理が成功した時
        function (response) {
          // 日にちごとのお金のリスト
          let result;
          if (!AmountByDayList) {
            result = ajax('POST', AmountByDayListUrl).then(
              //前の処理が成功した時
              function (response) {
                AmountByDayList = response;
                //console.log(response);
                return response;
              },
              //前の処理がエラーの時はthrowを行い後続の処理を実行しないようにする
              function (error) {
                throw new Error(error);
              }
            );
          }
          return result;
        },
        //前の処理がエラーの時はthrowを行い後続の処理を実行しないようにする
        function (error) {
          throw new Error(error);
        }
      )
      .then(
        //前の処理が成功した時
        function (response) {
          // 初期表示
          showCalendarProcess(date, targetId, targetBooksID);
        },
        //前の処理がエラーの時はthrowを行い後続の処理を実行しないようにする
        function (error) {
          throw new Error(error);
        }
      );
  }
}

// 月末だとずれる可能性があるため、1日固定で取得
// let showDate = new Date(selectDayByCalendar.getFullYear(), selectDayByCalendar.getMonth(), 1);

// window.onload = function () {
//   showCalendarProcess(showDate);
// };

// 前の月表示
// function prev() {
//   showDate.setMonth(showDate.getMonth() - 1);
//   showCalendarProcess(showDate);
// }

// 次の月表示
// function next() {
//   showDate.setMonth(showDate.getMonth() + 1);
//   showCalendarProcess(showDate);
// }

/**
 * カレンダーの作成と描画
 *
 * @param {Date} date 選択日
 * @param {string} targetId 対象ID
 * @param {string} targetBooksID 対象家計簿ID
 *
 */
function showCalendarProcess(date, targetId, targetBooksID) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0始まり
  document.querySelector('#tabCalendarHeader').innerHTML =
    year + '年 ' + (month + 1) + '月';

  const calendar = createCalendarProcess(year, month);
  document.querySelector('#' + targetId).innerHTML = calendar;

  const booksList = createBooksListByCalendarProcess(
    getSelectedAmountByDayList()
  );
  const targetBooksElement = document.querySelector('#' + targetBooksID);
  //StudyUtil.appendOrReplaceChild
  appendOrReplaceChild(targetBooksElement, booksList, 'table');
  //テーブルの内容を並び替えできるようにイベントを追加
  addEventListenerOfSortTable(booksList.id);
  //クリックイベントの追加
  const tabCalendarTableBody = document
    .getElementById('tabCalendar')
    .querySelectorAll('tbody');
  //console.log(tabCalendarTableBody);
  tabCalendarTableBody.forEach((value, index) => {
    const hoverTds =
      tabCalendarTableBody[index].querySelectorAll('.cell-hover');
    //console.log(hoverTds);
    //イベントの追加
    hoverTds.forEach((value, index) => {
      //ボタンへのイベントの追加
      value.addEventListener('click', function (event) {
        //クリックした時のボタン
        const target = event.target;
        let selectId;
        // console.log(target);
        // console.log(target.parentNode);
        //クリックされた位置によって取得方法を変更
        if (target.parentNode.className.indexOf('cell-hover') == 0) {
          //cellの中をクリックしたとき
          //   console.log(target.parentNode.firstElementChild.innerHTML);
          selectDayByCalendar.setDate(
            target.parentNode.firstElementChild.innerHTML
          );
          selectId =
            target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute(
              'id'
            );
        } else {
          //cellの縁側をクリックしたとき
          //   console.log(target.firstElementChild.innerHTML);
          selectDayByCalendar.setDate(target.firstElementChild.innerHTML);
          selectId =
            target.parentNode.parentNode.parentNode.parentNode.getAttribute(
              'id'
            );
        }
        // console.log(target);
        // console.log(selectDayByCalendar);
        // console.log(selectId);
        showCalendarProcess(selectDayByCalendar, selectId, targetBooksID);
      });
    });
  });
}

/**
 * スタイルタグを追加し、カレンダー内のホバー用cssを定義する
 *
 */
function addCalendarStyle() {
  // styleタグを作成
  let styleTag = document.createElement('style');

  // styleタグに記載するcssを記入
  styleTag.innerText = `/* カレンダーホバー用 */ .cell-hover:hover { background-color: #bbd1ca; cursor: pointer;}`;

  // 作成したstyleタグを挿入
  document
    .getElementsByTagName('head')[0]
    .insertAdjacentElement('beforeend', styleTag);
}

/**
 * カレンダー作成
 *
 * @param {string} year 年
 * @param {string} month 月
 * @return {string} 作成したカレンダーのhtml
 */
function createCalendarProcess(year, month) {
  //週の定義
  const weekByCalendar = ['日', '月', '火', '水', '木', '金', '土'];
  // 曜日
  let calendar = "<table class='table table-bordered'><tr class='dayOfWeek'>";
  for (let i = 0; i < weekByCalendar.length; i++) {
    calendar += '<th class = "text-start">' + weekByCalendar[i] + '</th > ';
  }
  calendar += '</tr>';

  let count = 0;
  const startDayOfWeek = new Date(year, month, 1).getDay();
  const endDate = new Date(year, month + 1, 0).getDate();
  const lastMonthEndDate = new Date(year, month, 0).getDate();
  const row = Math.ceil((startDayOfWeek + endDate) / weekByCalendar.length);

  // 1行ずつ設定
  for (let i = 0; i < row; i++) {
    calendar += '<tr>';
    // 1colum単位で設定
    for (let j = 0; j < weekByCalendar.length; j++) {
      if (i == 0 && j < startDayOfWeek) {
        // 1行目で1日まで先月の日付を設定
        calendar +=
          "<td class='text-dark text-start text-opacity-25'>" +
          (lastMonthEndDate - startDayOfWeek + j + 1) +
          '</td>';
      } else if (count >= endDate) {
        // 最終行で最終日以降、翌月の日付を設定
        count++;
        calendar +=
          "<td class='text-dark  text-start text-opacity-25'>" +
          (count - endDate) +
          '</td>';
      } else {
        // 当月の日付を曜日に照らし合わせて設定
        count++;
        let dateInfo = checkDate(year, month, j, count);
        calendar += '<td class="cell-hover ';
        if (dateInfo.isSelectdayByCalendar) {
          calendar += 'selected bg-danger text-white';
        } else if (dateInfo.isHoliday) {
          calendar += 'text-success';
        } else if (dateInfo.isSaturday) {
          calendar += 'text-primary';
        } else if (dateInfo.isSunday) {
          calendar += 'text-danger';
        }
        calendar += '"';
        if (dateInfo.isHoliday) {
          calendar += ' title="' + dateInfo.holidayName + '"';
        }
        calendar += '> <div class="text-start">' + count + '</div>';
        if (dateInfo.isAmountDay) {
          calendar +=
            '<div class="text-center">' +
            dateInfo.amountList.length +
            '件</div><div class="text-center">\\' +
            //合計
            dateInfo.amountList.reduce((sum, element) => sum + element, 0) +
            '</div>';
        } else {
          calendar +=
            '<div class="text-center">　</div><div class="text-center">　</div>';
        }
        calendar += '</td>';
      }
    }
    calendar += '</tr>';
  }
  return calendar;
}

/**
 * カレンダーに対応する家計簿支出リスト作成
 *
 * @param {Object} booksList 選択されたリスト
 * @return {Object} 作成したカレンダーに対応する家計簿支出リスト
 */
function createBooksListByCalendarProcess(booksList) {
  // <table> 要素と <tbody> 要素を作成
  const tbl = document.createElement('table');
  tbl.className = 'table table-bordered';
  tbl.id = 'booksListByCalendarTable';
  const tblhead = document.createElement('thead');
  const tblBody = document.createElement('tbody');
  //家計簿の定義
  const booksListHeadByCalendar = [
    '日付',
    '名称',
    'カテゴリー',
    '決済方法',
    '金額',
  ];

  //headの作成
  for (let i = 0; i < 1; i++) {
    // 表の行を作成
    const headRow = document.createElement('tr');

    for (let j = 0; j < booksListHeadByCalendar.length; j++) {
      // <th> 要素とテキストノードを作成し、テキストノードを
      // <th> の内容として、その <th> を表の行の末尾に追加
      const headCell = document.createElement('th');
      const headCellText = document.createTextNode(booksListHeadByCalendar[j]);
      headCell.appendChild(headCellText);
      headRow.appendChild(headCell);
    }

    // 表のヘッドの末尾に行を追加
    tblhead.appendChild(headRow);
  }

  // すべてのセルを作成
  for (let i = 0; i < booksList.length; i++) {
    // 表の行を作成
    let bodyRow = document.createElement('tr');

    for (let j = 0; j < booksListHeadByCalendar.length; j++) {
      // <td> 要素とテキストノードを作成し、テキストノードを
      // <td> の内容として、その <td> を表の行の末尾に追加
      const bodyCell = document.createElement('td');
      const bodyCellContent = [];
      if (j == 0) {
        bodyCellContent.push(
          document.createTextNode(
            //studyUtilのformatDateBtYyyyMmDd
            formatDateBtYyyyMmDd(booksList[i].booksDate, '/')
          )
        );
      } else if (j == 1) {
        bodyCellContent.push(document.createTextNode(booksList[i].booksPlace));
      } else if (j == 2) {
        bodyCellContent.push(
          document.createTextNode(booksList[i].catCodes.catName)
        );
        const imgElement = document.createElement('img');
        imgElement.src =
          //studyUtilのgetFirstUrl()
          getFirstUrl() +
          booksList[i].catCodes.imgIds.imgPath +
          '/' +
          booksList[i].catCodes.imgIds.imgName; // 画像パス
        imgElement.alt = booksList[i].catCodes.catName; // 代替テキスト
        imgElement.width = 40; // 横サイズ（px）
        imgElement.height = 30; // 縦サイズ（px）
        imgElement.className = 'mh-100 mw-100';
        bodyCellContent.push(imgElement);
      } else if (j == 3) {
        bodyCellContent.push(document.createTextNode(booksList[i].booksMethod));
      } else if (j == 4) {
        bodyCellContent.push(
          document.createTextNode(booksList[i].booksAmmount)
        );
      }
      bodyCellContent.forEach((v) => {
        bodyCell.appendChild(v);
      });
      bodyRow.appendChild(bodyCell);
    }
    // 表の本体の末尾に行を追加
    tblBody.appendChild(bodyRow);
  }

  // <thead> を <table> の中に追加
  tbl.appendChild(tblhead);
  // <tbody> を <table> の中に追加
  tbl.appendChild(tblBody);

  return tbl;
}

/**
 * 日付チェック
 *
 * @param {string} year 年
 * @param {string} month 月
 * @param {int} weekCnt 週(日を0とし、月が1……と続き、土の6で終わる数値)
 * @param {string} day 日
 * @return {Object} 判定結果
 */
function checkDate(year, month, weekCnt, day) {
  // if (isSelectdayByCalendar(year, month, day)) {
  //   return {
  //     isSelectdayByCalendar: true,
  //     isHoliday: false,
  //     holidayName: '',
  //     isAmountDay: false,
  //     amountList: '',
  //     isSaturday: false,
  //     isSunday: false,
  //   };
  // }
  const checkSelectedday = isSelectdayByCalendar(year, month, day);
  const checkHoliday = isHoliday(year, month, day);
  const checkAmountDay = isAmountDay(year, month, day);
  //const checkHoliday = false;
  const checkSaturday = isSaturday(weekCnt);
  const checkSunday = isSunday(weekCnt);
  return {
    isSelectdayByCalendar: checkSelectedday,
    isHoliday: checkHoliday[0],
    holidayName: checkHoliday[1],
    isAmountDay: checkAmountDay[0],
    amountList: checkAmountDay[1],
    isSaturday: checkSaturday,
    isSunday: checkSunday,
  };
}

/**
 * 当日かどうか
 *
 * @param {string} year 年
 * @param {string} month 月
 * @param {string} day 日
 * @return {boolean} 判定結果
 */
function isSelectdayByCalendar(year, month, day) {
  return (
    year == selectDayByCalendar.getFullYear() &&
    month == selectDayByCalendar.getMonth() &&
    day == selectDayByCalendar.getDate()
  );
}

/**
 * 土曜日かどうか
 *
 * @param {int} weekCnt 週(日を0とし、月が1……と続き、土の6で終わる数値)
 * @return {boolean} 判定結果
 */
function isSaturday(weekCnt) {
  return weekCnt == 6;
}

/**
 * 日曜日かどうか
 *
 * @param {int} weekCnt 週(日を0とし、月が1……と続き、土の6で終わる数値)
 * @return {boolean} 判定結果
 */
function isSunday(weekCnt) {
  return weekCnt == 0;
}

/**
 * 祝日かどうか
 *
 * @param {string} year 年
 * @param {string} month 月
 * @param {string} day 日
 * @return {boolean} 判定結果
 */
function isHoliday(year, month, day) {
  for (let i = 0; i < syukujitsuList.length; i++) {
    const holiday = new Date(syukujitsuList[i].date);
    if (
      year == holiday.getFullYear() &&
      month == holiday.getMonth() &&
      day == holiday.getDate()
    ) {
      return [true, syukujitsuList[i].name];
    }
  }

  return [false, ''];
}

/**
 * 支払いがあったかどうか
 *
 * @param {string} year 年
 * @param {string} month 月
 * @param {string} day 日
 * @return {boolean} 判定結果
 */
function isAmountDay(year, month, day) {
  let flag = false;
  const booksAmmountList = [];
  for (let i = 0; i < AmountByDayList.length; i++) {
    const amountday = new Date(AmountByDayList[i].booksDate);
    if (
      year == amountday.getFullYear() &&
      month == amountday.getMonth() &&
      day == amountday.getDate()
    ) {
      flag = true;
      booksAmmountList.push(Number(AmountByDayList[i].booksAmmount));
    }
  }
  if (flag) {
    //console.log(booksAmmount);
    return [true, booksAmmountList];
  } else {
    return [false, ''];
  }
}

/**
 * 選択されている家計簿リストを取得
 *
 * @return {Object} 選択されている家計簿リストを取得
 */
function getSelectedAmountByDayList() {
  const selectAmountByDayList = [];
  for (let i = 0; i < AmountByDayList.length; i++) {
    const amountday = new Date(AmountByDayList[i].booksDate);
    if (
      isSelectdayByCalendar(
        amountday.getFullYear(),
        amountday.getMonth(),
        amountday.getDate()
      )
    ) {
      selectAmountByDayList.push(AmountByDayList[i]);
    }
  }

  return selectAmountByDayList;
}
