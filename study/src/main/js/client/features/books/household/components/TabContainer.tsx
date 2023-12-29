import { format } from 'date-fns/format';
import React, { useCallback, useMemo } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';

import Calendar from './Calendar';
import Chart from './Chart';
import ListTable from './ListTable';
import {
  parseDate,
  getNextMonthDate,
  getPreviousMonthDate,
} from '../../../../../study/util/studyDateUtil';
import MonthPickr from '../../../../components/elements/pickr/MonthPickr';
import {
  useHouseholdChartInfoStaticKeySWR,
  useHouseholdDataSWR,
  useHouseholdInfoSWR,
} from '../../../../hooks/useBooks';
import { useCommonInfoSWR } from '../../../../hooks/useCommon';
import { infoToDate, sumAmount } from '../functions/booksUtils';
import { buildDataParam, buildInfoParam } from '../functions/param';
import { useDateParam, useTabParam } from '../hooks/useParam';

const TabContainer = () => {
  const { data: commonInfo, initScript: initCommonScript } = useCommonInfoSWR();

  const paramDate = useDateParam();

  const infoParam = useMemo(
    () => buildInfoParam(paramDate, commonInfo.dateFormat),
    [paramDate, commonInfo.dateFormat]
  );
  const { data: info, initScript } = useHouseholdInfoSWR(infoParam);

  const dataParamExpenses = useMemo(
    () =>
      buildDataParam(paramDate, commonInfo.dateFormat, info.booksTypeExpenses),
    [paramDate, commonInfo.dateFormat, info.booksTypeExpenses]
  );
  const { data: expensesList, initScript: initExpensesListScript } =
    useHouseholdDataSWR(dataParamExpenses);

  const dataParamIncome = useMemo(
    () =>
      buildDataParam(paramDate, commonInfo.dateFormat, info.booksTypeIncome),
    [paramDate, commonInfo.dateFormat, info.booksTypeIncome]
  );
  const { data: incomeList, initScript: initIncomeListScript } =
    useHouseholdDataSWR(dataParamIncome);

  // 初期値を設定
  useHouseholdChartInfoStaticKeySWR(1);
  const navigate = useNavigate();
  const location = useLocation();
  const paramTab = useTabParam();

  const tab = paramTab ? paramTab : info.tab;
  const date = useMemo(
    () =>
      paramDate
        ? parseDate(paramDate, commonInfo.dateFormat)
        : infoToDate(info),
    [paramDate, commonInfo.dateFormat, info]
  );

  /**
   * uelの書き換えを行い、ページ遷移する
   *
   * @param date 日付け
   * @param tab タブ
   */
  const pushHistory = useCallback(
    (date: Date, tab: string) => {
      // navigateを使用してページ遷移を行う
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          date: format(date, commonInfo.dateFormat),
          tab: tab,
        }).toString(),
      });
    },
    [navigate, location.pathname, commonInfo.dateFormat]
  );

  /**
   * 次月のページに遷移
   */
  const pushNextHistory = useCallback(() => {
    pushHistory(getNextMonthDate(date), tab);
  }, [pushHistory, date, tab]);

  /**
   * 前月のページに遷移
   */
  const pushPreviousHistory = useCallback(() => {
    pushHistory(getPreviousMonthDate(date), tab);
  }, [pushHistory, date, tab]);

  /**
   * 指定の日付のページに繊維
   *
   * @param date
   */
  const pushJumpHistory = useCallback(
    (date: Date) => {
      pushHistory(date, tab);
    },
    [tab]
  );

  /**
   * 指定のタブに繊維
   *
   */
  const pushTabHistory = useCallback(
    (tab: string) => {
      pushHistory(date, tab);
    },
    [date]
  );

  // console.log(info);
  // console.log(tab);
  // console.log(date);

  const expensesAmount = useMemo(
    () => sumAmount(expensesList.booksDataList),
    [expensesList]
  );
  const incomeAmount = useMemo(
    () => sumAmount(incomeList.booksDataList),
    [incomeList]
  );
  const differenceSumAmount = useMemo(
    () => incomeAmount - expensesAmount,
    [expensesAmount, incomeAmount]
  );

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
            <Nav.Item>
              <Nav.Link eventKey="tab5">カレンダー_収入</Nav.Link>
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
            onChange={pushJumpHistory}
          />
        </Col>
        <Col md={2}>
          <span>{`総支出:${expensesAmount}`}</span>
        </Col>
        <Col md={2}>
          <span>{`総収入:${incomeAmount}`}</span>
        </Col>
        <Col md={2}>
          <span> {`貯金額:${differenceSumAmount}`}</span>
        </Col>
      </Row>
      <Tab.Content>
        <Tab.Pane eventKey="tab1" mountOnEnter>
          <ListTable booksType={info.booksTypeExpenses} />
        </Tab.Pane>
        <Tab.Pane eventKey="tab2" mountOnEnter>
          <ListTable booksType={info.booksTypeIncome} />
        </Tab.Pane>
        <Tab.Pane eventKey="tab3" mountOnEnter>
          <Chart />
        </Tab.Pane>
        <Tab.Pane eventKey="tab4" mountOnEnter>
          <Calendar booksType={info.booksTypeExpenses} />
        </Tab.Pane>
        <Tab.Pane eventKey="tab5" mountOnEnter>
          <Calendar booksType={info.booksTypeIncome} />
        </Tab.Pane>
      </Tab.Content>
      {initScript}
      {initCommonScript}
      {initExpensesListScript}
      {initIncomeListScript}
    </Tab.Container>
  );
};

export default TabContainer;
