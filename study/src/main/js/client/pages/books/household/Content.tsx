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
  nullOrEmptyValueLogic,
} from '../../../../study/util/studyUtil';
import { UrlConst } from '../../../../constant/urlConstant';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import {
  getNextMonthDate,
  getPreviousMonthDate,
} from '../../../../study/util/studyDateUtil';
import ListTable from './ListTable';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';

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

/**
 * HouseHoldDataからDateを取得
 * @param data HouseHoldData
 * @returns Date
 */
const infoToDate = (data: HouseHoldData) =>
  new Date(parseInt(data.year), parseInt(data.month));

const Content = () => {
  const [initialInfo, initScript] = onServer(
    (api, param) => api.getHouseholdInfo(param),
    [],
    'books.householdInfo'
  ) as [HouseHoldData, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
  const [key, setKey] = useState(info.tab);
  const [date, setDate] = useState(infoToDate(info));
  const navigate = useNavigate();
  const location = useLocation();

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
  const fetchInfo = async () => {
    //console.log('------fetchInfo yobidasareta-----');
    // useSearchParamsはサーバー側で実行できないので一旦使用しない なにか解決策がわかれば変更する予定
    const paramTab = nullOrEmptyValueLogic(getLocationHrefParm('tab'), key);
    const paramDate = nullOrEmptyValueLogic(getLocationHrefParm('date'), date);
    const params = {};
    if (paramTab) params['tab'] = paramTab;
    if (paramDate) params['date'] = paramDate;
    const response = await fetchGet(UrlConst.Books.HOUSEHOLD_INFO, params);
    const info = (await response.json()) as HouseHoldData;
    setInfo(info);
    setKey(info.tab);
    setDate(infoToDate(info));
  };

  /**
   * 次月のページに遷移
   */
  const pushNextHistory = async () => {
    pushHistory(getNextMonthDate(date), key);
  };

  /**
   * 前月のページに遷移
   */
  const pushPreviousHistory = async () => {
    pushHistory(getPreviousMonthDate(date), key);
  };

  /**
   * uelの書き換えを行い、ページ遷移する
   *
   * @param date 日付け
   * @param tab タブ
   */
  const pushHistory = (date: Date, tab: string) => {
    // navigateを使用してページ遷移を行う
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        date: String(date),
        tab: tab,
      }).toString(),
    });
  };

  useEffect(() => {
    // console.log('useEffect yobidasareta');
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(fetchInfo);
  }, [location]);

  console.log(info);
  console.log(key);
  console.log(date);
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
            <a className="btn btn-link" onClick={() => pushPreviousHistory()}>
              <span>前月</span>
            </a>
            <span>{`${info.year}年${info.month}月`}</span>
            <a className="btn btn-link" onClick={() => pushNextHistory()}>
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
