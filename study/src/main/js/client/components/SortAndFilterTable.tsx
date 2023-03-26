import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { TableColumn, TableRow } from '../../@types/studyUtilType';
import { IconConst } from '../../constant/iconConst';
import Icon from './Icon';

import TextBoxExclusionForm from './TextBoxExclusionForm';

/**
 * ソート、フィルター可能なテーブル
 * @returns テーブル
 */
const SortAndFilterTable = ({
  pColumns,
  pRows,
  isSort = true,
  isFilter = true,
}: {
  pColumns: TableColumn[];
  pRows: TableRow[];
  isSort?: boolean;
  isFilter?: boolean;
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

  const handleSort = (column) => {
    if (isSort) {
      const { sortColumn, sortDirection } = tableData;

      let newDirection = ASCENDING;
      if (sortColumn === column.name && sortDirection === ASCENDING) {
        newDirection = DESCENDING;
      }

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
  const handleFilterChange = (column, value) => {
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
        const cell = row.cells.find((cell) => cell.name == column.name);
        const rowValue = String(cell.value).toLowerCase();
        return rowValue.includes(column.filterValue.toLowerCase());
      });
    });
  }

  if (sortColumn && isSort) {
    filteredAndSortedRows = filteredAndSortedRows.sort((aRow, bRow) => {
      const aCell = aRow.cells.find((cell) => cell.name == sortColumn);
      const bCell = bRow.cells.find((cell) => cell.name == sortColumn);
      let aValue = aCell.value;
      let bValue = bCell.value;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
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
                    <Icon icon={IconConst.BootStrap.BI_CARET_UP_FILL} />
                  ) : (
                    <Icon icon={IconConst.BootStrap.BI_CARET_DOWN_FILL} />
                  )}
                </span>
              )}
              {isFilter && (
                <div key={column.name}>
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
        {filteredAndSortedRows.map((row, index) => {
          return (
            <tr key={index}>
              {row.cells.map((cell) => {
                return <td hidden={cell.hidden}>{cell.element}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default SortAndFilterTable;
