import { FastField, Field, FieldProps, FormikProps } from 'formik';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';

import {
  Books,
  BuildListTableFormObjConfig,
  ErrorResults,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import {
  fetchPost,
  keyJoin,
  pathJoin,
} from '../../../../../study/util/studyUtil';
import {
  buildListTableFormObj,
  objArrayToObj,
} from '../../../../../study/util/studyYupUtil';
import ImageIcon from '../../../../components/elements/icon/ImageIcon';
import CheckBox from '../../../../components/form/CheckBox';
import SelectBox from '../../../../components/form/SelectBox';
import SortAndFilterFormTable from '../../../../components/form/SortAndFilterFormTable';
import TextBox from '../../../../components/form/TextBox';
import {
  useHouseholdInfoSWR,
  useHouseholdDataSWR,
} from '../../../../hooks/useBooks';
import { useCommonInfoSWR } from '../../../../hooks/useCommon';
import yup from '../../../../yup/yup.custom';
import { buildDataParam, buildInfoParam } from '../functions/param';
import { useDateParam } from '../hooks/useParam';

type ListTableProps = {
  /** 家計簿データ */
  booksList?: Books[];
  /** 家計簿タイプ */
  booksType: string;
};

const ListTable: React.FC<ListTableProps> = ({
  booksList: pbooksList,
  booksType,
}) => {
  const { data: commonInfo } = useCommonInfoSWR();
  const paramDate = useDateParam();
  const { data: info } = useHouseholdInfoSWR(
    buildInfoParam(paramDate, commonInfo.dateFormat)
  );
  const { data: booksFormList, mutate: setList } = useHouseholdDataSWR(
    buildDataParam(paramDate, commonInfo.dateFormat, booksType)
  );
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];
  const booksList = pbooksList ? pbooksList : booksFormList.booksDataList;

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: unknown) => {
    const res = await fetchUpdListData(
      objArrayToObj(
        form[classConst.BOOKS_DATA_LIST],
        classConst.BOOKS_DATA_LIST
      )
    );
    const json = await res.json();
    console.log('soushinkekka');
    console.log(json);
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
      ...buildDataParam(paramDate, commonInfo.dateFormat, booksType),
    };
    return await fetchPost(urlConst.books.LISTDATAUPDATE, param);
  };

  //console.log(JSON.stringify(booksList));
  const toObjConfig: BuildListTableFormObjConfig = {
    className: classConst.BOOKS_DATA_LIST,
    primaryKey: fieldConst.books.BOOKS_ID,
    list: [
      {
        name: fieldConst.books.DELETE,
        table: {
          head: '削除',
          getCell: (_: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.DELETE];
            return (
              <FastField name={name}>
                {({ field }: FieldProps<string>) => {
                  return (
                    <CheckBox
                      name={field.name}
                      value={field.value}
                      flag={info.delete}
                      onChange={field.onChange}
                    />
                  );
                }}
              </FastField>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.books.BOOKS_DATE,
        table: {
          head: '日付',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_DATE];
            return (
              <FastField name={name}>
                {({ field, meta }: FieldProps<string>) => {
                  return (
                    <TextBox
                      name={field.name}
                      value={field.value}
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
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.books.BOOKS_PLACE,
        table: {
          head: '名称',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_PLACE];
            return (
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
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: keyJoin(fieldConst.books.CAT_CODES, fieldConst.category.CAT_CODE),
        table: {
          head: 'カテゴリー',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name =
              names[
                keyJoin(
                  fieldConst.books.CAT_CODES,
                  fieldConst.category.CAT_CODE
                )
              ];
            return (
              <div>
                <Field name={name}>
                  {() => {
                    return (
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
                            const image = info.imageList.find(
                              (image) => image.imgId === cat.imgIds.imgId
                            );
                            return (
                              <>
                                <SelectBox
                                  name={field.name}
                                  value={field.value}
                                  validate
                                  touched={meta.touched}
                                  error={meta.error}
                                  typeList={info.categoryTypes}
                                  dirty={props.dirty}
                                  onBlur={(e) => {
                                    // どちらを更新したか紛らわしいので、両方更新
                                    props.setFieldValue(
                                      names[fieldConst.books.CAT_CODE],
                                      e.target.value
                                    );
                                    field.onChange(e);
                                  }}
                                  isOnClickEditable
                                />
                                <ImageIcon
                                  path={pathJoin(image.imgPath, image.imgName)}
                                />
                              </>
                            );
                          }}
                        </FastField>
                      </div>
                    );
                  }}
                </Field>
              </div>
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.string().nullable().server(errData),
        },
      },
      {
        name: fieldConst.books.BOOKS_METHOD,
        table: {
          head: '決済方法',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_METHOD];
            return (
              <FastField name={name}>
                {({ field, meta }: FieldProps<string>) => {
                  return (
                    <TextBox
                      name={field.name}
                      value={field.value}
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
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.books.BOOKS_AMMOUNT,
        table: {
          head: '金額',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_AMMOUNT];
            return (
              <FastField name={name}>
                {({ field, meta }: FieldProps<string>) => {
                  return (
                    <TextBox
                      name={field.name}
                      value={field.value}
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
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
    ],
  };

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
  const listTableFormObj = buildListTableFormObj(booksList, toObjConfig);

  return (
    <Container>
      <SortAndFilterFormTable
        tableFormConfig={listTableFormObj}
        handleFormSubmit={handleSubmit}
        errData={errData}
      />
    </Container>
  );
};

export default ListTable;
