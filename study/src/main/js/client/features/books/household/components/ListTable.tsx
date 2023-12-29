import { FastField, FieldProps } from 'formik';
import React, { useCallback, useMemo } from 'react';
import Container from 'react-bootstrap/Container';

import {
  Books,
  BuildListTableFormObjConfig,
  NestedObject,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { keyJoin } from '../../../../../study/util/studyStringUtil';
import { pathJoin } from '../../../../../study/util/studyStringUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import { objArrayToObj } from '../../../../../study/util/studyYupUtil';
import ImageIcon from '../../../../components/elements/icon/ImageIcon';
import CheckBox, {
  getCheckBoxDetails,
  modifierCheckBox,
} from '../../../../components/form/CheckBox';
import DayPickrBox from '../../../../components/form/DayPickrBox';
import FormTable from '../../../../components/form/formTable/FormTable';
import SelectBox, {
  getSelectBoxDetails,
} from '../../../../components/form/SelectBox';
import TextBox, {
  getTextBoxTextValue,
  modifierTextBox,
} from '../../../../components/form/TextBox';
import {
  useHouseholdInfoSWR,
  useHouseholdDataSWR,
  useHouseholdChartInfoStaticKeySWR,
} from '../../../../hooks/useBooks';
import { useCommonInfoSWR, useErrData } from '../../../../hooks/useCommon';
import yup from '../../../../locale/yup.locale';
import { buildDataParam, buildInfoParam } from '../functions/param';
import { useDateParam } from '../hooks/useParam';

type ListTableProps = {
  /** 家計簿データ */
  booksList?: Books[];
  /** 新規データ作成時用基準の日付 */
  booksDate?: Date;
  /** 家計簿タイプ */
  booksType: string;
};

const ListTable: React.FC<ListTableProps> = ({
  booksList: pbooksList,
  booksDate,
  booksType,
}) => {
  const { data: commonInfo } = useCommonInfoSWR();
  const paramDate = useDateParam();

  const infoParam = useMemo(
    () => buildInfoParam(paramDate, commonInfo.dateFormat),
    [paramDate, commonInfo.dateFormat]
  );
  const { data: info } = useHouseholdInfoSWR(infoParam);

  const dataParam = useMemo(
    () => buildDataParam(paramDate, commonInfo.dateFormat, booksType),
    [paramDate, commonInfo.dateFormat, booksType]
  );
  const { data: booksFormList, mutate: setList } =
    useHouseholdDataSWR(dataParam);

  const { mutate: setChartInfoStaticKey } = useHouseholdChartInfoStaticKeySWR();

  const [errData, setErrData] = useErrData();

  const booksList = pbooksList ? pbooksList : booksFormList.booksDataList;

  /**
   * リストデータ更新
   */
  const fetchUpdListData = useCallback(
    async (form: NestedObject) => {
      const param = {
        ...form,
        ...buildDataParam(paramDate, commonInfo.dateFormat, booksType),
      };

      return await fetchPost(urlConst.books.LIST_DATA_UPDATE, param);
    },
    [paramDate, commonInfo.dateFormat, booksType]
  );

  /**
   * 新規リストデータ追加
   */
  const fetchPushData = useCallback(
    async (form: NestedObject) => {
      const param = {
        ...form,
        ...buildDataParam(
          booksDate ? booksDate : paramDate,
          commonInfo.dateFormat,
          booksType
        ),
      };

      return await fetchPost(urlConst.books.LIST_DATA_PUSH, param);
    },
    [booksDate, paramDate, commonInfo.dateFormat, booksType]
  );

  /**
   * 送信実行
   *
   * @param fetch 送信関数
   * @param form 送信データ
   * @param listname 送信対象リスト名
   */
  const executeSubmit = useCallback(
    async (
      fetch: (form: NestedObject) => Promise<Response>,
      form: NestedObject,
      listname: string
    ) => {
      const res = await fetch(
        objArrayToObj(form[listname] as NestedObject[], listname)
      );
      const json = await res.json();
      // console.log('soushinkekka');
      // console.log(json);
      if (res.ok) {
        setList(json);
        setChartInfoStaticKey((chartInfoStaticKey) => chartInfoStaticKey + 1);
      } else {
        setErrData(json);
      }

      return res;
    },
    [setList, setChartInfoStaticKey, setErrData]
  );

  /**
   * 送信ボタン(更新)
   * @param form 送信パラメータ
   */
  const handleSubmit = useCallback(
    async (form: NestedObject) => {
      return await executeSubmit(
        fetchUpdListData,
        form,
        classConst.BOOKS_DATA_LIST
      );
    },
    [executeSubmit, fetchUpdListData]
  );

  /**
   * 送信ボタン(新規)
   * @param form 送信パラメータ
   */
  const handlePushData = useCallback(
    async (form: NestedObject) => {
      return await executeSubmit(
        fetchPushData,
        form,
        classConst.BOOKS_DATA_LIST
      );
    },
    [executeSubmit, fetchPushData]
  );

  // console.log(JSON.stringify(booksList));
  const tableFormConfig: BuildListTableFormObjConfig = {
    className: classConst.BOOKS_DATA_LIST,
    primaryKey: fieldConst.books.BOOKS_ID,
    list: [
      {
        name: fieldConst.books.DELETE,
        modifier: modifierCheckBox,
        table: {
          head: '削除',
          getCell: ({ value, initialValue, name }) => {
            const flag = info.delete;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    // console.log(
                    //   `name:${name} value:${JSON.stringify(
                    //     field.value
                    //   )} type:${typeof field.value}`
                    // );
                    return (
                      <CheckBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        flag={flag}
                        onChange={field.onChange}
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getCheckBoxDetails(flag, value).textValue,
            };
          },
        },
      },
      {
        name: fieldConst.books.BOOKS_DATE,
        table: {
          head: '日付',
          getCell: ({ value, initialValue, name }, { props, getName }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    const dateFormat = props.getFieldProps(
                      getName(fieldConst.books.BOOKS_DATE_FORMAT)
                    ).value;
                    return (
                      <DayPickrBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        dateFormat={dateFormat}
                        onlyValueMonth
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: value,
            };
          },
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.books.BOOKS_PLACE,
        table: {
          head: '名称',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      // console.log('Field');
                      // console.log(field);
                      // console.log('form');
                      // console.log(form);
                      // console.log('meta');
                      // console.log(meta);
                      // console.log('values');
                      // console.log(props.values);
                      // getFieldPropsで取得できる値はFieldタグのfieldと同じ(内部的に同じ関数が呼ばれている)
                      // console.log('props.getFieldProps');
                      // console.log(props.getFieldProps(name));
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: keyJoin(fieldConst.books.CAT_CODES, fieldConst.category.CAT_CODE),
        table: {
          head: 'カテゴリー',
          getCell: ({ value, initialValue, name }, { props, getName }) => {
            const typeList = info.categoryTypes;

            return {
              element: (
                <div>
                  <FastField name={name}>
                    {({ field, meta }: FieldProps<string>) => {
                      // console.log('categories');
                      // console.log(info.categories);
                      // console.log(`field.name:${field.name}`);
                      // console.log(`field.value:${field.value}`);
                      const cat = info.categoryList.find(
                        (cat) => cat.catCode === field.value
                      );

                      return (
                        <>
                          <SelectBox
                            name={field.name}
                            value={field.value}
                            initialValue={initialValue}
                            validate
                            touched={meta.touched}
                            error={meta.error}
                            typeList={typeList}
                            dirty={props.dirty}
                            onBlur={(e) => {
                              // どちらを更新したか紛らわしいので、両方更新
                              props.setFieldValue(
                                getName(fieldConst.books.CAT_CODE),
                                e.target.value
                              );
                              field.onChange(e);
                            }}
                            isOnClickEditable
                          />
                          <ImageIcon
                            path={pathJoin(
                              cat.imgIds.imgPath,
                              cat.imgIds.imgName
                            )}
                          />
                        </>
                      );
                    }}
                  </FastField>
                </div>
              ),
              value: value,
              textValue: getSelectBoxDetails(typeList, value).textValue,
            };
          },
        },
        addition: {
          yup: yup.string().nullable().server(errData),
        },
      },
      {
        name: fieldConst.books.BOOKS_METHOD,
        table: {
          head: '決済方法',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.books.BOOKS_AMMOUNT,
        modifier: modifierTextBox,
        table: {
          head: '金額',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.number().required().server(errData),
        },
      },
    ],
  };

  return (
    <Container>
      <FormTable
        objArray={booksList}
        tableFormConfig={tableFormConfig}
        handlePushSubmit={handlePushData}
        handleFormSubmit={handleSubmit}
        errData={errData}
      />
    </Container>
  );
};

export default ListTable;
