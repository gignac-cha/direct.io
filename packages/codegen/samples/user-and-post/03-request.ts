const getGlobalObject = <K extends keyof Window>(name: K): Window[K] => window[name];
const _globalFetch = getGlobalObject('fetch');

const domParser = new DOMParser();

const request = <T,>(
  ...[input, init, ...args]: [
    Parameters<typeof _globalFetch>[0],
    (Parameters<typeof _globalFetch>[1] & { data?: T }) | undefined,
  ]
) =>
  _globalFetch(
    input,
    {
      ...init,
      headers: { ...init?.headers, 'Content-Type': 'application/json' },
      body: init?.data ? JSON.stringify(init.data) : init?.body,
    },
    ...args,
  );

const fetch = {
  request,
  json: async <T,>(...args: Parameters<typeof request>): Promise<T> =>
    fetch.request(...args).then((response: Response) => response.json()),
  text: async (...args: Parameters<typeof request>): Promise<string> =>
    fetch.request(...args).then((response: Response) => response.text()),
  html: async (...args: Parameters<typeof request>): Promise<Document> =>
    fetch.text(...args).then((html: string) => domParser.parseFromString(html, 'text/html')),
  get: async <T,>(url: string | URL): Promise<T> => fetch.json(url, undefined),
  post: async <T,>(url: string | URL, data: unknown): Promise<T> => fetch.json(url, { data }),
  put: async <T,>(url: string | URL, data: unknown): Promise<T> => fetch.json(url, { data }),
  patch: async <T,>(url: string | URL, data: unknown): Promise<T> => fetch.json(url, { data }),
  delete: async <T,>(url: string | URL): Promise<T> => fetch.json(url, undefined),
};
