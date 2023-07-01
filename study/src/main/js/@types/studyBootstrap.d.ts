/**
 * 色
 */
export type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'body'
  | 'muted';

/**
 * テキスト指定可能色
 */
export type TextColor = `text-${Color}${'' | `-${number}`}`;
