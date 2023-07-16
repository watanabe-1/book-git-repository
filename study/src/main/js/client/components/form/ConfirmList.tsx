import React from 'react';
import Table from 'react-bootstrap/Table';

import { FormConfirmData } from '../../../@types/studyUtilType';
import { typeConst } from '../../../constant/typeConstant';
import ImageIcon from '../elements/icon/ImageIcon';

type ConfirmListProps = {
  /** データ */
  listData: FormConfirmData[];
};

/**
 *
 * @returns form確認画面リスト表示用
 */
const ConfirmList: React.FC<ConfirmListProps> = (props: { listData }) => {
  return (
    <Table bordered>
      <thead>
        <tr>
          <th>項目</th>
          <th>入力内容</th>
        </tr>
      </thead>
      <tbody>
        {props.listData.map((elem) => {
          if (elem.type === typeConst.col.STRING) {
            return (
              <tr key={elem.id}>
                <td>{elem.name}</td>
                {elem.value && typeof elem.value === 'string' ? (
                  <td>{elem.value}</td>
                ) : (
                  <td>None</td>
                )}
              </tr>
            );
          } else if (elem.type === typeConst.col.IMAGE) {
            return (
              <tr key={elem.id}>
                <td>{elem.name}</td>
                {elem.value && typeof elem.value != 'string' ? (
                  <td>{<ImageIcon path={null} file={elem.value} />}</td>
                ) : (
                  <td>{<ImageIcon path={null} />}</td>
                )}
              </tr>
            );
          }
        })}
      </tbody>
    </Table>
  );
};

export default ConfirmList;
