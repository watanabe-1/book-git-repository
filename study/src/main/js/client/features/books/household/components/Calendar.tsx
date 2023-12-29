import cn from 'classnames';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { eachWeekOfInterval } from 'date-fns/eachWeekOfInterval';
import { endOfMonth } from 'date-fns/endOfMonth';
import { endOfWeek } from 'date-fns/endOfWeek';
import { getDate } from 'date-fns/getDate';
import { getDay } from 'date-fns/getDay';
import { getMonth } from 'date-fns/getMonth';
import { startOfMonth } from 'date-fns/startOfMonth';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/table';

import ListTable from './ListTable';
import { Syukujits } from '../../../../../@types/studyUtilType';
import { createDate, parseDate } from '../../../../../study/util/studyDateUtil';
import { isObjEmpty } from '../../../../../study/util/studyUtil';
import {
  useHouseholdCalendarInfoSWR,
  useHouseholdDataSWR,
  useHouseholdInfoSWR,
} from '../../../../hooks/useBooks';
import { useCommonInfoSWR } from '../../../../hooks/useCommon';
import { buildDataParam, buildInfoParam } from '../functions/param';
import { useDateParam } from '../hooks/useParam';

import '../../../../../../css/view/calendar/calendar.css';

/**
 * 家計簿カレンダー用データ
 */
export type HouseholdCalendarData = {
  syukujitsuList: Syukujits[];
};

/**
 * プロップス
 */
type CalendarProps = {
  /** 家計簿タイプ */
  booksType: string;
};

