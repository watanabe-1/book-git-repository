import {
  escapeRegExp,
  hiraToKata,
  joinBase,
  joinBases,
  kataToHira,
  keyJoin,
  normalizeString,
  pathJoin,
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

describe('escapeRegExp', () => {
  // 特殊文字のエスケープ
  test('escapes regular expression special characters', () => {
    const specialChars = '.*+?^${}()|[]\\';
    const escapedSpecialChars = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
    expect(escapeRegExp(specialChars)).toBe(escapedSpecialChars);
  });

  // 連続する特殊文字のエスケープ
  test('escapes a string with consecutive special characters', () => {
    const consecutiveSpecialChars = '**++??^^$${{}}(())||[[]]\\\\';
    const escapedConsecutiveSpecialChars =
      '\\*\\*\\+\\+\\?\\?\\^\\^\\$\\$\\{\\{\\}\\}\\(\\(\\)\\)\\|\\|\\[\\[\\]\\]\\\\\\\\';
    expect(escapeRegExp(consecutiveSpecialChars)).toBe(
      escapedConsecutiveSpecialChars
    );
  });

  test('does not change a string without special characters', () => {
    const normalString = 'hello world';
    expect(escapeRegExp(normalString)).toBe(normalString);
  });

  test('handles an empty string', () => {
    expect(escapeRegExp('')).toBe('');
  });
});

describe('joinBase', () => {
  test('joins base and add with separator when separator is not at the end of base', () => {
    expect(joinBase('base', 'add', '/')).toBe('base/add');
  });

  test('joins base and add without additional separator when separator is at the end of base', () => {
    expect(joinBase('base/', 'add', '/')).toBe('base/add');
  });

  test('joins base and add without additional separator when separator is at both end of base and start of add', () => {
    expect(joinBase('base/', '/add', '/')).toBe('base/add');
  });

  test('returns add when base is empty', () => {
    expect(joinBase('', 'add', '/')).toBe('add');
  });

  test('returns base when add is empty', () => {
    expect(joinBase('base', '', '/')).toBe('base');
  });

  test('returns empty string when both base and add are empty', () => {
    expect(joinBase('', '', '/')).toBe('');
  });
});

describe('joinBases', () => {
  test('correctly joins multiple add strings to the base string', () => {
    expect(joinBases('base', ['add1', 'add2', 'add3'], '/')).toBe(
      'base/add1/add2/add3'
    );
  });

  test('returns the base string when adds is an empty array', () => {
    expect(joinBases('base', [], '/')).toBe('base');
  });

  test('handles empty strings in adds array', () => {
    expect(joinBases('base', ['add1', '', 'add3'], '/')).toBe('base/add1/add3');
  });

  test('returns an empty string when base is empty and adds is empty', () => {
    expect(joinBases('', [], '/')).toBe('');
  });

  test('returns only adds when base is empty', () => {
    expect(joinBases('', ['add1', 'add2'], '/')).toBe('add1/add2');
  });
});

describe('keyJoin', () => {
  test('correctly joins multiple add strings to the base string with dots', () => {
    expect(keyJoin('base', 'add1', 'add2', 'add3')).toBe('base.add1.add2.add3');
  });

  test('returns the base string when no adds are provided', () => {
    expect(keyJoin('base')).toBe('base');
  });

  test('handles empty strings in adds array', () => {
    expect(keyJoin('base', 'add1', '', 'add3')).toBe('base.add1.add3');
  });

  test('returns an empty string when base is empty and no adds are provided', () => {
    expect(keyJoin('', '')).toBe('');
  });

  test('returns only adds when base is empty', () => {
    expect(keyJoin('', 'add1', 'add2')).toBe('add1.add2');
  });
});

describe('pathJoin', () => {
  test('correctly joins multiple add strings to the base string with slashes', () => {
    expect(pathJoin('base', 'add1', 'add2', 'add3')).toBe(
      'base/add1/add2/add3'
    );
  });

  test('returns the base string when no adds are provided', () => {
    expect(pathJoin('base')).toBe('base');
  });

  test('handles empty strings in adds array', () => {
    expect(pathJoin('base', 'add1', '', 'add3')).toBe('base/add1/add3');
  });

  test('returns an empty string when base is empty and no adds are provided', () => {
    expect(pathJoin('', '')).toBe('');
  });

  test('returns only adds when base is empty', () => {
    expect(pathJoin('', 'add1', 'add2')).toBe('add1/add2');
  });
});
