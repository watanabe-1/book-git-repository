import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import useSWR, { SWRConfiguration, mutate, unstable_serialize } from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { OnServerApi } from '../../@types/studyApi';
import { CommonUi } from '../../@types/studyUtilType';
import { urlConst } from '../../constant/urlConstant';
import { fetchGet } from '../../study/util/studyUtil';
import { onServer } from '../on-server';

const get = async (
  initialDataKey: string | [string, Record<string, string>]
) => {
  let url: string;
  let token: Record<string, string> | undefined;

  if (typeof initialDataKey === 'string') {
    url = initialDataKey;
  } else {
    [url, token] = initialDataKey;
  }

  const res = await fetchGet(url, token);
  console.log(`call get:${url}${token ? JSON.stringify(token) : ''}`);

  return await res.json();
};

export const useCommonSWR = <T>(
  apiFn: (api: OnServerApi) => string,
  initialDataKey: string | [string, Record<string, string>],
  config: Partial<SWRConfiguration> = {
    revalidateOnFocus: false,
    suspense: true,
  }
) => {
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

export const useStaticSWR = <T>(key: string, initialData: T) => {
  const [isInitialDataApplied, setIsInitialDataApplied] = useState(false);

  // 初期値を設定後はこの関数内では再設定しない
  // 数字の0は初期値として使用できないから注意
  if (initialData && !isInitialDataApplied) {
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

export const useInitialUUID = () => {
  const [uuid, setUuid] = useState(null);

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  return uuid;
};
