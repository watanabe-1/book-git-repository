/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/react';
import { Formik, FormikProps } from 'formik';
import React from 'react';

import {
  getInitialValue,
  getInputFile,
  getValueObj,
} from '../../../../main/js/study/util/studyFormUtil';

describe('getInputFile function', () => {
  it('should retrieve the file from the input change event', () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const { getByTestId } = render(
      <input type="file" data-testid="file-input" />
    );
    const input = getByTestId('file-input');

    // Simulate the input change event
    fireEvent.change(input, { target: { files: [file] } });

    const retrievedFile = getInputFile({
      currentTarget: input,
    } as React.ChangeEvent<HTMLInputElement>);
    expect(retrievedFile).toEqual(file);
  });

  it('should return null if no file is selected', () => {
    const { getByTestId } = render(
      <input type="file" data-testid="file-input" />
    );
    const input = getByTestId('file-input');

    // Create an empty FileList object
    const emptyFileList = {
      length: 0,
      item: () => null,
    };

    // Simulate the input change event with no file
    fireEvent.change(input, { target: { files: emptyFileList } });

    const retrievedFile = getInputFile({
      currentTarget: input,
    } as React.ChangeEvent<HTMLInputElement>);

    expect(retrievedFile).toBeNull();
  });
});

describe('getInitialValue function', () => {
  const initialValues = {
    name: 'John Doe',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'Anytown',
    },
  };

  it('should return the correct initial value for a given key', () => {
    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(props: FormikProps<unknown>) => (
          <div>
            <div data-testid="name">{getInitialValue(props, 'name')}</div>
            <div data-testid="age">{getInitialValue(props, 'age')}</div>
            <div data-testid="address.street">
              {getInitialValue(props, 'address.street')}
            </div>
          </div>
        )}
      </Formik>
    );

    expect(getByTestId('name').textContent).toBe('John Doe');
    expect(getByTestId('age').textContent).toBe('30');
    expect(getByTestId('address.street').textContent).toBe('123 Main St');
  });

  it('should return undefined for a non-existing key', () => {
    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(props: FormikProps<unknown>) => (
          <div>
            <div data-testid="nonExistingKey">
              {getInitialValue(props, 'nonExistingKey')}
            </div>
          </div>
        )}
      </Formik>
    );

    expect(getByTestId('nonExistingKey').textContent).toBe('');
  });
});

describe('getValueObj function', () => {
  it('should return the current and initial values for a given key', () => {
    const initialValues = {
      name: 'John Doe',
      age: 30,
    };

    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(props: FormikProps<unknown>) => (
          <div>
            <div data-testid="name">{getValueObj(props, 'name').value}</div>
            <div data-testid="age">{getValueObj(props, 'age').value}</div>
            <div data-testid="name-initial">
              {getValueObj(props, 'name').initialValue}
            </div>
            <div data-testid="age-initial">
              {getValueObj(props, 'age').initialValue}
            </div>
          </div>
        )}
      </Formik>
    );

    expect(getByTestId('name').textContent).toBe('John Doe');
    expect(getByTestId('age').textContent).toBe('30');
    expect(getByTestId('name-initial').textContent).toBe('John Doe');
    expect(getByTestId('age-initial').textContent).toBe('30');
  });

  it('should return undefined for a non-existing key', () => {
    const initialValues = {
      name: 'John Doe',
      age: 30,
    };

    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(props: FormikProps<unknown>) => (
          <div>
            <div data-testid="non-existing">
              {getValueObj(props, 'non-existing').value}
            </div>
            <div data-testid="non-existing-initial">
              {getValueObj(props, 'non-existing').initialValue}
            </div>
          </div>
        )}
      </Formik>
    );

    expect(getByTestId('non-existing').textContent).toBe('');
    expect(getByTestId('non-existing-initial').textContent).toBe('');
  });
});
