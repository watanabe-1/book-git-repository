/**
 * @jest-environment jsdom
 */
import * as studyStringUtil from '../../../../main/js/study/util/studyStringUtil';
import {
  ToTypeArrayIfIsStringArray,
  addContextPath,
  fetchGet,
  fetchPost,
  getBaseUrl,
  getContextPath,
  getCsrfToken,
  getCsrfTokenHeader,
  getCsrfTokenParmName,
  getNoImagePath,
  isNumber,
  isObjEmpty,
  nullOrEmptyValueLogic,
  stringToType,
} from '../../../../main/js/study/util/studyUtil';

describe('getBaseUrl', () => {
  it('should return the base URL consisting of protocol and host', () => {
    // Mock the global location object
    delete global.location;
    global.location = {
      protocol: 'https:',
      host: 'example.com',
    } as Location;

    // Call the function
    const baseUrl = getBaseUrl();

    // Check if the function returns the correct URL
    expect(baseUrl).toBe('https://example.com');
  });
});

describe('getContextPath', () => {
  afterEach(() => {
    // Remove contextPath from window object after each test
    window.contextPath = null;
  });

  it('should return context path from window object if available', () => {
    Object.defineProperty(window, 'contextPath', {
      value: '/exampleContextPath',
      writable: true,
    });

    expect(getContextPath()).toBe('/exampleContextPath');
  });

  it('should return context path from meta tag if window object does not have contextPath', () => {
    // Mock document.querySelector to return a meta element with content
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'meta[name="contextPath"]') {
        return { content: '/metaContextPath' };
      }
      return null;
    });

    expect(getContextPath()).toBe('/metaContextPath');
  });
});

describe('addContextPath', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  it('should join context path with the given URL', () => {
    // Mock getContextPath and pathJoin
    const mockPathJoin = jest
      .fn()
      .mockImplementation((contextPath, url) => contextPath + url);

    jest.spyOn(studyStringUtil, 'pathJoin').mockImplementation(mockPathJoin);

    Object.defineProperty(window, 'contextPath', {
      value: '/exampleContextPath',
      writable: true,
    });

    // Call the function with a test URL
    const testUrl = '/testUrl';
    const result = addContextPath(testUrl);

    // Verify that the mocked functions were called correctly
    expect(mockPathJoin).toHaveBeenCalledWith('/exampleContextPath', testUrl);

    // Check if the function returns the correctly joined path
    expect(result).toBe('/exampleContextPath/testUrl');
  });
});

describe('getNoImagePath', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  it('should return the path for no-image image', () => {
    // Mock getContextPath and pathJoin
    const mockPathJoin = jest
      .fn()
      .mockImplementation((contextPath, imagePath) => contextPath + imagePath);

    jest.spyOn(studyStringUtil, 'pathJoin').mockImplementation(mockPathJoin);

    Object.defineProperty(window, 'contextPath', {
      value: '/exampleContextPath',
      writable: true,
    });

    // Call the function
    const result = getNoImagePath();

    // Verify that the mocked functions were called correctly
    expect(mockPathJoin).toHaveBeenCalledWith(
      '/exampleContextPath',
      '/images/no_image.png'
    );

    // Check if the function returns the correctly joined path
    expect(result).toBe('/exampleContextPath/images/no_image.png');
  });
});

describe('getCsrfToken', () => {
  beforeEach(() => {
    // Mock document.querySelector
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'meta[name="_csrf"]') {
        return { content: 'mock-csrf-token' };
      }
      return null;
    });
  });

  afterEach(() => {
    // Clear the mock
    jest.clearAllMocks();
  });

  it('should return CSRF token from meta tag', () => {
    // Call the function
    const csrfToken = getCsrfToken();

    // Check if the function returns the correct token
    expect(csrfToken).toBe('mock-csrf-token');
  });
});

