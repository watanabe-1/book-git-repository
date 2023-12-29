/**
 * @jest-environment jsdom
 */
import {
  downloadFile,
  getFilenameFromContentDisposition,
  getFilenameFromResponse,
} from '../../../../main/js/study/util/studyFileUtil';

const createMockResponse = (headerValue: string | null) => {
  return {
    headers: {
      get: jest.fn().mockReturnValue(headerValue),
    },
  } as unknown as Response;
};

describe('getFilenameFromResponse function', () => {
  it('should extract filename from response with Content-Disposition filename=', () => {
    const mockResponse = createMockResponse(
      'attachment; filename="example.txt"'
    );
    const filename = getFilenameFromResponse(mockResponse);
    expect(filename).toBe('example.txt');
  });

  it('should extract filename from response with Content-Disposition filename*=', () => {
    const mockResponse = createMockResponse(
      "attachment; filename*=UTF-8''example.txt"
    );
    const filename = getFilenameFromResponse(mockResponse);
    expect(filename).toBe('example.txt');
  });

  it('should return null if Content-Disposition header is missing', () => {
    const mockResponse = createMockResponse(null);
    const filename = getFilenameFromResponse(mockResponse);
    expect(filename).toBeNull();
  });
});

describe('getFilenameFromContentDisposition function', () => {
  it('should extract filename from Content-Disposition with filename=', () => {
    const header = 'attachment; filename="example.txt"';
    const filename = getFilenameFromContentDisposition(header);
    expect(filename).toBe('example.txt');
  });

  it('should extract filename from Content-Disposition with filename*=', () => {
    const header = "attachment; filename*=UTF-8''example.txt";
    const filename = getFilenameFromContentDisposition(header);
    expect(filename).toBe('example.txt');
  });

  it('should prioritize filename*= over filename= when both are present', () => {
    const header =
      'attachment; filename="fallback.txt"; filename*=UTF-8\'\'example.txt';
    const filename = getFilenameFromContentDisposition(header);
    expect(filename).toBe('example.txt');
  });

  // デコード失敗想定
  // wariniglogが出力されるが想定動作
  it('should handle non-UTF-8 encoded filenames', () => {
    const header = "attachment; filename*=ISO-8859-1''%C3%A4xample.txt";
    const filename = getFilenameFromContentDisposition(header);
    expect(filename).toBe('äxample.txt');
  });

  it('should return null for invalid or missing Content-Disposition', () => {
    expect(getFilenameFromContentDisposition(null)).toBeNull();
    expect(getFilenameFromContentDisposition('')).toBeNull();
    expect(getFilenameFromContentDisposition('invalid-header')).toBeNull();
  });
});

describe('downloadFile function', () => {
  beforeEach(() => {
    // Reset DOM and mocks before each test
    document.body.innerHTML = '';
    jest.clearAllMocks();
    // Mock global.URL.createObjectURL
    (global.URL.createObjectURL as jest.Mock) = jest.fn();
  });

  it('should create a link with the correct attributes for download', () => {
    const mockBlob = new Blob(['test'], { type: 'text/plain' });
    const mockURL = 'blob:test-url';
    const mockFilename = 'test.txt';

    // Mock createObjectURL
    (global.URL.createObjectURL as jest.Mock).mockReturnValue(mockURL);

    // Mock the click method
    HTMLAnchorElement.prototype.click = jest.fn();

    downloadFile(mockBlob, mockFilename);

    // Assert that the link is created with correct attributes
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
    expect((global.URL.createObjectURL as jest.Mock).mock.calls[0][0]).toBe(
      mockBlob
    );
  });
});
