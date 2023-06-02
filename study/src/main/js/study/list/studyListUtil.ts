/**
 * tableをソートする際に使用するarrayの1行を定義
 */
type SortArrayRecode = {
  row: HTMLTableRowElement;
  value: string;
};

/**
 * テーブルにソート機能を追加
 * テーブルにフィルター機能を追加
 *
 * @param {string} targetId 対象テーブルID
 * @param {string} searchType 検索方法 'AND''OR'のどちらかを指定 デフォルトはand
 */
export function addEventListenerOfSortAndFilterTable(
  targetId: string,
  searchType = 'AND'
): void {
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
 * @param {string} targetId 対象テーブルID
 */
function addEventListenerOfSortTable(targetId: string): void {
  const ASC = 'bi-caret-up-fill';
  const DESC = 'bi-caret-down-fill';
  const NUMBER_SORT = 0;

  document
    .querySelectorAll<HTMLTableCellElement>('#' + targetId + ' th')
    .forEach((elm) => {
      elm.onclick = function (this: HTMLTableCellElement) {
        const columnNo: number = this.cellIndex; // クリックされた列番号
        const table: HTMLTableElement = this.parentNode.parentNode
          .parentNode as HTMLTableElement;
        const beforeiEl: HTMLLIElement = (
          table.querySelector('.' + ASC) != null
            ? table.querySelector('.' + ASC)
            : table.querySelector('.' + DESC)
        ) as HTMLLIElement; // 前回付与されたソート順を示すアイコン
        let sortType = NUMBER_SORT; // 0:数値 1:文字
        const sortArray: SortArrayRecode[] = new Array<SortArrayRecode>(); // クリックした列のデータを全て格納する配列
        // 次のソート順を決定
        const order: string =
          beforeiEl == null ||
          columnNo !=
            (beforeiEl.parentNode as HTMLTableCellElement).cellIndex ||
          beforeiEl.className != ASC
            ? ASC
            : DESC;
        // 前回のソート順を示すアイコンを削除
        if (beforeiEl != null) {
          beforeiEl.remove();
        }
        // 今回のソート順を示すアイコンを付与
        const iEl: HTMLElement = document.createElement('i');
        iEl.className = order;
        this.prepend(iEl);
        for (let r = 1; r < table.rows.length; r++) {
          //行番号と値を配列に格納
          const column: SortArrayRecode = new Object() as SortArrayRecode;
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
            sortArray.sort(comparestringDesc);
          } else {
            sortArray.sort(comparestring);
          }
        }
        // ソート後のTRオブジェクトをソート順にtbodyへ追加（移動）
        // let tbody = this.parentNode.parentNode;
        const tbody = table.querySelector('tbody');
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
 * @param {string} targetId 対象テーブルID
 * @param {string} searchType 検索方法 'AND''OR'のどちらかを指定 デフォルトはand
 */
function addEventListenerOfFilterTable(
  targetId: string,
  searchType = 'AND'
): void {
  const SEARCH_INPUT_CLASS_NAME = 'light-table-filter';
  const AND = 'AND';
  // inputボックスの追加
  const tableHeads: NodeListOf<HTMLTableCellElement> =
    document.querySelectorAll<HTMLTableCellElement>('#' + targetId + ' th');
  // ２回実行された場合は追加しない
  if (
    tableHeads[0] != null &&
    tableHeads[0].querySelectorAll<HTMLInputElement>(
      '.' + SEARCH_INPUT_CLASS_NAME
    ).length == 0
  ) {
    tableHeads.forEach((elm) => {
      const csrfOutPut: HTMLInputElement = document.createElement('input');
      csrfOutPut.className = SEARCH_INPUT_CLASS_NAME + ' form-control';
      csrfOutPut.type = 'search';
      csrfOutPut.placeholder = '検索';
      elm.appendChild(csrfOutPut);
    });

    /**
     * テーブルにフィルターイベントを追加
     *
     * @param {Document} document ドキュメント
     */
    (function (document: Document) {
      'use strict';
      const LightTableFilter = (function (Arr) {
        //let _input;
        const table: HTMLTableElement = document.getElementById(
          targetId
        ) as HTMLTableElement;
        const inputs: HTMLCollectionOf<HTMLInputElement> =
          table.getElementsByClassName(
            SEARCH_INPUT_CLASS_NAME
          ) as HTMLCollectionOf<HTMLInputElement>;

        /**
         * input入力時のイベント
         * フィルターの実施
         *
         * @param {Event} e イベント
         */
        function _onInputEvent() {
          //_input = e.target;
          Arr.forEach.call(
            table.tBodies,
            function (tbody: HTMLTableSectionElement) {
              Arr.forEach.call(tbody.rows, _filter);
            }
          );
        }

        /**
         * inputクリック時のイベント
         * 親要素のイベントを実行しないようにする
         *
         * @param {Event} e イベント
         */
        function _onClickEvent(e: Event) {
          //親要素のイベントを中止(ソートイベントをinputボックスをクリックしたときに起きなくする)
          e.stopPropagation();
        }

        /**
         * フィルター処理
         *
         * @param {HTMLTableRowElement} row テーブル1行
         */
        function _filter(row: HTMLTableRowElement) {
          let isNone = false;
          let isBreak = false;
          Arr.forEach.call(inputs, function (input: HTMLInputElement) {
            if (!isBreak) {
              if (input.value) {
                const columnNo = (input.parentNode as HTMLTableCellElement)
                  .cellIndex;
                const text: string =
                  row.cells[columnNo].textContent.toLowerCase();
                const val: string = input.value.toLowerCase();
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
            Arr.forEach.call(inputs, function (input: HTMLInputElement) {
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
 * @param {string} a 比較対象a
 * @param {string} b 比較対象b
 * @return ソート結果
 */
function compareNumber(a: { value: string }, b: { value: string }) {
  return Number(a.value) - Number(b.value);
}

/**
 * 数値ソート（降順）
 *
 * @param {string} a 比較対象a
 * @param {string} b 比較対象b
 * @return ソート結果
 */
function compareNumberDesc(a: { value: string }, b: { value: string }) {
  return Number(b.value) - Number(a.value);
}

/**
 * 文字列ソート（昇順）
 *
 * @param {string} a 比較対象a
 * @param {string} b 比較対象b
 * @return ソート結果
 */
function comparestring(a: { value: string }, b: { value: string }) {
  return a.value < b.value ? -1 : 1;
}

/**
 * 文字列ソート（降順）
 *
 * @param {string} a 比較対象a
 * @param {string} b 比較対象b
 * @return ソート結果
 */
function comparestringDesc(a: { value: string }, b: { value: string }) {
  return a.value > b.value ? -1 : 1;
}
