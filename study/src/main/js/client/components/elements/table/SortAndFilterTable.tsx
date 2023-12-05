import { isNumber } from 'chart.js/helpers';
import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

import { TableColumn, TableRow } from '../../../../@types/studyUtilType';
import { iconConst } from '../../../../constant/iconConstant';
import TextBoxExclusionForm from '../../form/TextBoxExclusionForm';
import Icon from '../icon/Icon';
import BodysLodingSpinner from '../spinner/BodysLodingSpinner';
import '../../../../../css/view/table/autocomplete.css';

type SortAndFilterTableProps = {
  /** 列 */
  columns: TableColumn[];
  /** 行 */
  rows: TableRow[];
  /** ヘッダーをクリックしたときにソートを行うか */
  isSort?: boolean;
  /** ヘッダーにフィルター用検索ボックスを設置するか */
  isFilter?: boolean;
  /** サジェストをフィルター用検索ボックスに表示するか*/
  isSuggestions?: boolean;
  /** サジェストの表示件数 -数値を指定で全件表示*/
  maxSuggestions?: number;
  /** 正規化してから絞り込みをかけるか(主に半角、全角を区別なく検索できるようにするために使用する想定) */
  normalizeBeforeFilter?: boolean;
  /** 大文字小文字を区別して絞り込みをかけるか */
  caseSensitiveBeforeFilter?: boolean;
  /** ひらがなとかたかなを区別して絞り込みをかけるか*/
  separateHiraganaKatakanaBeforeFilter?: boolean;
};

// コンポーネントの外で定義すると、コンポーネントのレンダリングのたびに再定義されることを避ける
const ASCENDING = 'ASC';
const DESCENDING = 'DESC';

/**
 * ソート、フィルター可能なテーブル
 * @returns テーブル
 */
