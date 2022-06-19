/**
 * テーブルにソート機能を追加
 * 灰色のタイトル部分をクリックするとソートされる
 * 同じ項目をもう一度クリックすると逆順にソートされる
 * 数字しか入っていない列は数字として扱われる（小数点付きも数字として扱われる）
 * 1行でも文字列が含まれている列は文字列としてソートされる
 *
 * @param {String} targetId 対処テーブルID #を頭につける
 * @param {String} column_no_prev 前回クリックされた列番号
 */
function addEventListenerBySortTable(targetId) {
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
      this.appendChild(iEl);
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
