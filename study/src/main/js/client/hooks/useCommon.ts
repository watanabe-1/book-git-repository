import { useSearchParams } from 'react-router-dom';
import useSWR, { SWRConfiguration } from 'swr';

import { OnServerApi } from '../../@types/studyApi';
import { fetchGet } from '../../study/util/studyUtil';
import { onServer } from '../on-server';

const get = (initialDataKey: string | [string, Record<string, string>]) => {
  let url: string;
  let token: Record<string, string> | undefined;

  if (typeof initialDataKey === 'string') {
    url = initialDataKey;
  } else {
    [url, token] = initialDataKey;
  }

  return fetchGet(url, token).then((r) => {
    console.log(`call get:${url}${token ? JSON.stringify(token) : ''}`);
    return r.json();
  });
};

export const useCommonSWR = <T>(
  apiFn: (api: OnServerApi, param?: object) => string,
  initialDataKey: string | [string, Record<string, string>],
  config: Partial<SWRConfiguration> = {
    revalidateOnFocus: false,
  }
) => {
  const [initialData, initScript] = onServer(
    apiFn,
    [],
    typeof initialDataKey === 'string' ? initialDataKey : initialDataKey[0]
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

export const useCommonSearchParam = (key: string) => {
  if (!window.isServer) {
    const [searchParams] = useSearchParams();

    return searchParams.get(key);
  }
  return null;
};
