import {
  hiraToKata,
  kataToHira,
  normalizeString,
  simpleTrim,
} from '../../../../main/js/study/util/studyStringUtil';

describe('normalizeString', () => {
  test('normalizes a string to NFKC by default', () => {
    const input = '\u1E9B\u0323';
    const expected = '\u1E9B\u0323'.normalize('NFKC');
    expect(normalizeString(input)).toBe(expected);
  });

  test('normalizes a string to specified form (e.g., NFC)', () => {
    const input = '\u1E9B\u0323';
    const expected = '\u1E9B\u0323'.normalize('NFC');
    expect(normalizeString(input, 'NFC')).toBe(expected);
  });

  test('handles an empty string', () => {
    expect(normalizeString('')).toBe('');
  });

  test('normalizes an already normalized string', () => {
    const input = 'Test String';
    const expected = 'Test String'.normalize('NFKC');
    expect(normalizeString(input)).toBe(expected);
  });
});

describe('hiraToKata', () => {
  test('converts hiragana to katakana', () => {
    expect(hiraToKata('ひらがな')).toBe('ヒラガナ');
  });

  test('does not convert non-hiragana characters', () => {
    expect(hiraToKata('漢字とカタカナとEnglish123')).toBe(
      '漢字トカタカナトEnglish123'
    );
  });

  test('handles an empty string', () => {
    expect(hiraToKata('')).toBe('');
  });

  test('does not change a string with only katakana', () => {
    expect(hiraToKata('カタカナ')).toBe('カタカナ');
  });
});

describe('kataToHira', () => {
  test('converts katakana to hiragana', () => {
    expect(kataToHira('カタカナ')).toBe('かたかな');
  });

  test('does not convert non-katakana characters', () => {
    expect(kataToHira('漢字とひらがなとEnglish123')).toBe(
      '漢字とひらがなとEnglish123'
    );
  });

  test('handles an empty string', () => {
    expect(kataToHira('')).toBe('');
  });

  test('does not change a string with only hiragana', () => {
    expect(kataToHira('ひらがな')).toBe('ひらがな');
  });
});

describe('simpleTrim', () => {
  test('trims leading and trailing whitespace', () => {
    expect(simpleTrim('  hello world  ')).toBe('hello world');
  });

  test('handles a string of only whitespace', () => {
    expect(simpleTrim('     ')).toBe('');
  });

  test('does not change a string without whitespace', () => {
    expect(simpleTrim('hello')).toBe('hello');
  });

  test('handles an empty string', () => {
    expect(simpleTrim('')).toBe('');
  });

  test('handles null and undefined', () => {
    expect(simpleTrim(null)).toBeUndefined();
    expect(simpleTrim(undefined)).toBeUndefined();
  });
});
