interface Window {
  hydrateApp: () => void;
  renderApp: () => void;
  renderAppOnServer: (url: string) => string;
  api: OnServerApi;
  isServer: boolean;
  serverData: object;
  ssrFlags: object;
  contextPath: string;
}
