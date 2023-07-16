import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';

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
  initialDataKey: string | [string, Record<string, string>]
) => {
  const [initialData, initScript] = onServer(
    apiFn,
    [],
    typeof initialDataKey === 'string' ? initialDataKey : initialDataKey[0]
  ) as [T, JSX.Element];

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
    : useSWR<T>(initialDataKey, get, {
        fallbackData: initialData,
        revalidateOnFocus: false,
      });

  return { ...response, initScript };
};

export const useCommonSearchParam = (key: string) => {
  if (!window.isServer) {
    const [searchParams] = useSearchParams();

    return searchParams.get(key);
  }
  return null;
};
