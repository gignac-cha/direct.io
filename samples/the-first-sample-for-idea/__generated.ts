import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
const headers = { 'Content-Type': 'application/json' };
const request = {
  get: async <T>(url: string | URL): Promise<T> => fetch(url, { method: 'GET' }).then((response: Response) => response.json()),
  post: async <T>(url: string | URL, body: string): Promise<T> => fetch(url, { method: 'POST', headers, body }).then((response: Response) => response.json()),
  put: async <T>(url: string | URL, body: string): Promise<T> => fetch(url, { method: 'PUT', headers, body }).then((response: Response) => response.json()),
  patch: async <T>(url: string | URL, body: string): Promise<T> => fetch(url, { method: 'PATCH', headers, body }).then((response: Response) => response.json()),
  delete: async <T>(url: string | URL): Promise<T> => fetch(url, { method: 'DELETE' }).then((response: Response) => response.json()),
};
const useUserListQuery = () => {
  return useQuery({
    queryKey: ['direct', 'user', 'get', 'list'],
    queryFn: () => request.get<User[]>(`http://localhost:3000/user`),
  });
};
const useUserQuery = (uuid: string) => {
  return useQuery({
    queryKey: ['direct', 'user', 'get', uuid],
    queryFn: () => request.get<User>(`http://localhost:3000/user/${uuid}`),
  });
};
const useUserListSuspenseQuery = () => {
  return useSuspenseQuery({
    queryKey: ['direct', 'user', 'get', 'list'],
    queryFn: () => request.get<User[]>(`http://localhost:3000/user`),
  });
};
const useUserSuspenseQuery = (uuid: string) => {
  return useSuspenseQuery({
    queryKey: ['direct', 'user', 'get', uuid],
    queryFn: () => request.get<User>(`http://localhost:3000/user/${uuid}`),
  });
};
const useAddUserListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'user', 'add', 'list'],
    mutationFn: (userList: NewUser[]) => request.post<User[]>(`http://localhost:3000/user`, JSON.stringify(userList)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'user', 'get', 'list'] }),
  });
};
const useAddUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'user', 'add'],
    mutationFn: (user: NewUser) => request.post<User>(`http://localhost:3000/user`, JSON.stringify(user)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'user', 'get', 'list'] }),
  });
};
const useEditUserMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'user', uuid],
    mutationFn: (user: NewUser) => request.put<User>(`http://localhost:3000/user/${uuid}`, JSON.stringify(user)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direct', 'user', 'get', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['direct', 'user', 'get', uuid] });
    },
  });
};
const useRemoveUserMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'user', uuid],
    mutationFn: () => request.delete<{ uuid: string }>(`http://localhost:3000/user/${uuid}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'user', 'get', 'list'] }),
  });
};
const useTagListQuery = () => {
  return useQuery({
    queryKey: ['direct', 'tag', 'get', 'list'],
    queryFn: () => request.get<Tag[]>(`http://localhost:3000/tag`),
  });
};
const useTagQuery = (uuid: string) => {
  return useQuery({
    queryKey: ['direct', 'tag', 'get', uuid],
    queryFn: () => request.get<Tag>(`http://localhost:3000/tag/${uuid}`),
  });
};
const useTagListSuspenseQuery = () => {
  return useSuspenseQuery({
    queryKey: ['direct', 'tag', 'get', 'list'],
    queryFn: () => request.get<Tag[]>(`http://localhost:3000/tag`),
  });
};
const useTagSuspenseQuery = (uuid: string) => {
  return useSuspenseQuery({
    queryKey: ['direct', 'tag', 'get', uuid],
    queryFn: () => request.get<Tag>(`http://localhost:3000/tag/${uuid}`),
  });
};
const useAddTagListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'tag', 'add', 'list'],
    mutationFn: (tagList: NewTag[]) => request.post<Tag[]>(`http://localhost:3000/tag`, JSON.stringify(tagList)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'tag', 'get', 'list'] }),
  });
};
const useAddTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'tag', 'add'],
    mutationFn: (tag: NewTag) => request.post<Tag>(`http://localhost:3000/tag`, JSON.stringify(tag)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'tag', 'get', 'list'] }),
  });
};
const useEditTagMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'tag', uuid],
    mutationFn: (tag: NewTag) => request.put<Tag>(`http://localhost:3000/tag/${uuid}`, JSON.stringify(tag)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direct', 'tag', 'get', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['direct', 'tag', 'get', uuid] });
    },
  });
};
const useRemoveTagMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'tag', uuid],
    mutationFn: () => request.delete<{ uuid: string }>(`http://localhost:3000/tag/${uuid}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'tag', 'get', 'list'] }),
  });
};
const useArticleListQuery = () => {
  return useQuery({
    queryKey: ['direct', 'article', 'get', 'list'],
    queryFn: () => request.get<Article[]>(`http://localhost:3000/article`),
  });
};
const useArticleQuery = (uuid: string) => {
  return useQuery({
    queryKey: ['direct', 'article', 'get', uuid],
    queryFn: () => request.get<Article>(`http://localhost:3000/article/${uuid}`),
  });
};
const useArticleListSuspenseQuery = () => {
  return useSuspenseQuery({
    queryKey: ['direct', 'article', 'get', 'list'],
    queryFn: () => request.get<Article[]>(`http://localhost:3000/article`),
  });
};
const useArticleSuspenseQuery = (uuid: string) => {
  return useSuspenseQuery({
    queryKey: ['direct', 'article', 'get', uuid],
    queryFn: () => request.get<Article>(`http://localhost:3000/article/${uuid}`),
  });
};
const useAddArticleListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'article', 'add', 'list'],
    mutationFn: (articleList: NewArticle[]) => request.post<Article[]>(`http://localhost:3000/article`, JSON.stringify(articleList)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'article', 'get', 'list'] }),
  });
};
const useAddArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'article', 'add'],
    mutationFn: (article: NewArticle) => request.post<Article>(`http://localhost:3000/article`, JSON.stringify(article)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'article', 'get', 'list'] }),
  });
};
const useEditArticleMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'article', uuid],
    mutationFn: (article: NewArticle) => request.put<Article>(`http://localhost:3000/article/${uuid}`, JSON.stringify(article)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direct', 'article', 'get', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['direct', 'article', 'get', uuid] });
    },
  });
};
const useRemoveArticleMutation = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['direct', 'article', uuid],
    mutationFn: () => request.delete<{ uuid: string }>(`http://localhost:3000/article/${uuid}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', 'article', 'get', 'list'] }),
  });
};
export const queries = {
  useUserListQuery,
  useUserQuery,
  useTagListQuery,
  useTagQuery,
  useArticleListQuery,
  useArticleQuery,
};
export const suspenseQueries = {
  useUserListSuspenseQuery,
  useUserSuspenseQuery,
  useTagListSuspenseQuery,
  useTagSuspenseQuery,
  useArticleListSuspenseQuery,
  useArticleSuspenseQuery,
};
export const mutations = {
  useAddUserListMutation,
  useAddUserMutation,
  useEditUserMutation,
  useRemoveUserMutation,
  useAddTagListMutation,
  useAddTagMutation,
  useEditTagMutation,
  useRemoveTagMutation,
  useAddArticleListMutation,
  useAddArticleMutation,
  useEditArticleMutation,
  useRemoveArticleMutation,
};