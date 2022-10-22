import React from 'react';
import Table from 'react-bootstrap/Table';
import { FormConfirmData } from '../../@types/studyUtilType';

/**
 *
 * @returns form確認画面リスト表示用
 */
const ConfirmList = (props: { listData: FormConfirmData[] }) => {
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
          if (elem.type == 'STRING') {
            return (
              <tr key={elem.id}>
                <td>{elem.name}</td>
                {elem.value ? <td>{elem.value}</td> : <td>None</td>}
              </tr>
            );
          } else if (elem.type == 'IMAGE') {
            return (
              <tr key={elem.id}>
                <td>{elem.name}</td>
                {elem.value ? (
                  <td>{<img width="50" height="30" src={elem.value} />}</td>
                ) : (
                  <td>None</td>
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
