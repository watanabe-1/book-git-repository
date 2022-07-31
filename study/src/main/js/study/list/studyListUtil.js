/**
 * テーブルにソート機能を追加
 * テーブルにフィルター機能を追加
 *
 * @param {String} targetId 対象テーブルID
 * @param {String} searchType 検索方法 'AND''OR'のどちらかを指定 デフォルトはand
 */
export function addEventListenerOfSortAndFilterTable(
  targetId,
  searchType = 'AND'
) {
  addEventListenerOfSortTable(targetId);
  addEventListenerOfFilterTable(targetId, searchType);
}

/**
 * テーブルにソート機能を追加
 * 灰色のタイトル部分をクリックするとソートされる
 * 同じ項目をもう一度クリックすると逆順にソートされる
 * 数字しか入っていない列は数字として扱われる（小数点付きも数字として扱われる）
 * 1行でも文字列が含まれている列は文字列としてソートされる
 *
 * @param {String} targetId 対象テーブルID
 */
function addEventListenerOfSortTable(targetId) {
  const ASC = 'bi-caret-up-fill';
  const DESC = 'bi-caret-down-fill';
  const NUMBER_SORT = 0;
  const STRING_SORT = 1;
  document.querySelectorAll('#' + targetId + ' th').forEach((elm) => {
    elm.onclick = function () {
      const columnNo = this.cellIndex; // クリックされた列番号
      const table = this.parentNode.parentNode.parentNode;
      const beforeiEl =
        table.querySelector('.' + ASC) != null
          ? table.querySelector('.' + ASC)
          : table.querySelector('.' + DESC); // 前回付与されたソート順を示すアイコン
      let sortType = NUMBER_SORT; // 0:数値 1:文字
      let sortArray = new Array(); // クリックした列のデータを全て格納する配列
      // 次のソート順を決定
      const order =
        beforeiEl == null ||
        columnNo != beforeiEl.parentNode.cellIndex ||
        beforeiEl.className != ASC
          ? ASC
          : DESC;
      // 前回のソート順を示すアイコンを削除
      if (beforeiEl != null) {
        beforeiEl.remove();
      }
      // 今回のソート順を示すアイコンを付与
      const iEl = document.createElement('i');
      iEl.className = order;
      this.prepend(iEl);
      for (let r = 1; r < table.rows.length; r++) {
        //行番号と値を配列に格納
        let column = new Object();
        column.row = table.rows[r];
        column.value = table.rows[r].cells[columnNo].textContent;
        sortArray.push(column);
        //数値判定
        if (isNaN(Number(column.value))) {
          sortType = 1; //値が数値変換できなかった場合は文字列ソート
        }
      }
      if (sortType == NUMBER_SORT) {
        // 数値ソート
        if (order == DESC) {
          // 同じ列が2回クリックされた場合は降順ソート
          sortArray.sort(compareNumberDesc);
        } else {
          sortArray.sort(compareNumber);
        }
      } else {
        // 文字列ソート
        if (order == DESC) {
          // 同じ列が2回クリックされた場合は降順ソート
          sortArray.sort(compareStringDesc);
        } else {
          sortArray.sort(compareString);
        }
      }
      // ソート後のTRオブジェクトをソート順にtbodyへ追加（移動）
      // let tbody = this.parentNode.parentNode;
      let tbody = table.querySelector('tbody');
      sortArray.forEach((column) => {
        tbody.appendChild(column.row);
      });
    };
  });
}

/**
 * テーブルにフィルター機能を追加
 * 灰色のタイトル部分をクリックするとソートされる
 * 同じ項目をもう一度クリックすると逆順にソートされる
 * 数字しか入っていない列は数字として扱われる（小数点付きも数字として扱われる）
 * 1行でも文字列が含まれている列は文字列としてソートされる
 *
 * @param {String} targetId 対象テーブルID
 * @param {String} searchType 検索方法 'AND''OR'のどちらかを指定 デフォルトはand
 */
