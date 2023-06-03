import { ChartType } from 'chart.js';

import { ErrorResults } from './studyUtilType';

/**
 * chart.jsのプラグインtypeの拡張
 */
declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType = ChartType> {
    doughnutChart?: {
      title?: string;
    };
  }
}

/**
 * yupにサーバー側のバリデーションなどでエラーになったことを検知するバリデーションを追加
 */
declare module 'yup' {
  // yup.string スキーマーに対して 'server'メソッドを追加
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    server(errData: ErrorResults): StringSchema<TType, TContext>;
  }

  // yup.number スキーマーに対して 'server'メソッドを追加
  interface NumberSchema<
    TType extends Maybe<number> = number | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    server(errData: ErrorResults): NumberSchema<TType, TContext>;
  }

  // yup.boolean スキーマーに対して 'server'メソッドを追加
  interface BooleanSchema<
    TType extends Maybe<boolean> = boolean | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    server(errData: ErrorResults): BooleanSchemaSchema<TType, TContext>;
  }

  // yup.mixed スキーマーに対して 'server'メソッドを追加
  interface MixedSchema<
    TType extends Maybe<mixed> = mixed | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    server(errData: ErrorResults): MixedSchema<TType, TContext>;
  }

  // yup.object スキーマーに対して 'server'メソッドを追加
  interface ObjectSchema<
    TType extends Maybe<object> = object | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    server(errData: ErrorResults): ObjectSchema<TType, TContext>;
  }

  // yup.date スキーマーに対して 'server'メソッドを追加
  interface DateSchema<
    TType extends Maybe<date> = date | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    server(errData: ErrorResults): DateSchema<TType, TContext>;
  }
}