const SortAndFilterTable: React.FC<SortAndFilterTableProps> = ({
  columns: pColumns,
  rows: pRows,
  isSort = true,
  isFilter = true,
  isSuggestions = true,
  maxSuggestions = 5,
  normalizeBeforeFilter = true,
  caseSensitiveBeforeFilter = false,
  separateHiraganaKatakanaBeforeFilter = false,
}) => {
  // use stateでJSX.Elementを管理しようとすると、JSX.Elementに紐づいている
  // eventが正常に動作しなくなったため、JSX.Elementが入っているpRowsはuseState
  // で管理しない
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState(ASCENDING);
  const [columns, setColumns] = useState(pColumns);

  // console.log('pRows');
  // console.log(pRows);

  /**
   *  サジェスト関係stateの更新
   *
   * @param column TableColumn
   * @param showSuggestions
   * @param activeSuggestionIndex
   */
  const setSuggestions = (
    column: TableColumn,
    showSuggestions: boolean,
    activeSuggestionIndex: number
  ) => {
    setColumns((newCoumns) =>
      newCoumns.map((c) => {
        if (c.name === column.name) {
          return {
            ...c,
            showSuggestions: showSuggestions,
            activeSuggestionIndex: activeSuggestionIndex,
          };
        }
        return c;
      })
    );
  };

  /**
   * 並び替えの条件のセット
   * セットを行うとレンダリングが行われセットした値によって並び替えが実施される想定
   *
   * @param column TableColumn
   */
  const handleSort = (column: TableColumn) => {
    if (isSort) {
      const newDirection =
        sortColumn === column.name && sortDirection === ASCENDING
          ? DESCENDING
          : ASCENDING;

      setSortColumn(column.name);
      setSortDirection(newDirection);
    }
  };

  /**
   * 絞り込みを行うフィルター条件のセット
   * セットを行うとレンダリングが行われセットした値によって絞り込みが実施される想定
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleFilterChange = (column: TableColumn, value: string) => {
    if (isFilter) {
      setColumns((newColumns) =>
        newColumns.map((c) => {
          if (c.name === column.name) {
            return { ...c, filterValue: value };
          }
          return { ...c, showSuggestions: false };
        })
      );
      setSuggestions(column, true, 0);
    }
  };

  /**
   * 最初に入力ボックスをクリックしたらサジェストを出す
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleSuggestionClick = (column: TableColumn) => {
    //console.log('call handleSuggestionClick');
    // 値をセット
    if (isSuggestions) {
      setSuggestions(column, true, 0);
    }
  };

  /**
   * サジェストに出した値を入力値としてセット
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleSuggestionItemClick = (column: TableColumn, value: string) => {
    //console.log('call handleSuggestionItemClick');
    // 値をセット
    if (isSuggestions) {
      handleFilterChange(column, value);
    }
  };

  /**
   * フォーカスが外れたときはサジェストを表示しない
   * @param column TableColumn
   */
  const handleSuggestionBlur = (column: TableColumn) => {
    // console.log('call handleSuggestionFocus');

    // フォーカスが外れたときはサジェストを表示しない
    if (isSuggestions) {
      // サジェストリスト内の項目をクリックする時、
      // リストがすぐに非表示にならないようにする
      // ためにsetTimeout を使用
      // リストが非表示になるまで処理を遅延し、
      // ユーザーが項目をクリックするための時間を確保する
      setTimeout(() => {
        //console.log('call setTimeout handleSuggestionFocus');
        setSuggestions(column, false, 0);
      }, 250);
    }
  };

  const handleSuggestionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    column: TableColumn,
    filteredSuggestions
  ) => {
    if (isSuggestions && column.showSuggestions) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleFilterChange(
          column,
          filteredSuggestions[column.activeSuggestionIndex]
        );
        setSuggestions(column, false, 0);
      } else if (e.key === 'ArrowUp') {
        if (column.activeSuggestionIndex === 0) {
          setSuggestions(column, true, filteredSuggestions.length - 1);
          return;
        }
        setSuggestions(column, true, column.activeSuggestionIndex - 1);
      } else if (e.key === 'ArrowDown') {
        if (column.activeSuggestionIndex === filteredSuggestions.length - 1) {
          setSuggestions(column, true, 0);
          return;
        }
        setSuggestions(column, true, column.activeSuggestionIndex + 1);
      }
    }
  };

  /**
   * nameが一致するcellを取得
   *
   * @param row TableRow
   * @param name cell名
   * @returns cell
   */
  const findCell = (row: TableRow, name: string) =>
    row.cells.find((cell) => cell.name === name);

  let filteredAndSortedRows = pRows;
  if (isFilter) {
    /**
     * 正規化を行う
     * @param str 正規化対象
     * @returns
     */
    const normalizeString = (str: string): string => {
      return str.normalize('NFKC');
    };
    /**
     * ひらがなからカタカナに変換
     * @param str 変換対象
     * @returns
     */
    const hiraToKata = (str: string) => {
      return str.replace(/[\u3041-\u3096]/g, (match) => {
        const charCode = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(charCode);
      });
    };
    // /**
    //  * カタカナからひらがなに変換
    //  * @param str 変換対象
    //  * @returns
    //  */
    // const kataToHira = (str: string) => {
    //   return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    //     const charCode = match.charCodeAt(0) - 0x60;
    //     return String.fromCharCode(charCode);
    //   });
    // };

    filteredAndSortedRows = pRows.map((row) => {
      row.hidden = !columns.every((column) => {
        if (column.filterValue === '') {
          return true;
        }
        const cell = findCell(row, column.name);

        let rowValue = String(cell.textValue);
        let colValaue = column.filterValue;

        // 正規化する(主に半角全角などを区別したくないときに使用する想定)
        if (normalizeBeforeFilter) {
          rowValue = normalizeString(rowValue);
          colValaue = normalizeString(colValaue);
        }

        // 大文字小文字を区別しない
        if (!caseSensitiveBeforeFilter) {
          rowValue = rowValue.toLowerCase();
          colValaue = colValaue.toLowerCase();
        }

        // ひらがなとカタカナを区別しない
        if (!separateHiraganaKatakanaBeforeFilter) {
          rowValue = hiraToKata(rowValue);
          colValaue = hiraToKata(colValaue);
        }

        return rowValue.includes(colValaue);
      });

      return row;
    });
  }

  if (sortColumn && isSort) {
    filteredAndSortedRows = filteredAndSortedRows.sort((aRow, bRow) => {
      const aCell = findCell(aRow, sortColumn);
      const bCell = findCell(bRow, sortColumn);
      let aValue: string | number = aCell.textValue;
      let bValue: string | number = bCell.textValue;

      if (isNumber(aValue) && isNumber(bValue)) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) {
        return sortDirection === ASCENDING ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === ASCENDING ? 1 : -1;
      }
      return 0;
    });
  }

  let filteredSuggestions = [];
  if (isSuggestions) {
    // サジェスト対象
    const column = columns.find((column) => column.showSuggestions);
    // どのボックスもサジェスト対象になっていないとき
    if (column) {
      filteredSuggestions = filteredAndSortedRows
        .filter((row) => !row.hidden)
        .map((row) => findCell(row, column.name).textValue)
        // 重複除外
        .filter((textValue, index, self) => self.indexOf(textValue) === index)
        .slice(0, maxSuggestions);
    }
  }
  return (
    <Table bordered>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.name}
              onClick={() => handleSort(column)}
              style={isSort ? { cursor: 'pointer' } : null}
              hidden={column.hidden}
            >
              {column.value}
              {isSort && sortColumn === column.name && (
                <span>
                  {sortDirection === ASCENDING ? (
                    <Icon icon={iconConst.bootstrap.BI_CARET_UP_FILL} />
                  ) : (
                    <Icon icon={iconConst.bootstrap.BI_CARET_DOWN_FILL} />
                  )}
                </span>
              )}
              {isFilter && (
                <div>
                  <TextBoxExclusionForm
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSuggestionClick(column);
                    }}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    value={column.filterValue}
                    onBlur={() => {
                      handleSuggestionBlur(column);
                    }}
                    onKeyDown={(e) => {
                      handleSuggestionKeyDown(e, column, filteredSuggestions);
                    }}
                  />
                  {column.showSuggestions && (
                    <ListGroup className="suggestionsContainer">
                      {filteredSuggestions.map((textValue, index) => {
                        return (
                          <ListGroup.Item
                            key={index}
                            // 十字キーで選択されているとき
                            variant={
                              index === column.activeSuggestionIndex
                                ? 'dark'
                                : ''
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuggestionItemClick(column, textValue);
                              // action=trueが設定されているときにformの中にクリック項目があるとformが送信されてしまうため、ここでeventがこれ以上伝搬することを防ぐ
                              e.preventDefault();
                            }}
                            action
                          >
                            {textValue}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  )}
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredAndSortedRows.map((row, rowIndex) => {
          const rowId = row.primaryKey;
          // console.log(`rowId:${rowId}`);
          // おそらく連携パラメータが非同期実行などで取得したときなど、primaryKeyが取得できないときがある？ため、その場合はロード中の列を返却する
          if (!rowId) {
            return (
              <tr key={rowIndex}>
                <td>
                  <BodysLodingSpinner />
                </td>
              </tr>
            );
          }
          return (
            <tr key={rowId} hidden={row.hidden}>
              {row.cells.map((cell) => {
                return (
                  <td
                    key={cell.name}
                    hidden={cell.hidden}
                    className="text-nowrap"
                  >
                    {cell.element}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default SortAndFilterTable;
