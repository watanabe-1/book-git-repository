import React from 'react';
import {
  Books,
  BuildListTableFormObjConfig,
} from '../../../../@types/studyUtilType';
import { Container } from 'react-bootstrap';
import SimpleText from '../../../components/SimpleText';
import { FieldConst } from '../../../../constant/fieldConstant';
import { ClassConst } from '../../../../constant/classConstant';
import { Field, FormikProps } from 'formik';
import ImageIcon from '../../../components/ImageIcon';
import { keyJoin, pathJoin } from '../../../../study/util/studyUtil';
import { buildListTableFormObj } from '../../../../study/util/studyYupUtil';
import SortAndFilterFormTable from '../../../components/SortAndFilterFormTable';
import TextBoxOnValidate from '../../../components/TextBoxOnValidate';

const ListTable = ({ booksList }: { booksList: Books[] }) => {
  //console.log(JSON.stringify(booksList));
  const toObjConfig: BuildListTableFormObjConfig = {
    className: ClassConst.BOOKS_DATA_LIST,
    list: [
      {
        name: FieldConst.Books.BOOKS_DATE,
        table: {
          head: '日付',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Books.BOOKS_DATE];
            return (
              <Field name={name}>
                {({ field }) => {
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
        name: FieldConst.Books.BOOKS_PLACE,
        table: {
          head: '名称',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Books.BOOKS_PLACE];
            // return <SimpleText name={name} value={props.values[name]} />;
            return (
              <Field name={name}>
                {({ field, form, meta }) => {
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
        name: keyJoin(FieldConst.Books.CAT_CODES, FieldConst.Category.CAT_NAME),
        table: {
          head: 'カテゴリー',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name =
              names[
                keyJoin(
                  FieldConst.Books.CAT_CODES,
                  FieldConst.Category.CAT_NAME
                )
              ];
            return (
              <div>
                <Field name={name}>
                  {({ field, form }) => {
                    return (
                      <div>
                        <SimpleText name={field.name} value={field.value} />
                        <ImageIcon
                          path={pathJoin(
                            form.getFieldProps(
                              names[
                                keyJoin(
                                  FieldConst.Books.CAT_CODES,
                                  FieldConst.Category.IMG_IDS,
                                  FieldConst.Image.IMG_PATH
                                )
                              ]
                            ).value,
                            form.getFieldProps(
                              names[
                                keyJoin(
                                  FieldConst.Books.CAT_CODES,
                                  FieldConst.Category.IMG_IDS,
                                  FieldConst.Image.IMG_NAME
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
        name: FieldConst.Books.BOOKS_METHOD,
        table: {
          head: '決済方法',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Books.BOOKS_METHOD];
            return (
              <Field name={name}>
                {({ field }) => {
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
        name: FieldConst.Books.BOOKS_AMMOUNT,
        table: {
          head: '金額',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Books.BOOKS_AMMOUNT];
            return (
              <Field name={name}>
                {({ field }) => {
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
        handleFormSubmit={() => {}}
        hiddenSubmitButton
      />
    </Container>
  );
};

export default ListTable;
