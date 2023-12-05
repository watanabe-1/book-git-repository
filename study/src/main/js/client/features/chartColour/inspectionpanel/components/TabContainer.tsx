import React from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';

import ListTable from './ListTable';
import Top from './Top';
import {
  useChartColourListSWR,
  useInspectionPanelInfoSWR,
} from '../../../../hooks/useChartColour';
import { useCommonInfoSWR } from '../../../../hooks/useCommon';
import { useTabParam } from '../hooks/useParam';

const TabContainer = () => {
  const { initScript: initCommonScript } = useCommonInfoSWR();

  const { data: info, initScript } = useInspectionPanelInfoSWR();

  const { initScript: listScript } = useChartColourListSWR();

  const navigate = useNavigate();
  const location = useLocation();
  const paramTab = useTabParam();

  const tab = paramTab ? paramTab : info.tab;

  /**
   * 指定のタブに繊維
   *
   */
  const pushTabHistory = (tab: string) => {
    pushHistory(tab);
  };

  /**
   * uelの書き換えを行い、ページ遷移する
   *
   * @param date 日付け
   * @param tab タブ
   */
  const pushHistory = (tab: string) => {
    // navigateを使用してページ遷移を行う
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        tab: tab,
      }).toString(),
    });
  };

  // tabとtabで呼び出す画面の間に共通の項目を表示したいためTabsは使用せずカスタムtabを使用
  return (
    <Tab.Container
      id="controlled-household-tab"
      activeKey={tab}
      onSelect={(key) => {
        pushTabHistory(key);
      }}
    >
      <Row>
        <Col>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="tab1">設定済みテンプレート</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab2">リスト</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab3">ランダム</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab4">手動で登録</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* 表示調整用空行の追加 */}
          <br />
        </Col>
      </Row>
      <Tab.Content>
        <Tab.Pane eventKey="tab1" mountOnEnter>
          <Top />
        </Tab.Pane>
        <Tab.Pane eventKey="tab2" mountOnEnter>
          <ListTable />
        </Tab.Pane>
        <Tab.Pane eventKey="tab3" mountOnEnter>
          {/* <Chart /> */}
        </Tab.Pane>
        <Tab.Pane eventKey="tab4" mountOnEnter>
          {/* <Calendar booksType={info.booksTypeExpenses} /> */}
        </Tab.Pane>
      </Tab.Content>
      {initScript}
      {initCommonScript}
      {listScript}
    </Tab.Container>
  );
};

export default TabContainer;