describe('getCsrfTokenHeader', () => {
  beforeEach(() => {
    // Mock document.querySelector
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'meta[name="_csrf_header"]') {
        return { content: 'mock-csrf-header' };
      }
      return null;
    });
  });

  afterEach(() => {
    // Clear the mock
    jest.clearAllMocks();
  });

  it('should return CSRF token header name from meta tag', () => {
    // Call the function
    const csrfTokenHeader = getCsrfTokenHeader();

    // Check if the function returns the correct header name
    expect(csrfTokenHeader).toBe('mock-csrf-header');
  });
});

describe('getCsrfTokenParmName', () => {
  beforeEach(() => {
    // Mock document.querySelector
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'meta[name="_csrf_parameterName"]') {
        return { content: 'mock-csrf-param-name' };
      }
      return null;
    });
  });

  afterEach(() => {
    // Clear the mock
    jest.clearAllMocks();
  });

  it('should return CSRF token parameter name from meta tag', () => {
    // Call the function
    const csrfTokenParmName = getCsrfTokenParmName();

    // Check if the function returns the correct parameter name
    expect(csrfTokenParmName).toBe('mock-csrf-param-name');
  });
});

describe('isObjEmpty', () => {
  it('should return true for an empty object', () => {
    const emptyObj = {};
    expect(isObjEmpty(emptyObj)).toBe(true);
  });

  it('should return false for a non-empty object', () => {
    const nonEmptyObj = { key: 'value' };
    expect(isObjEmpty(nonEmptyObj)).toBe(false);
  });

  it('should return false for an object with only undefined, null, or empty properties', () => {
    const objWithEmptyValues = { key1: undefined, key2: null, key3: '' };
    // Depending on the definition of "empty", this test might need adjustment
    expect(isObjEmpty(objWithEmptyValues)).toBe(false);
  });
});

describe('fetchGet', () => {
  const mockResponse = {
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() => Promise.resolve(mockResponse)) as jest.Mock;
    Object.defineProperty(window, 'contextPath', {
      value: '/mockedContextPath',
      writable: true,
    });
  });

  it('should perform a GET request and return response', async () => {
    const params = { key: 'value' };
    const response = await fetchGet('/testUrl', params);

    expect(global.fetch).toHaveBeenCalledWith(
      '/mockedContextPath/testUrl?key=value'
    );
    expect(response).toEqual(mockResponse);
  });

  it('should perform a GET request without query parameters if params are empty', async () => {
    const response = await fetchGet('/testUrl', {});

    expect(global.fetch).toHaveBeenCalledWith('/mockedContextPath/testUrl');
    expect(response).toEqual(mockResponse);
  });

  it('should throw an error for non-200 status codes', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    ) as jest.Mock;

    await expect(fetchGet('/testUrl')).rejects.toThrow(
      'unexpected status: 404'
    );
  });

  it('should throw an error on network failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network Error'))
    ) as jest.Mock;

    await expect(fetchGet('/testUrl')).rejects.toThrow('Network Error');
  });
});

describe('fetchPost', () => {
  const mockResponse = {
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() => Promise.resolve(mockResponse)) as jest.Mock;
    // document.querySelectorをモック化
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'meta[name="_csrf"]') {
        return { content: 'mock-csrf-token' };
      }
      if (selector === 'meta[name="_csrf_header"]') {
        return { content: 'X-CSRF-Token' };
      }
      return null;
    });
    Object.defineProperty(window, 'contextPath', {
      value: '/mockedContextPath',
      writable: true,
    });
  });

  it('should perform a POST request and return response', async () => {
    const params = { key: 'value' };
    const response = await fetchPost('/testUrl', params);

    // fetchが適切な引数で呼び出されたか確認
    expect(global.fetch).toHaveBeenCalledWith('/mockedContextPath/testUrl', {
      method: 'POST',
      headers: { 'X-CSRF-Token': 'mock-csrf-token' },
      body: expect.any(FormData),
    });

    // 関数の戻り値が期待通りであるか確認
    expect(response).toEqual(mockResponse);
  });

  it('should perform a POST request with empty FormData if params are empty', async () => {
    const response = await fetchPost('/testUrl', {});

    expect(global.fetch).toHaveBeenCalledWith('/mockedContextPath/testUrl', {
      method: 'POST',
      headers: { 'X-CSRF-Token': 'mock-csrf-token' },
      body: expect.any(FormData),
    });
    expect(response).toEqual(mockResponse);
  });

  it('should not throw an error for non-200 status codes', async () => {
    const mockErrResponse = {
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    };

    global.fetch = jest.fn(() => Promise.resolve(mockErrResponse)) as jest.Mock;

    const response = await fetchPost('/testUrl');
    expect(response).toEqual(mockErrResponse);
  });

  it('should throw an error on network failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network Error'))
    ) as jest.Mock;

    await expect(fetchPost('/testUrl')).rejects.toThrow('Network Error');
  });
});

