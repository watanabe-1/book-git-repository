import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { TableColumn, TableRow } from '../../@types/studyUtilType';

import TextBoxExclusionForm from './TextBoxExclusionForm';

/**
 * ソート、フィルター可能なテーブル
 * @returns テーブル
 */
const SortAndFilterTable = ({
  pColumns,
  pRows,
}: {
  pColumns: TableColumn[];
  pRows: TableRow[];
}) => {
  // const [tableData, setTableData] = useState({
  //   columns: pColumns,
  //   rows: pRows,
  //   sortColumn: '',
  //   sortDirection: 'asc',
  // });

  // use stateでJSX.Elementを管理しようとすると、JSX.Elementに紐づいている
  // eventが正常に動作しなくなったため、JSX.Elementが入っているpRowsはuseState
  // で管理しない
  const [sortData, setSortData] = useState({
    columns: pColumns,
    sortColumn: '',
    sortDirection: 'asc',
  });

  const handleSort = (column) => {
    const { sortColumn, sortDirection } = sortData;

    let newDirection = 'asc';
    if (sortColumn === column.name && sortDirection === 'asc') {
      newDirection = 'desc';
    }

    // setTableData({
    //   ...tableData,
    //   rows: sortedRows,
    //   sortColumn: column.name,
    //   sortDirection: newDirection,
    // });
    setSortData({
      ...sortData,
      sortColumn: column.name,
      sortDirection: newDirection,
    });
  };

  const handleFilterChange = (column, value) => {
    const newColumns = pColumns.map((c) => {
      if (c.name === column.name) {
        return { ...c, filterValue: value };
      }
      return c;
    });
    setSortData({
      ...sortData,
      columns: newColumns,
    });
  };

  const { columns, sortColumn, sortDirection } = sortData;

  let filteredAndSortedRows = pRows.filter((row) => {
    return columns.every((column) => {
      if (column.filterValue === '') {
        return true;
      }
      const cell = row.cells.find((cell) => cell.name == column.name);
      const rowValue = String(cell.value).toLowerCase();
      return rowValue.includes(column.filterValue.toLowerCase());
    });
  });

  if (sortColumn) {
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
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
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
              style={{ cursor: 'pointer' }}
              hidden={column.hidden}
            >
              {column.value}
              {sortColumn === column.name && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
              <div key={column.name}>
                <TextBoxExclusionForm
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleFilterChange(column, e.target.value)}
                />
              </div>
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
