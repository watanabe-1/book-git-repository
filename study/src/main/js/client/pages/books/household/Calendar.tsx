import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/table';

import ListTable from './ListTable';
import { Books, Syukujits } from '../../../../@types/studyUtilType';
import { onServerConst } from '../../../../constant/on-serverConstant';
import { urlConst } from '../../../../constant/urlConstant';
import { isInvalidDate } from '../../../../study/util/studyDateUtil';
import { fetchGet, isObjEmpty } from '../../../../study/util/studyUtil';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import { executeFuncIfNeeded, onServer } from '../../../on-server';
import '../../../../../css/view/calendar/calendar.css';

/**
 * 家計簿カレンダー用データ
 */
export type HouseholdCalendarData = {
  syukujitsuList: Syukujits[];
  amountList: Books[];
};

const Calendar = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}) => {
  const date = new Date(year, month - 1, day);
  // 日付けが正しく設定されるまで
  if (isInvalidDate(date)) return <BodysLodingSpinner />;

  const [initiaCalendarData, initScript] = onServer(
    (api, param) => api.getHouseholdCalendarInfo(param),
    [],
    onServerConst.books.HOUSEHOLD_CALENDAR_INFO
  ) as [HouseholdCalendarData, JSX.Element];
  const [calendarData, setCalendarData] = useState(initiaCalendarData);
  const { syukujitsuList, amountList } = calendarData;
  const [selectDay, setSelectDay] = useState(date);

  console.log('calendardata');
  console.log(calendarData);

  /**
   * カレンダー用データ取得
   */
  const fetchInfo = async () => {
    const params = {};
    if (date) params['date'] = date;
    const response = await fetchGet(
      urlConst.books.HOUSEHOLD_CALENDAR_INFO,
      params
    );
    const data = (await response.json()) as HouseholdCalendarData;
    setCalendarData(data);
  };

  // 親がサーバーから受け取るmonthの値に変化がある(値に変化がるというよりは参照先に変更があった場合)再レンダリングする
  // Dateを直接親から受け取らないようにしているのは親ファイル内でDateはレンダリング時に毎回「new」で作り直しているため、値が同じ(同じ日時)のデータの場合でも参照先が毎回変わってしまい、そのたびにuseEffectが動いてしまうため
  // 例 : タブを切り替えるたびに親の再レンダリングが動くが、その時は日付けは変わっていない しかし親から渡された日付けをそのままuseEffectの条件(第二引数)にした場合、親側ではレンダリングのたびに「new」で作り直しているため参照先が変わり毎回useEffectが実行される
  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(onServerConst.books.HOUSEHOLD_CALENDAR_INFO, fetchInfo);
  }, [month]);

  /**
   * 年月日が同じかどうか比較
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @param {Date} date 日付け 比較対象
   * @return {boolean} 判定結果
   */
  const equalsYearMonthDay = (
    year: number,
    month: number,
    day: number,
    date: Date
  ) => {
    // console.log(`year:${year}`);
    // console.log(`month:${month}`);
    // console.log(`day:${day}`);
    // console.log(`date:${date}`);

    return (
      year === date.getFullYear() &&
      month === date.getMonth() + 1 &&
      day === date.getDate()
    );
  };

  /**
   * 選択された日付けかどうか
   *
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @return {boolean} 判定結果
   */
  const isSelectday = (year: number, month: number, day: number): boolean => {
    // console.log(`year:${year}`);
    // console.log(`month:${month}`);
    // console.log(`day:${day}`);
    // console.log(`date:${date}`);
    return equalsYearMonthDay(year, month, day, selectDay);
  };

  /**
   * 土曜日かどうか
   *
   * @param {number} weekCnt 週(日を0とし、月が1……と続き、土の6で終わる数値)
   * @return {boolean} 判定結果
   */
  const isSaturday = (weekCnt: number) => {
    return weekCnt === 6;
  };

  /**
   * 日曜日かどうか
   *
   * @param {number} weekCnt 週(日を0とし、月が1……と続き、土の6で終わる数値)
   * @return {boolean} 判定結果
   */
  const isSunday = (weekCnt: number) => {
    return weekCnt === 0;
  };

  /**
   * 祝日かどうか
   *
   * @param {Syukujits} holiday 祝日
   * @return {boolean} 判定結果
   */
  const isHoliday = (holiday: Syukujits) => {
    return holiday ? true : false;
  };

  /**
   * 金額が存在する日付けかどうか
   *
   * @param {number[]} amountDayList 金額のリスト
   * @return {boolean} 判定結果
   */
  const isAmountDay = (amountDayList: number[]) => {
    return !isObjEmpty(amountList) && amountDayList.length != 0;
  };

  /**
   * 祝日を取得
   *
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @return 祝日
   */
  const getHoliday = (year: number, month: number, day: number) => {
    if (isObjEmpty(syukujitsuList)) return null;
    return syukujitsuList.find((syukujitsu) => {
      const holiday = new Date(syukujitsu.date);
      return equalsYearMonthDay(year, month, day, holiday);
    });
  };

  /**
   * 金額のリストを取得
   *
   * @param {number} year 年
   * @param {number} month 月
   * @param {number} day 日
   * @return 金額
   */
  const getAmountDayList = (year: number, month: number, day: number) => {
    if (isObjEmpty(amountList)) return [];
    return amountList
      .filter((books) => {
        const amountday = new Date(books.booksDate);
        return equalsYearMonthDay(year, month, day, amountday);
      })
      .map((books) => books.booksAmmount);
  };

  /**
   * 選択されている家計簿リストを取得
   *
   * @return 選択されている家計簿リストを取得
   */
  const getSelectedamountByDayList = () => {
    // console.log(`selectDay:${selectDay}`);
    if (isObjEmpty(amountList)) return [];
    return amountList.filter((books) => {
      const amountday = new Date(books.booksDate);
      // console.log(`booksDate:${books.booksDate}`);
      // console.log(`amountday:${amountday}`);
      return equalsYearMonthDay(
        selectDay.getFullYear(),
        selectDay.getMonth() + 1,
        selectDay.getDate(),
        amountday
      );
    });
  };

  //週の定義
  const weekByCalendar: string[] = ['日', '月', '火', '水', '木', '金', '土'];
  let dayCount = 0;
  const startDayOfWeek: number = new Date(year, month - 1, 1).getDay();
  const endDate: number = new Date(year, month, 0).getDate();
  const lastMonthEndDate: number = new Date(year, month - 1, 0).getDate();
  const row: number = Math.ceil(
    (startDayOfWeek + endDate) / weekByCalendar.length
  );
  let cellCount = 0;

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
              <tbody>
                <tr className="dayOfWeek">
                  {weekByCalendar.map((dayOfWeek, i) => {
                    return (
                      <th key={`dayOfWeek-${i}`} className="text-start">
                        {dayOfWeek}
                      </th>
                    );
                  })}
                </tr>
                {Array.from({ length: row }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: weekByCalendar.length }).map(
                      (_, colIndex) => {
                        if (rowIndex === 0 && colIndex < startDayOfWeek) {
                          // 1行目で1日まで先月の日付を設定
                          return (
                            <td
                              key={cellCount++}
                              className="text-dark text-start text-opacity-25"
                            >
                              {lastMonthEndDate - startDayOfWeek + colIndex + 1}
                            </td>
                          );
                        } else if (dayCount >= endDate) {
                          // 最終行で最終日以降、翌月の日付を設定
                          dayCount++;
                          return (
                            <td
                              key={cellCount++}
                              className="text-dark text-start text-opacity-25"
                            >
                              {dayCount - endDate}
                            </td>
                          );
                        } else {
                          // 当月の日付を曜日に照らし合わせて設定
                          dayCount++;
                          const classNames = [];
                          classNames.push('bootstrap-calendar-cell-hover');
                          const holiday = getHoliday(year, month, dayCount);
                          const amountListByDay = getAmountDayList(
                            year,
                            month,
                            dayCount
                          );
                          // console.log(`day:${dayCount}`);
                          // console.log('holiday');
                          // console.log(holiday);
                          // console.log('amountListByDay');
                          // console.log(amountListByDay);
                          if (isSelectday(year, month, dayCount)) {
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
                              key={cellCount++}
                              className={classNames.join(' ')}
                              title={isHoliday(holiday) ? holiday.name : null}
                              data-value={dayCount}
                              onClick={(event) => {
                                // console.log(`year:${year}`);
                                // console.log(`month:${month}`);
                                // console.log(`day:${dayCount}`);

                                // イベントハンドラを登録した要素がcurrentTarget
                                // イベントが発生した要素がtarget
                                // 今回は必ずtdタグを取得したいのでcurrentTarget
                                const target =
                                  event.currentTarget as HTMLElement;
                                const clickDay = Number(
                                  target.getAttribute('data-value')
                                );
                                // console.log(`day:${clickDay}`);
                                setSelectDay(
                                  new Date(year, month - 1, clickDay)
                                );
                              }}
                            >
                              <div className="text-start">{dayCount}</div>
                              <div className="text-center">
                                {isAmountDay(amountListByDay) &&
                                  `${amountListByDay.length}件`}
                              </div>
                              <div className="text-center">
                                {isAmountDay(amountListByDay) &&
                                  amountListByDay.reduce(
                                    (sum, element) => sum + element,
                                    0
                                  )}
                              </div>
                            </td>
                          );
                        }
                      }
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <ListTable booksList={getSelectedamountByDayList()} />
          </Col>
        </Row>
      </Container>
      {initScript}
    </>
  );
};

export default Calendar;