describe('stringToType', () => {
  it('should convert a string to a Type object', () => {
    const str = 'example';
    const result = stringToType(str);

    expect(result).toEqual({
      code: 'example',
      name: 'example',
    });
  });
});

describe('ToTypeArrayIfIsStringArray', () => {
  it('should convert an array of strings to an array of Type objects', () => {
    const stringArray = ['str1', 'str2'];
    const result = ToTypeArrayIfIsStringArray(stringArray);
    expect(result).toEqual(stringArray.map(stringToType));
  });

  it('should keep an array of Type objects unchanged', () => {
    const typeArray = [
      { code: 'code1', name: 'name1' },
      { code: 'code2', name: 'name2' },
    ];
    const result = ToTypeArrayIfIsStringArray(typeArray);
    expect(result).toEqual(typeArray);
  });
});

describe('nullOrEmptyValueLogic', () => {
  it('should replace null with the provided value', () => {
    const result = nullOrEmptyValueLogic(null, 'replacement');
    expect(result).toBe('replacement');
  });

  it('should replace undefined with the provided value', () => {
    const result = nullOrEmptyValueLogic(undefined, 'replacement');
    expect(result).toBe('replacement');
  });

  it('should replace an empty string with the provided value', () => {
    const result = nullOrEmptyValueLogic('', 'replacement');
    expect(result).toBe('replacement');
  });

  it('should not replace a non-empty string with the provided value', () => {
    const result = nullOrEmptyValueLogic('non-empty', 'replacement');
    expect(result).toBe('non-empty');
  });

  it('should not replace a non-null object with the provided value', () => {
    const result = nullOrEmptyValueLogic({ prop: 'value' }, 'replacement');
    expect(result).toEqual({ prop: 'value' });
  });

  it('should not replace a number with the provided value', () => {
    const result = nullOrEmptyValueLogic(42, 'replacement');
    expect(result).toBe(42);
  });

  it('should replace a falsy value with the provided value', () => {
    const result = nullOrEmptyValueLogic(false, 'replacement');
    expect(result).toBe('replacement');
  });

  it('should replace NaN with the provided value', () => {
    const result = nullOrEmptyValueLogic(NaN, 'replacement');
    expect(result).toBe('replacement');
  });

  it('should not replace Infinity with the provided value', () => {
    const result = nullOrEmptyValueLogic(Infinity, 'replacement');
    expect(result).toBe(Infinity);
  });

  it('should not replace a non-NaN number with the provided value', () => {
    const result = nullOrEmptyValueLogic(42.5, 'replacement');
    expect(result).toBe(42.5);
  });

  it('should not replace -Infinity with the provided value', () => {
    const result = nullOrEmptyValueLogic(-Infinity, 'replacement');
    expect(result).toBe(-Infinity);
  });
});

describe('isNumber', () => {
  it('should return true for valid numbers as strings', () => {
    expect(isNumber('123')).toBe(true);
    expect(isNumber('0')).toBe(true);
    expect(isNumber('-456')).toBe(true);
    expect(isNumber('3.14')).toBe(true);
  });
});
