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
  //window.addEventListener('load', function () {
  const targetThId = '#' + targetId + ' th';
  //今回クリックされた列番号
  let column_no = 0;
  //前回クリックされた列番号
  let column_no_prev = 0;
  document.querySelectorAll(targetThId).forEach((elm) => {
    elm.onclick = function () {
      column_no = this.cellIndex; //クリックされた列番号
      let table = this.parentNode.parentNode.parentNode;
      let sortType = 0; //0:数値 1:文字
      let sortArray = new Array(); //クリックした列のデータを全て格納する配列
      for (let r = 1; r < table.rows.length; r++) {
        //行番号と値を配列に格納
        let column = new Object();
        column.row = table.rows[r];
        column.value = table.rows[r].cells[column_no].textContent;
        sortArray.push(column);
        //数値判定
        if (isNaN(Number(column.value))) {
          sortType = 1; //値が数値変換できなかった場合は文字列ソート
        }
      }
      if (sortType == 0) {
        //数値ソート
        if (column_no_prev == column_no) {
          //同じ列が2回クリックされた場合は降順ソート
          sortArray.sort(compareNumberDesc);
        } else {
          sortArray.sort(compareNumber);
        }
      } else {
        //文字列ソート
        if (column_no_prev == column_no) {
          //同じ列が2回クリックされた場合は降順ソート
          sortArray.sort(compareStringDesc);
        } else {
          sortArray.sort(compareString);
        }
      }
      //ソート後のTRオブジェクトを順番にtbodyへ追加（移動）
      //let tbody = this.parentNode.parentNode;
      let tbody = table.querySelector('tbody');
      for (let i = 0; i < sortArray.length; i++) {
        tbody.appendChild(sortArray[i].row);
      }
      //昇順／降順ソート切り替えのために列番号を保存
      if (column_no_prev == column_no) {
        column_no_prev = -1; //降順ソート
      } else {
        column_no_prev = column_no;
      }
    };
  });
  //});
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
  if (a.value < b.value) {
    return -1;
  } else {
    return 1;
  }
  return 0;
}

/**
 * 文字列ソート（降順）
 *
 * @param {string} a 比較対象a
 * @param {string} b 比較対象b
 * @return ソート結果
 */
function compareStringDesc(a, b) {
  if (a.value > b.value) {
    return -1;
  } else {
    return 1;
  }
  return 0;
}
