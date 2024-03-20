import {
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const getGlobalObject = <K extends keyof Window>(name: K): Window[K] =>
  window[name];

const _globalFetch = getGlobalObject('fetch');

const domParser = new DOMParser();

const request = <T,>(
  ...[input, init, ...args]: [
    Parameters<typeof _globalFetch>[0],
    (
      | (Parameters<typeof _globalFetch>[1] & {
          data?: T;
        })
      | undefined
    ),
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
    fetch
      .text(...args)
      .then((html: string) => domParser.parseFromString(html, 'text/html')),
  get: async <T,>(url: string | URL): Promise<T> => fetch.json(url, undefined),
  post: async <T,>(url: string | URL, data: unknown): Promise<T> =>
    fetch.json(url, { data }),
  put: async <T,>(url: string | URL, data: unknown): Promise<T> =>
    fetch.json(url, { data }),
  patch: async <T,>(url: string | URL, data: unknown): Promise<T> =>
    fetch.json(url, { data }),
  delete: async <T,>(url: string | URL): Promise<T> =>
    fetch.json(url, undefined),
};

const usePostListSuspenseQuery = () =>
  useSuspenseQuery({
    queryKey: ['post', 'list'],
    queryFn: () => fetch.get<Post[]>(`https://api.example.com/post`),
  });

const usePostSuspenseQuery = ({ uuid }: { uuid: string }) =>
  useSuspenseQuery({
    queryKey: ['post', 'get', uuid],
    queryFn: () => fetch.get<Post>(`https://api.example.com/post/${uuid}`),
  });

const usePostListQuery = () =>
  useQuery({
    queryKey: ['post', 'list'],
    queryFn: () => fetch.get<Post[]>(`https://api.example.com/post`),
  });

const usePostQuery = ({ uuid }: { uuid: string }) =>
  useQuery({
    queryKey: ['post', 'get', uuid],
    queryFn: () => fetch.get<Post>(`https://api.example.com/post/${uuid}`),
  });

const usePostAddMutation = ({ post }: { post: NewPost }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['post', 'add'],
    mutationFn: () =>
      fetch.post<Post>(`https://api.example.com/post`, { post }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'list'] });
    },
  });
};

const usePostEditMutation = ({
  post,
  uuid,
}: {
  post: NewPost;
  uuid: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['post', 'edit', uuid],
    mutationFn: () =>
      fetch.put<Post>(`https://api.example.com/post/${uuid}`, { post }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['post', 'get', uuid] });
    },
  });
};

const usePostRemoveMutation = ({ uuid }: { uuid: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['post', 'remove', uuid],
    mutationFn: () =>
      fetch.delete<Post>(`https://api.example.com/post/${uuid}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['post', 'get', uuid] });
    },
  });
};

export const suspenseQueries = {
  usePostListQuery: usePostListSuspenseQuery,
  usePostQuery: usePostSuspenseQuery,
};

export const queries = {
  usePostListQuery,
  usePostQuery,
};

export const mutations = {
  usePostAddMutation,
  usePostEditMutation,
  usePostRemoveMutation,
};
