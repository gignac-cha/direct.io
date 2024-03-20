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
