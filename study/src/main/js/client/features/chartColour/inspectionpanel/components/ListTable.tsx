import { FastField, FieldProps, FormikProps } from 'formik';
import React, { useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';

import {
  BuildListTableFormObjConfig,
  ErrorResults,
  ChartColour,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { getValueObj } from '../../../../../study/util/studyFormUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import {
  buildListTableFormObj,
  objArrayToObj,
} from '../../../../../study/util/studyYupUtil';
import CheckBox, {
  getCheckBoxLabelValue,
  getCheckBoxTextValue,
  modifierCheckBox,
} from '../../../../components/form/CheckBox';
import SortAndFilterFormTable from '../../../../components/form/SortAndFilterFormTable';
import TextBox, {
  getTextBoxTextValue,
} from '../../../../components/form/TextBox';
import {
  useChartColourListSWR,
  useInspectionPanelInfoSWR,
} from '../../../../hooks/useChartColour';
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

  let chartColourList = pchartColourList
    ? pchartColourList
    : chartColourFormList.chartColourDataList;

  if (onlyActive) {
    chartColourList = chartColourList.filter(
      (chartColour) => chartColour.active == info.active.value
    );
  }

  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];

  /**
   * 送信ボタン(更新)
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: unknown) => {
    const res = await fetchUpdListData(
      objArrayToObj(
        form[classConst.CHART_COLOUR_DATA_LIST],
        classConst.CHART_COLOUR_DATA_LIST
      )
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
  };

  /**
   * 送信ボタン(新規)
   * @param form 送信パラメータ
   */
  const handlePushData = async (form: unknown) => {
    const res = await fetchPushData(
      objArrayToObj(
        form[classConst.CHART_COLOUR_DATA_LIST],
        classConst.CHART_COLOUR_DATA_LIST
      )
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
  };

  /**
   * リストデータ更新
   */
  const fetchUpdListData = async (form: object) => {
    const param = {
      ...form,
    };
    return await fetchPost(urlConst.chartColour.LIST_DATA_UPDATE, param);
  };

  /**
   * 新規リストデータ追加
   */
  const fetchPushData = async (form: object) => {
    const param = {
      ...form,
    };
    return await fetchPost(urlConst.chartColour.LIST_DATA_PUSH, param);
  };

  // console.log(JSON.stringify(chartColourList));
  const toObjConfig: BuildListTableFormObjConfig = {
    className: classConst.CHART_COLOUR_DATA_LIST,
    primaryKey: fieldConst.chartColour.TEMPLATE_ID,
    list: [
      {
        name: fieldConst.chartColour.DELETE,
        modifier: modifierCheckBox,
        table: {
          head: '削除',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.chartColour.DELETE];
            const { value, initialValue } = getValueObj(props, name);
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
              textValue: getCheckBoxLabelValue(
                flag,
                getCheckBoxTextValue(flag, value)
              ),
            };
          },
          hidden: readonly,
        },
      },
      {
        name: fieldConst.chartColour.TEMPLATE_NAME,
        table: {
          head: '名称',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.chartColour.TEMPLATE_NAME];
            const { value, initialValue } = getValueObj(props, name);
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.chartColour.ACTIVE];
            const { value, initialValue } = getValueObj(props, name);
            const flag = info.active;
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
                        noLabel
                        isReadonly={readonly}
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getCheckBoxTextValue(flag, value),
            };
          },
        },
      },
      {
        name: fieldConst.chartColour.SEED_COEFF_R,
        table: {
          head: 'シード値係数(R)',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.chartColour.SEED_COEFF_R];
            const { value, initialValue } = getValueObj(props, name);
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.chartColour.SEED_COEFF_G];
            const { value, initialValue } = getValueObj(props, name);
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.chartColour.SEED_COEFF_B];
            const { value, initialValue } = getValueObj(props, name);
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.chartColour.USER_ID];
            const { value, initialValue } = getValueObj(props, name);
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

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
  const listTableFormObj = useMemo(
    () => buildListTableFormObj(chartColourList, toObjConfig),
    [chartColourList, toObjConfig]
  );
  const hiddenButton = readonly;

  return (
    <Container>
      <SortAndFilterFormTable
        tableFormConfig={listTableFormObj}
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
