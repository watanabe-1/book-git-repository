import { FastField, FieldProps } from 'formik';
import React, { useCallback, useMemo } from 'react';
import Container from 'react-bootstrap/Container';

import {
  BuildListTableFormObjConfig,
  ChartColour,
  NestedObject,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { objArrayToObj } from '../../../../../study/util/studyYupUtil';
import CheckBox, {
  getCheckBoxDetails,
  modifierCheckBox,
} from '../../../../components/form/CheckBox';
import FormTable from '../../../../components/form/formTable/FormTable';
import TextBox, {
  getTextBoxTextValue,
} from '../../../../components/form/TextBox';
import {
  useChartColourListSWR,
  useInspectionPanelInfoSWR,
} from '../../../../hooks/useChartColour';
import { useErrData, useFetch } from '../../../../hooks/useCommon';
import yup from '../../../../locale/yup.locale';

type ListTableProps = {
  /** 色確認データ */
  chartColourList?: ChartColour[];
  /** activeに絞る */
  onlyActive?: boolean;
  /** 読み取り専用 */
  readonly?: boolean;
  /** ヘッダーをクリックしたときにソートを行うか */
  isSort?: boolean;
  /** ヘッダーにフィルター用検索ボックスを設置するか */
  isFilter?: boolean;
};

const ListTable: React.FC<ListTableProps> = ({
  chartColourList: pchartColourList,
  onlyActive = false,
  readonly = false,
  isSort = true,
  isFilter = true,
}) => {
  const { data: info } = useInspectionPanelInfoSWR();

  const { data: chartColourFormList, mutate: setList } =
    useChartColourListSWR();

  const chartColourListBase =
    pchartColourList || chartColourFormList.chartColourDataList;

  const chartColourList = useMemo(
    () =>
      onlyActive
        ? chartColourListBase.filter(
            (chartColour) => chartColour.active == info.active.value
          )
        : chartColourListBase,
    [onlyActive, chartColourListBase, info.active.value]
  );

  const [errData, setErrData] = useErrData();
  const { secureFetchPost } = useFetch();

  /**
   * リストデータ更新
   */
  const fetchUpdListData = useCallback(async (form: NestedObject) => {
    const param = {
      ...form,
    };

    return await secureFetchPost(urlConst.chartColour.LIST_DATA_UPDATE, param);
  }, []);

  /**
   * 新規リストデータ追加
   */
  const fetchPushData = useCallback(async (form: object) => {
    const param = {
      ...form,
    };

    return await secureFetchPost(urlConst.chartColour.LIST_DATA_PUSH, param);
  }, []);

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
      } else {
        setErrData(json);
      }

      return res;
    },
    [setList, setErrData]
  );

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = useCallback(
    async (form: NestedObject) => {
      return await executeSubmit(
        fetchUpdListData,
        form,
        classConst.CHART_COLOUR_DATA_LIST
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
        classConst.CHART_COLOUR_DATA_LIST
      );
    },
    [executeSubmit, fetchUpdListData]
  );

  // console.log(JSON.stringify(chartColourList));
  const tableFormConfig: BuildListTableFormObjConfig = {
    className: classConst.CHART_COLOUR_DATA_LIST,
    primaryKey: fieldConst.chartColour.TEMPLATE_ID,
    list: [
      {
        name: fieldConst.chartColour.DELETE,
        modifier: modifierCheckBox,
        table: {
          head: '削除',
          getCell: ({ value, initialValue, name }) => {
            const flag = info.delete;

            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <CheckBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        flag={flag}
                        onChange={field.onChange}
                        isReadonly={readonly}
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getCheckBoxDetails(flag, value).textValue,
            };
          },
          hidden: readonly,
        },
      },
      {
        name: fieldConst.chartColour.TEMPLATE_NAME,
        table: {
          head: '名称',
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
                        isReadonly={readonly}
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
        name: fieldConst.chartColour.ACTIVE,
        modifier: modifierCheckBox,
        table: {
          head: '設定',
          getCell: ({ value, initialValue, name }, { props }) => {
            const flag = info.active;
            const noLabel = true;

            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <CheckBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        flag={flag}
                        dirty={props.dirty}
                        onChange={field.onChange}
                        isOnClickEditable
                        noLabel={noLabel}
                        isReadonly={readonly}
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getCheckBoxDetails(flag, value, noLabel).textValue,
            };
          },
        },
      },
      {
        name: fieldConst.chartColour.SEED_COEFF_R,
        table: {
          head: 'シード値係数(R)',
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
                        isReadonly={readonly}
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
      {
        name: fieldConst.chartColour.SEED_COEFF_G,
        table: {
          head: 'シード値係数(G)',
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
                        isReadonly={readonly}
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
      {
        name: fieldConst.chartColour.SEED_COEFF_B,
        table: {
          head: 'シード値係数(B)',
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
                        isReadonly={readonly}
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
      {
        name: fieldConst.chartColour.USER_ID,
        table: {
          head: 'ユーザー',
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
                        isReadonly={readonly}
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
    ],
  };

  const hiddenButton = readonly;

  return (
    <Container>
      <FormTable
        objArray={chartColourList}
        tableFormConfig={tableFormConfig}
        handlePushSubmit={handlePushData}
        handleFormSubmit={handleSubmit}
        errData={errData}
        hiddenSubmitButton={hiddenButton}
        hiddenPushButton={hiddenButton}
        isSort={isSort}
        isFilter={isFilter}
      />
    </Container>
  );
};

export default ListTable;
