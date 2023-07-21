import { format } from 'date-fns';
import { Japanese } from 'flatpickr/dist/l10n/ja';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';

import Calendar from './Calendar';
import Chart from './Chart';
import ListTable from './ListTable';
import { Books, HouseholdUi } from '../../../../../@types/studyUtilType';
import {
  parseDate,
  getNextMonthDate,
  getPreviousMonthDate,
  createDate,
} from '../../../../../study/util/studyDateUtil';
import MonthPickr from '../../../../components/elements/pickr/MonthPickr';
import { useHouseholdInfoSWR } from '../../../../hooks/useBooks';
import { useCommonInfoSWR } from '../../../../hooks/useCommon';
import { buildParam } from '../functions/param';
import { useDateParam, useTabParam } from '../hooks/useParam';

/**
 * HouseholdUiからDateを取得
 *
 * @param data HouseholdUi
 * @return Date
 */
const infoToDate = (data: HouseholdUi) =>
  createDate(data.year, data.month, data.day);

const TabContainer = () => {
  const { data: commonInfo, initScript: initCommonScript } = useCommonInfoSWR();
  const paramDate = useDateParam();
  const { data: info, initScript } = useHouseholdInfoSWR(
    buildParam(paramDate, commonInfo.dateFormat)
  );
  const navigate = useNavigate();
  const location = useLocation();
  const paramTab = useTabParam();

  const tab = paramTab ? paramTab : info.tab;
  const date = paramDate
    ? parseDate(paramDate, commonInfo.dateFormat)
    : infoToDate(info);
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
   * 次月のページに遷移
   */
  const pushNextHistory = async () => {
    pushHistory(getNextMonthDate(date), tab);
  };

  /**
   * 前月のページに遷移
   */
  const pushPreviousHistory = async () => {
    pushHistory(getPreviousMonthDate(date), tab);
  };

  /**
   * 指定の日付のページに繊維
   *
   * @param date
   */
  const pushJumpHistory = async (date: Date) => {
    pushHistory(date, tab);
  };

  /**
   * 指定のタブに繊維
   *
   */
  const pushTabHistory = async (tab: string) => {
    pushHistory(date, tab);
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
        date: format(date, commonInfo.dateFormat),
        tab: tab,
      }).toString(),
    });
  };

  // console.log(info);
  // console.log(tab);
  // console.log(date);

  const sumAmountByExpenses = sumAmount(info.expensesList);
  const sumAmountByIncome = sumAmount(info.incomeList);
  const differenceSumAmount = sumAmountByIncome - sumAmountByExpenses;

  // tabとtabで呼び出す画面の間に共通の項目を表示したいためTabsは使用せずカスタムtabを使用
  return (
    <>
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
            <MonthPickr
              year={parseInt(info.year)}
              month={parseInt(info.month)}
              locale={Japanese}
              onChange={pushJumpHistory}
            />
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
          <Tab.Pane eventKey="tab3">
            <Chart year={parseInt(info.year)} month={parseInt(info.month)} />
          </Tab.Pane>
          <Tab.Pane eventKey="tab4">
            <Calendar
              year={parseInt(info.year)}
              month={parseInt(info.month)}
              day={parseInt(info.day)}
            />
          </Tab.Pane>
        </Tab.Content>
        {initScript}
        {initCommonScript}
      </Tab.Container>
    </>
  );
};

export default TabContainer;
