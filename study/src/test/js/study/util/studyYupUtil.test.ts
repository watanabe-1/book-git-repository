import {
  objToFormData,
  objArrayToObj,
} from '../../../../main/js/study/util/studyYupUtil';

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
