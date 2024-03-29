import { useCallback, useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useLocation, useSearchParams } from 'react-router-dom';
import useSWR, { SWRConfiguration, mutate, unstable_serialize } from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { OnServerApi } from '../../@types/studyApi';
import {
  CommonUi,
  ErrorResults,
  NestedObject,
} from '../../@types/studyUtilType';
import { urlConst } from '../../constant/urlConstant';
import { fetchGet, fetchPost } from '../../study/util/studyUtil';
import { onServer } from '../on-server';

export const useCommonSWR = <T>(
  apiFn: (api: OnServerApi) => string,
  initialDataKey: string | [string, Record<string, string>],
  config: Partial<SWRConfiguration> = {
    revalidateOnFocus: false,
    suspense: true,
  }
) => {
  const { secureFetchGet } = useFetch();
  const [initialData, initScript] = onServer(
    apiFn,
    null,
    typeof initialDataKey === 'string'
      ? initialDataKey
      : unstable_serialize(initialDataKey)
  ) as [T, JSX.Element];

  const initialDataObj: Partial<SWRConfiguration> = {};
  if (initialData) {
    initialDataObj.fallbackData = initialData;
  }

  const get = useCallback(
    async (initialDataKey: string | [string, Record<string, string>]) => {
      let url: string;
      let token: Record<string, string> | undefined;

      if (typeof initialDataKey === 'string') {
        url = initialDataKey;
      } else {
        [url, token] = initialDataKey;
      }

      try {
        const res = await secureFetchGet(url, token);

        return await res.json();
      } catch (error) {
        console.error(
          `Failed to fetch from ${url}${token ? JSON.stringify(token) : ''}`,
          error
        );
        throw error;
      }
    },
    []
  );

  // useSWRはssr時も、hydrate後にデータが正しいか再度取得に行く
  // つまり再度fetchが実行される
  // https://swr.vercel.app/ja/docs/with-nextjs
  // 最初に事前生成されたデータをレンダリングし、ページがハイドレートされた後、最新のデータを再度フェッチして更新を維持する
  const response = window.isServer
    ? {
        data: initialData,
        error: null,
        mutate: null,
        isValidating: null,
        isLoading: null,
      }
    : useSWR<T>(initialDataKey, get, { ...config, ...initialDataObj });

  return { ...response, initScript };
};

export const useCommonSWRImmutable = <T>(
  apiFn: (api: OnServerApi, param?: object) => string,
  initialDataKey: string | [string, Record<string, string>],
  config?: Partial<SWRConfiguration>
) => {
  return useCommonSWR<T>(apiFn, initialDataKey, {
    ...config,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};

export const useStaticSWR = <T>(key: string, initialData: T = null) => {
  const [isInitialDataApplied, setIsInitialDataApplied] = useState(false);

  // 初期値を設定後はこの関数内では再設定しない
  // nullは初期値として使用できないから注意
  if (initialData !== null && !isInitialDataApplied) {
    mutate(key, initialData);
    setIsInitialDataApplied(true);
  }

  return useSWR(key, null, {
    revalidateOnFocus: false, // 画面フォーカス時の再検証（apiリクエスト）をオフ
    revalidateOnMount: false, // コンポーネントマウント時の再検証（apiリクエスト）をオフ
    revalidateOnReconnect: false, // ブラウザがネットワーク接続できた時の再検証(apiリクエスト)をオフ
    revalidateIfStale: false, // キャッシュが古くなったときの再検証（apiリクエスト）をオフ
  });
};

export const useCommonInfoSWR = () => {
  //console.log('call useCommonInfoSWR');
  return useCommonSWR<CommonUi>(
    (api) => api.getCommonInfo(),
    urlConst.common.COMMON_INFO
  );
};

export const useCommonSearchParam = (key: string) => {
  if (window.isServer) {
    // server側では自力でパラメータを取得
    const location = useLocation();
    const url = location.pathname + location.search;
    const escapeKey = key.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + escapeKey + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  } else {
    const [searchParams] = useSearchParams();

    return searchParams.get(key);
  }
};

export const useInitialUUID = (): string | null => {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  return uuid;
};

/**
 * wiondowのサイズを監視して取得する
 *
 * @returns windowのサイズ
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

/**
 * エラーデータ用state
 *
 * @returns
 */
export const useErrData = () => {
  return useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];
};

/**
 * ErrorBoundaryにエラーを通知できるようにした
 * 汎用fetchを返却
 *
 * @returns
 */
export const useFetch = () => {
  const { showBoundary } = useErrorBoundary();

  /**
   * get通信を行う
   *
   * @param baseurl 通信先
   * @param params パラメータ
   * @returns 通信結果
   */
  const secureFetchGet = useCallback(
    async (baseurl: string, params: Record<string, string> = {}) => {
      try {
        return await fetchGet(baseurl, params);
      } catch (error) {
        console.error('Error occurred during fetchGet:', error);
        // 非同期実行のため普通にスローしてもerror-boundary側でキャッチできない
        // そのためshowBoundaryを使用してerror-boundaryにエラーを連携する
        showBoundary(error);
        throw error;
      } finally {
        //console.log('secureFetchGet が完了しました');
      }
    },
    []
  );

  /**
   * post通信を行う(error-boundaryにエラーを連携する)
   *
   * @param baseurl 通信先
   * @param params 送付パラム
   * @returns 通信結果
   */
  const secureFetchPost = useCallback(
    async (baseurl: string, params: NestedObject = {}) => {
      try {
        return await fetchPost(baseurl, params);
      } catch (error) {
        console.error('Error occurred during fetchPost:', error);
        // 非同期実行のため普通にスローしてもerror-boundary側でキャッチできない
        // そのためshowBoundaryを使用してerror-boundaryにエラーを連携する
        showBoundary(error);
        throw error;
      } finally {
        //console.log('secureFetchPost が完了しました');
      }
    },
    []
  );

  return {
    secureFetchGet,
    secureFetchPost,
  };
};
