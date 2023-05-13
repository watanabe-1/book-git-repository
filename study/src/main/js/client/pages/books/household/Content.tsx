import React, { useEffect, useState } from 'react';
import BodysHead from '../../../components/BodysHead';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { Books } from '../../../../@types/studyUtilType';
import { executeFuncIfNeeded, onServer } from '../../../on-server';
import {
  fetchGet,
  getLocationHrefParm,
  getStudyDate,
  nullOrEmptyValueLogic,
} from '../../../../study/util/studyUtil';
import { UrlConst } from '../../../../constant/urlConstant';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import {
  getNextMonthDate,
  getPreviousMonthDate,
} from '../../../../study/util/studyDateUtil';
import ListTable from './ListTable';

/**
 * 家計簿確認用データ
 */
export type HouseHoldData = {
  expensesList: Books[];
  incomeList: Books[];
  year: string;
  month: string;
  tab: string;
};

const Content = () => {
  const [initialInfo, initScript] = onServer(
    (api, param) => api.getHouseholdInfo(param),
    [],
    'books.householdInfo'
  ) as [HouseHoldData, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
  const [key, setKey] = useState(info.tab);

  /**
   * 家計簿データの金額の合計を取得する
   *
   * @param booksList 家計簿データの配列
   */
  const sumAmount = (booksList: Books[]) => {
    return booksList
      .map((books) => books.booksAmmount)
      .reduce((sum, booksAmmount) => sum + booksAmmount, 0);
  };

  /**
   * 画面情報取得
   */
  const fetchInfo = async (date?: Date) => {
    const paramTab = nullOrEmptyValueLogic(getLocationHrefParm('tab'), '');
    const paramDate = date
      ? date
      : nullOrEmptyValueLogic(getLocationHrefParm('date'), null);
    const params = {};
    if (paramTab) params['tab'] = paramTab;
    if (paramDate) params['date'] = paramDate;
    const response = await fetchGet(UrlConst.Books.HOUSEHOLD_INFO, params);
    const info = (await response.json()) as HouseHoldData;
    setInfo(info);
    setKey(info.tab);
  };

  /**
   * 次月の画面情報取得
   * @param year 年
   * @param month 月
   */
  const fetchNextInfo = async (year: string, month: string) => {
    const date = new Date(parseInt(year), parseInt(month));
    fetchInfo(getNextMonthDate(date));
  };

  /**
   * 前月の画面情報取得
   * @param year 年
   * @param month 月
   */
  const fetchPreviousInfo = async (year: string, month: string) => {
    const date = new Date(parseInt(year), parseInt(month));
    fetchInfo(getPreviousMonthDate(date));
  };

  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(fetchInfo);
  }, []);

  console.log(info);
  console.log(key);
  // 非同期が完了するまで次の処理に進まない
  if (!info.expensesList) return <BodysLodingSpinner />;

  const sumAmountByExpenses = sumAmount(info.expensesList);
  const sumAmountByIncome = sumAmount(info.incomeList);
  const differenceSumAmount = sumAmountByIncome - sumAmountByExpenses;

  // tabとtabで呼び出す画面の間に共通の項目を表示したいためTabsは使用せずカスタムtabを使用
  return (
    <div>
      <BodysHead title="家計簿確認画面" />
      <Tab.Container
        id="controlled-household-tab"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Row>
          <Col>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="tab1">リスト_支出</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab2">リスト_収入</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab3">グラフ</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab4">カレンダー_支出</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <a
              className="btn btn-link"
              onClick={() => fetchPreviousInfo(info.year, info.month)}
            >
              <span>前月</span>
            </a>
            <span>{`${info.year}年${info.month}月`}</span>
            <a
              className="btn btn-link"
              onClick={() => fetchNextInfo(info.year, info.month)}
            >
              <span>次月</span>
            </a>
          </Col>
          <Col md={2}>
            <span>{`総支出:${sumAmountByExpenses}`}</span>
          </Col>
          <Col md={2}>
            <span>{`総収入:${sumAmountByIncome}`}</span>
          </Col>
          <Col md={2}>
            <span> {`貯金額:${differenceSumAmount}`}</span>
          </Col>
        </Row>
        <Tab.Content>
          <Tab.Pane eventKey="tab1">
            <ListTable booksList={info.expensesList} />
          </Tab.Pane>
          <Tab.Pane eventKey="tab2">
            <ListTable booksList={info.incomeList} />
          </Tab.Pane>
          <Tab.Pane eventKey="tab3">Third tab content</Tab.Pane>
          <Tab.Pane eventKey="tab4">Fourth tab content</Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      {initScript}
    </div>
  );
};

export default Content;
