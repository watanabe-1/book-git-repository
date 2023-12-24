import { Virtualizer } from '@tanstack/react-virtual';
import React from 'react';

import { TableRow } from '../../../../../../@types/studyUtilType';
import BodysLodingSpinner from '../../../spinner/BodysLodingSpinner';

type TableBodyProps = {
  /** 行 */
  filteredAndSortedRows: TableRow[];
  /** 表示制御用 */
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  /** テーブルの行の高さ */
  rowHight?: number;
};

const TableBody: React.FC<TableBodyProps> = ({
  filteredAndSortedRows,
  rowVirtualizer,
  rowHight,
}) => {
  const totalSize = rowVirtualizer.getTotalSize();
  const virtualRows = rowVirtualizer.getVirtualItems();

  // console.log(virtualRows);

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start ?? 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0;

  return (
    <tbody
      style={{
        height: `${totalSize}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {paddingTop > 0 && (
        <tr>
          <td style={{ height: `${paddingTop}px` }} />
        </tr>
      )}
      {virtualRows.map((virtualRow) => {
        const rowIndex = virtualRow.index;
        const row = filteredAndSortedRows[rowIndex];
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
          <tr key={rowId} hidden={row.hidden} style={{ height: rowHight }}>
            {row.cells.map((cell) => {
              return (
                <td
                  key={cell.name}
                  hidden={cell.hidden}
                  data-index={rowIndex}
                  ref={rowVirtualizer.measureElement}
                >
                  {cell.element}
                </td>
              );
            })}
          </tr>
        );
      })}
      {paddingBottom > 0 && (
        <tr>
          <td style={{ height: `${paddingBottom}px` }} />
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;