const Calendar: React.FC<CalendarProps> = ({ booksType }) => {
  const [, startTransition] = useTransition();
  const { data: commonInfo } = useCommonInfoSWR();
  const paramDate = useDateParam();

  const infoParam = useMemo(
    () => buildInfoParam(paramDate, commonInfo.dateFormat),
    [paramDate, commonInfo.dateFormat]
  );
  const { data: info } = useHouseholdInfoSWR(infoParam);

  const { data: calendarData, initScript } =
    useHouseholdCalendarInfoSWR(infoParam);

  const dataParam = useMemo(
    () => buildDataParam(paramDate, commonInfo.dateFormat, booksType),
    [paramDate, commonInfo.dateFormat, booksType]
  );
  const { data: booksFormList } = useHouseholdDataSWR(dataParam);

  const year = useMemo(() => parseInt(info.year), [info.year]);
  const month = useMemo(() => parseInt(info.month), [info.month]);
  const date = useMemo(
    () => createDate(info.year, info.month, info.day),
    [info.year, info.month, info.day]
  );
  const [selectDay, setSelectDay] = useState(date);

  const { syukujitsuList } = calendarData;
  const amountList = booksFormList.booksDataList;

  // console.log('calendardata');
  // console.log(calendarData);
  /**
   * 年月日が同じかどうか比較
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @param {Date} date 日付け 比較対象
   * @return {boolean} 判定結果
   */
  const equalsYearMonthDay = useCallback(
    (year: number, month: number, day: number, date: Date) => {
      // console.log(`year:${year}`);
      // console.log(`month:${month}`);
      // console.log(`day:${day}`);
      // console.log(`date:${date}`);

      return (
        year === date.getFullYear() &&
        month === date.getMonth() + 1 &&
        day === date.getDate()
      );
    },
    []
  );

  /**
   * 選択された日付けかどうか
   *
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @return {boolean} 判定結果
   */
  const isSelectday = useCallback(
    (year: number, month: number, day: number): boolean => {
      // console.log(`year:${year}`);
      // console.log(`month:${month}`);
      // console.log(`day:${day}`);
      // console.log(`date:${date}`);
      return equalsYearMonthDay(year, month, day, selectDay);
    },
    [selectDay, equalsYearMonthDay]
  );

  /**
   * 土曜日かどうか
   *
   * @param {number} weekCnt 週(日を0とし、月が1……と続き、土の6で終わる数値)
   * @return {boolean} 判定結果
   */
  const isSaturday = useCallback((weekCnt: number) => {
    return weekCnt === 6;
  }, []);

  /**
   * 日曜日かどうか
   *
   * @param {number} weekCnt 週(日を0とし、月が1……と続き、土の6で終わる数値)
   * @return {boolean} 判定結果
   */
  const isSunday = useCallback((weekCnt: number) => {
    return weekCnt === 0;
  }, []);

  /**
   * 祝日かどうか
   *
   * @param {Syukujits} holiday 祝日
   * @return {boolean} 判定結果
   */
  const isHoliday = useCallback((holiday: Syukujits) => {
    return !!holiday;
  }, []);

  /**
   * 金額が存在する日付けかどうか
   *
   * @param {number[]} amountDayList 金額のリスト
   * @return {boolean} 判定結果
   */
  const isAmountDay = useCallback(
    (amountDayList: number[]) => {
      return !isObjEmpty(amountList) && amountDayList.length != 0;
    },
    [amountList]
  );

  /**
   * 祝日を取得
   *
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @return 祝日
   */
  const getHoliday = useCallback(
    (year: number, month: number, day: number) => {
      if (isObjEmpty(syukujitsuList)) return null;

      return syukujitsuList.find((syukujitsu) => {
        // console.log(
        //   `syukujitsu.dateFormatPattern:${syukujitsu.dateFormat}`
        // );
        const holiday = parseDate(syukujitsu.date, syukujitsu.dateFormat);

        return equalsYearMonthDay(year, month, day, holiday);
      });
    },
    [syukujitsuList, equalsYearMonthDay]
  );

  /**
   * 金額のリストを取得
   *
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @return 金額
   */
  const getAmountDayList = useCallback(
    (year: number, month: number, day: number) => {
      if (isObjEmpty(amountList)) return [];

      return amountList
        .filter((books) => {
          const amountday = parseDate(books.booksDate, books.booksDateFormat);
          return equalsYearMonthDay(year, month, day, amountday);
        })
        .map((books) => books.booksAmmount);
    },
    [amountList, equalsYearMonthDay]
  );

  /**
   * 選択されている家計簿リストを取得
   *
   * @return 選択されている家計簿リストを取得
   */
  const getSelectedamountByDayList = useCallback(() => {
    // console.log(`selectDay:${selectDay}`);
    if (isObjEmpty(amountList)) return [];

    const selectedList = amountList.filter((books) => {
      const amountday = parseDate(books.booksDate, books.booksDateFormat);
      // console.log(`booksDate:${books.booksDate}`);
      // console.log(`amountday:${amountday}`);
      return equalsYearMonthDay(
        selectDay.getFullYear(),
        selectDay.getMonth() + 1,
        selectDay.getDate(),
        amountday
      );
    });
    // console.log(`selectedList:${JSON.stringify(selectedList)}`);

    return selectedList;
  }, [amountList, equalsYearMonthDay]);

  /**
   * カレンダー用の配列作成
   * @param date
   * @returns
   */
  const getCalendarArray = useCallback((date) => {
    const sundays = eachWeekOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    });

    return sundays.map((sunday) =>
      eachDayOfInterval({ start: sunday, end: endOfWeek(sunday) })
    );
  }, []);

  //週の定義
  const weekByCalendar: string[] = ['日', '月', '火', '水', '木', '金', '土'];
  const calendar = useMemo(() => getCalendarArray(date), [date]);
  const dateOfMonth = useMemo(() => getMonth(date), [date]);

  return (
    <>
      <Container>
        <Row>
          <Col sm="12">
            <h1>{`${year}年 ${month}月`}</h1>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Table bordered>
              <thead>
                <tr className="dayOfWeek">
                  {weekByCalendar.map((dayOfWeek, i) => {
                    return (
                      <th key={`dayOfWeek-${i}`} className="text-start">
                        {dayOfWeek}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {calendar.map((weekRow, rowIndex) => (
                  <tr key={rowIndex}>
                    {weekRow.map((weekDate, colIndex) => {
                      const weekDateOfDay = getDay(weekDate);
                      const weekDateOfDate = getDate(weekDate);
                      const weekDateOfMonth = getMonth(weekDate);
                      // console.log(
                      //   `weekDate:${weekDate} month:${getMonth(weekDate)}`
                      // );
                      // console.log(`date:${date} month:${getMonth(date)}`);
                      if (
                        // 前月の日付
                        weekDateOfMonth < dateOfMonth ||
                        // 翌月の日付
                        weekDateOfMonth > dateOfMonth
                      ) {
                        // 1行目で1日まで先月の日付を設定
                        // 最終行で最終日以降、翌月の日付を設定
                        return (
                          <td
                            key={weekDateOfDay}
                            className="text-dark text-start text-opacity-25"
                          >
                            {weekDateOfDate}
                          </td>
                        );
                      } else {
                        // 当月の日付を曜日に照らし合わせて設定
                        const classNames = [];
                        classNames.push('bootstrap-calendar-cell-hover');
                        const holiday = getHoliday(year, month, weekDateOfDate);
                        const amountListByDay = getAmountDayList(
                          year,
                          month,
                          weekDateOfDate
                        );
                        // console.log(`day:${weekDateOfDate}`);
                        // console.log('holiday');
                        // console.log(holiday);
                        // console.log('amountListByDay');
                        // console.log(amountListByDay);
                        if (isSelectday(year, month, weekDateOfDate)) {
                          classNames.push('selected');
                          classNames.push('bg-danger');
                          classNames.push('text-white');
                        } else if (isHoliday(holiday)) {
                          classNames.push('text-success');
                        } else if (isSaturday(colIndex)) {
                          classNames.push('text-primary');
                        } else if (isSunday(colIndex)) {
                          classNames.push('text-danger');
                        }
                        return (
                          <td
                            key={weekDateOfDay}
                            className={cn(classNames)}
                            title={isHoliday(holiday) ? holiday.name : null}
                            data-value={weekDateOfDate}
                            onClick={(event) => {
                              // console.log(`year:${year}`);
                              // console.log(`month:${month}`);
                              // console.log(`day:${weekDateOfDate}`);

                              // イベントハンドラを登録した要素がcurrentTarget
                              // イベントが発生した要素がtarget
                              // 今回は必ずtdタグを取得したいのでcurrentTarget
                              const target = event.currentTarget as HTMLElement;
                              const clickDay = Number(
                                target.getAttribute('data-value')
                              );
                              // console.log(`day:${clickDay}`);
                              startTransition(() => {
                                setSelectDay(createDate(year, month, clickDay));
                              });
                            }}
                          >
                            <div className="text-start">{weekDateOfDate}</div>
                            <div className="text-center">
                              {isAmountDay(amountListByDay) &&
                                `${amountListByDay.length}件`}
                            </div>
                            <div className="text-center">
                              {isAmountDay(amountListByDay) &&
                                amountListByDay.reduce(
                                  (sum, element) => sum + Number(element),
                                  0
                                )}
                            </div>
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <ListTable
              booksList={getSelectedamountByDayList()}
              booksDate={selectDay}
              booksType={booksType}
            />
          </Col>
        </Row>
      </Container>
      {initScript}
    </>
  );
};

export default Calendar;