function addEventListenerOfFilterTable(targetId, searchType = 'AND') {
  const SEARCH_INPUT_CLASS_NAME = 'light-table-filter';
  const AND = 'AND';
  // inputボックスの追加
  const tableHeads = document.querySelectorAll('#' + targetId + ' th');
  // ２回実行された場合は追加しない
  if (
    tableHeads[0] != null &&
    tableHeads[0].querySelectorAll('.' + SEARCH_INPUT_CLASS_NAME).length == 0
  ) {
    tableHeads.forEach((elm) => {
      const csrfOutPut = document.createElement('input');
      csrfOutPut.className = SEARCH_INPUT_CLASS_NAME + ' form-control';
      csrfOutPut.type = 'search';
      csrfOutPut.placeholder = '検索';
      elm.appendChild(csrfOutPut);
    });

    /**
     * テーブルにフィルターイベントを追加
     *
     * @param {document} document ドキュメント
     */
    (function (document) {
      'use strict';
      const LightTableFilter = (function (Arr) {
        //let _input;
        const table = document.getElementById(targetId);
        const inputs = table.getElementsByClassName(SEARCH_INPUT_CLASS_NAME);

        /**
         * input入力時のイベント
         * フィルターの実施
         *
         * @param {any} e イベント
         */
        function _onInputEvent(e) {
          //_input = e.target;
          Arr.forEach.call(table.tBodies, function (tbody) {
            Arr.forEach.call(tbody.rows, _filter);
          });
        }

        /**
         * inputクリック時のイベント
         * 親要素のイベントを実行しないようにする
         *
         * @param {any} e イベント
         */
        function _onClickEvent(e) {
          //親要素のイベントを中止(ソートイベントをinputボックスをクリックしたときに起きなくする)
          e.stopPropagation();
        }

        /**
         * フィルター処理
         *
         * @param {Element} row テーブル1行
         */
        function _filter(row) {
          let isNone = false;
          let isBreak = false;
          Arr.forEach.call(inputs, function (input) {
            if (!isBreak) {
              if (input.value) {
                const columnNo = input.parentNode.cellIndex;
                const text = row.cells[columnNo].textContent.toLowerCase();
                const val = input.value.toLowerCase();
                if (searchType === AND) {
                  if (text.indexOf(val) === -1) {
                    isBreak = true;
                    isNone = true;
                  } else {
                    isNone = false;
                  }
                } else {
                  if (text.indexOf(val) > -1) {
                    isBreak = true;
                    isNone = false;
                  } else {
                    isNone = true;
                  }
                }
              }
            }
          });
          // const columnNo = _input.parentNode.cellIndex;
          // const text = row.cells[columnNo].textContent.toLowerCase();
          // const val = _input.value.toLowerCase();
          // row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
          row.style.display = isNone ? 'none' : 'table-row';
        }

        return {
          init: function () {
            Arr.forEach.call(inputs, function (input) {
              input.oninput = _onInputEvent;
              input.onclick = _onClickEvent;
            });
          },
        };
      })(Array.prototype);

      //document.addEventListener('readystatechange', function () {
      //if (document.readyState === 'complete') {
      LightTableFilter.init();
      //}
      //});
    })(document);
  }
}

/**
 * 数値ソート（昇順）
 *
 * @param {Number} a 比較対象a
 * @param {Number} b 比較対象b
 * @return ソート結果
 */
function compareNumber(a, b) {
  return a.value - b.value;
}

/**
 * 数値ソート（降順）
 *
 * @param {Number} a 比較対象a
 * @param {Number} b 比較対象b
 * @return ソート結果
 */
function compareNumberDesc(a, b) {
  return b.value - a.value;
}

/**
 * 文字列ソート（昇順）
 *
 * @param {string} a 比較対象a
 * @param {string} b 比較対象b
 * @return ソート結果
 */
function compareString(a, b) {
  return a.value < b.value ? -1 : 1;
}

/**
 * 文字列ソート（降順）
 *
 * @param {string} a 比較対象a
 * @param {string} b 比較対象b
 * @return ソート結果
 */
function compareStringDesc(a, b) {
  return a.value > b.value ? -1 : 1;
}
