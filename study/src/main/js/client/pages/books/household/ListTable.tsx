import { Field, FieldProps, FormikProps } from 'formik';
import React from 'react';
import Container from 'react-bootstrap/Container';

import {
  Books,
  BuildListTableFormObjConfig,
} from '../../../../@types/studyUtilType';
import { classConst } from '../../../../constant/classConstant';
import { fieldConst } from '../../../../constant/fieldConstant';
import { keyJoin, pathJoin } from '../../../../study/util/studyUtil';
import { buildListTableFormObj } from '../../../../study/util/studyYupUtil';
import ImageIcon from '../../../components/ImageIcon';
import SimpleText from '../../../components/SimpleText';
import SortAndFilterFormTable from '../../../components/SortAndFilterFormTable';

type ListTableProps = {
  /** 家計簿データリスト */
  booksList: Books[];
};

const ListTable: React.FC<ListTableProps> = ({ booksList }) => {
  //console.log(JSON.stringify(booksList));
  const toObjConfig: BuildListTableFormObjConfig = {
    className: classConst.BOOKS_DATA_LIST,
    primaryKey: fieldConst.books.BOOKS_ID,
    list: [
      {
        name: fieldConst.books.BOOKS_DATE,
        table: {
          head: '日付',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_DATE];
            return (
              <Field name={name}>
                {({ field }: FieldProps<string>) => {
                  return <SimpleText name={field.name} value={field.value} />;
                }}
              </Field>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.books.BOOKS_PLACE,
        table: {
          head: '名称',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_PLACE];
            // return <SimpleText name={name} value={props.values[name]} />;
            return (
              <Field name={name}>
                {({ field }: FieldProps<string>) => {
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
                  return <SimpleText name={field.name} value={field.value} />;
                }}
              </Field>
            );
          },
          hidden: false,
        },
        addition: null,
      },

      {
        name: keyJoin(fieldConst.books.CAT_CODES, fieldConst.category.CAT_NAME),
        table: {
          head: 'カテゴリー',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name =
              names[
                keyJoin(
                  fieldConst.books.CAT_CODES,
                  fieldConst.category.CAT_NAME
                )
              ];
            return (
              <div>
                <Field name={name}>
                  {({ field, form }: FieldProps<string>) => {
                    return (
                      <div>
                        <SimpleText name={field.name} value={field.value} />
                        <ImageIcon
                          path={pathJoin(
                            form.getFieldProps(
                              names[
                                keyJoin(
                                  fieldConst.books.CAT_CODES,
                                  fieldConst.category.IMG_IDS,
                                  fieldConst.image.IMG_PATH
                                )
                              ]
                            ).value,
                            form.getFieldProps(
                              names[
                                keyJoin(
                                  fieldConst.books.CAT_CODES,
                                  fieldConst.category.IMG_IDS,
                                  fieldConst.image.IMG_NAME
                                )
                              ]
                            ).value
                          )}
                        />
                      </div>
                    );
                  }}
                </Field>
              </div>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.books.BOOKS_METHOD,
        table: {
          head: '決済方法',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_METHOD];
            return (
              <Field name={name}>
                {({ field }: FieldProps<string>) => {
                  return <SimpleText name={field.name} value={field.value} />;
                }}
              </Field>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.books.BOOKS_AMMOUNT,
        table: {
          head: '金額',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.books.BOOKS_AMMOUNT];
            return (
              <Field name={name}>
                {({ field }: FieldProps<string>) => {
                  return <SimpleText name={field.name} value={field.value} />;
                }}
              </Field>
            );
          },
          hidden: false,
        },
        addition: null,
      },
    ],
  };

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
  const listTableFormObj = buildListTableFormObj(booksList, toObjConfig);

  return (
    <Container>
      <SortAndFilterFormTable
        tableFormConfig={listTableFormObj}
        handleFormSubmit={() => null}
        hiddenSubmitButton
      />
    </Container>
  );
};

export default ListTable;
