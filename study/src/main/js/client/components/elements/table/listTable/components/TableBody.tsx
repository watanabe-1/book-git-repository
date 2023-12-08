import React from 'react';

import { TableRow } from '../../../../../../@types/studyUtilType';
import BodysLodingSpinner from '../../../spinner/BodysLodingSpinner';

type TableBodyProps = {
  /** 行 */
  filteredAndSortedRows: TableRow[];
};

const TableBody: React.FC<TableBodyProps> = ({ filteredAndSortedRows }) => {
  return (
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
  );
};

export default TableBody;
