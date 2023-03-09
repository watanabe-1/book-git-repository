import { FormikHelpers } from 'formik/dist/types';
import React from 'react';
import Form from 'react-bootstrap/Form';
import { getInputFile } from '../../study/util/studyUtil';
import FileBoxOnValidate from './FileBoxOnValidate';

/**
 *
 * @returns form内のファイル用インプットボックス
 */
const FileBoxOnValidateAndImg = (props: {
  title: string;
  name: string;
  value: any;
  error: any;
  accept: string;
  src: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}) => {
  return (
    <>
      <img
        src={props.src}
        className="mh-100 mw-100"
        width="50"
        height="30"
      ></img>
      <FileBoxOnValidate
        title={props.title}
        name={props.name}
        value={props.value}
        error={props.error}
        accept="image/*"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          props.setFieldValue(props.name, getInputFile(event));
        }}
      />
    </>
  );
};

export default FileBoxOnValidateAndImg;
