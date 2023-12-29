import {
  ErrorResult,
  ErrorResults,
} from '../../../../main/js/@types/studyUtilType';
import {
  objToFormData,
  objArrayToObj,
  getServerErr,
  extractAndDeleteServerErrMsg,
} from '../../../../main/js/study/util/studyYupUtil';

describe('getServerErr function', () => {
  const mockErrorResults: ErrorResults = {
    errorResults: [
      { code: 'ERR01', message: 'Error 1', itemPath: 'field1', isError: true },
      { code: 'ERR02', message: 'Error 2', itemPath: 'field2', isError: true },
      { code: 'ERR03', message: 'Error 3', itemPath: 'field3', isError: true },
    ],
  };

  it('should return the correct error object for a given key', () => {
    const error = getServerErr(mockErrorResults, 'field2');
    expect(error).toEqual({
      code: 'ERR02',
      message: 'Error 2',
      itemPath: 'field2',
      isError: true,
    });
  });

  it('should return undefined if no error matches the key', () => {
    const error = getServerErr(mockErrorResults, 'field4');
    expect(error).toBeUndefined();
  });

  it('should return undefined if the errorResults array is empty', () => {
    const error = getServerErr({ errorResults: [] }, 'field1');
    expect(error).toBeUndefined();
  });

  it('should return undefined if errData is undefined', () => {
    const error = getServerErr(undefined, 'field1');
    expect(error).toBeUndefined();
  });
});

describe('extractAndDeleteServerErrMsg function', () => {
  it('should return the correct error message and modify the itemPath', () => {
    const errData: ErrorResult = {
      code: 'ERR01',
      message: 'Error message',
      itemPath: 'field1',
      isError: true,
    };
    const message = extractAndDeleteServerErrMsg(errData);

    expect(message).toBe('Error message');
    expect(errData.itemPath).toBe('');
  });

  it('should return a default error message if errData is undefined', () => {
    const message = extractAndDeleteServerErrMsg(undefined);
    expect(message).toBe('エラーです');
  });

  it('should return a default error message if errData is null', () => {
    const message = extractAndDeleteServerErrMsg(null);
    expect(message).toBe('エラーです');
  });
});

describe('objToFormData', () => {
  it('converts an object with various types of values to FormData', () => {
    const input = {
      stringKey: 'stringValue',
      numberKey: 123,
      blobKey: new Blob(['blobContent'], { type: 'text/plain' }),
      nestedObject: { nestedKey: 'nestedValue' },
    };

    //console.log(input);

    const output = objToFormData(input);
    expect(output.get('stringKey')).toBe('stringValue');
    expect(output.get('numberKey')).toBe('123');
    expect(output.get('blobKey')).toEqual(expect.any(Blob));
    expect(output.get('nestedObject.nestedKey')).toBe('nestedValue');
  });

  it('ignores undefined and null values', () => {
    const input = {
      definedKey: 'value',
      undefinedKey: undefined,
      nullKey: null,
    };

    const output = objToFormData(input);
    expect(output.has('definedKey')).toBeTruthy();
    expect(output.has('undefinedKey')).toBeFalsy();
    expect(output.has('nullKey')).toBeFalsy();
  });
});

describe('objArrayToObj', () => {
  it('should return undefined for an empty object array', () => {
    expect(objArrayToObj([], 'someArray')).toBeUndefined();
  });

  it('should correctly convert a non-empty object array to an object', () => {
    const objArray = [
      { id: 1, name: 'Test' },
      { id: 2, name: 'Hoge' },
    ];
    const expectedResult = {
      'someArray[0].id': 1,
      'someArray[0].name': 'Test',
      'someArray[1].id': 2,
      'someArray[1].name': 'Hoge',
    };
    expect(objArrayToObj(objArray, 'someArray')).toEqual(expectedResult);
  });

  it('should handle nested objects correctly', () => {
    const objArray = [{ user: { id: 1, name: 'Test' } }];
    const expectedResult = {
      'someArray[0].user.id': 1,
      'someArray[0].user.name': 'Test',
    };
    expect(objArrayToObj(objArray, 'someArray')).toEqual(expectedResult);
  });
});
