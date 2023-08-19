import { isNumber } from 'chart.js/helpers';
import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';

import { TableColumn, TableRow } from '../../../../@types/studyUtilType';
import { iconConst } from '../../../../constant/iconConstant';
import TextBoxExclusionForm from '../../form/TextBoxExclusionForm';
import Icon from '../icon/Icon';
import BodysLodingSpinner from '../spinner/BodysLodingSpinner';

type SortAndFilterTableProps = {
  pColumns: TableColumn[];
  pRows: TableRow[];
  isSort?: boolean;
  isFilter?: boolean;
};

/**
 * ソート、フィルター可能なテーブル
 * @returns テーブル
 */
const SortAndFilterTable: React.FC<SortAndFilterTableProps> = ({
  pColumns,
  pRows,
  isSort = true,
  isFilter = true,
}) => {
  const ASCENDING = 'ASC';
  const DESCENDING = 'DESC';

  // const [tableData, setTableData] = useState({
  //   columns: pColumns,
  //   rows: pRows,
  //   sortColumn: '',
  //   sortDirection: ASCENDING,
  // });

  // use stateでJSX.Elementを管理しようとすると、JSX.Elementに紐づいている
  // eventが正常に動作しなくなったため、JSX.Elementが入っているpRowsはuseState
  // で管理しない
  const [tableData, setTableData] = useState({
    columns: pColumns,
    sortColumn: '',
    sortDirection: ASCENDING,
  });

  // console.log('pRows');
  // console.log(pRows);

  /**
   * 並び替えの条件のセット
   * セットを行うとレンダリングが行われセットした値によって並び替えが実施される想定
   *
   * @param column TableColumn
   */
  const handleSort = (column: TableColumn) => {
    if (isSort) {
      const { sortColumn, sortDirection } = tableData;

      const newDirection =
        sortColumn === column.name && sortDirection === ASCENDING
          ? DESCENDING
          : ASCENDING;

      // setTableData({
      //   ...tableData,
      //   rows: sortedRows,
      //   sortColumn: column.name,
      //   sortDirection: newDirection,
      // });
      setTableData({
        ...tableData,
        sortColumn: column.name,
        sortDirection: newDirection,
      });
    }
  };

  const { columns, sortColumn, sortDirection } = tableData;

  /**
   * 絞り込みを行うフィルター条件のセット
   * セットを行うとレンダリングが行われセットした値によって絞り込みが実施される想定
   *
   * @param column TableColumn
   * @param value 値
   */
  const handleFilterChange = (column: TableColumn, value: string) => {
    if (isFilter) {
      const newColumns = columns.map((c) => {
        if (c.name === column.name) {
          return { ...c, filterValue: value };
        }
        return c;
      });
      setTableData({
        ...tableData,
        columns: newColumns,
      });
    }
  };

  let filteredAndSortedRows = pRows;
  if (isFilter) {
    filteredAndSortedRows = pRows.filter((row) => {
      return columns.every((column) => {
        if (column.filterValue === '') {
          return true;
        }
        const cell = row.cells.find((cell) => cell.name === column.name);
        const rowValue = String(cell.textValue).toLowerCase();
        return rowValue.includes(column.filterValue.toLowerCase());
      });
    });
  }

  if (sortColumn && isSort) {
    /**
     * nameが一致するcellを取得
     *
     * @param row TableRow
     * @returns cell
     */
    const findCell = (row: TableRow) =>
      row.cells.find((cell) => cell.name === sortColumn);

    filteredAndSortedRows = filteredAndSortedRows.sort((aRow, bRow) => {
      const aCell = findCell(aRow);
      const bCell = findCell(bRow);
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
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                  />
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
            <tr key={rowId}>
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
