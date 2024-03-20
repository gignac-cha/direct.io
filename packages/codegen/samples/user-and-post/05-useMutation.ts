const usePostAddMutation = ({ post }: { post: NewPost }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['post', 'add'],
    mutationFn: () => fetch.post<Post[]>(`https://api.example.com/post`, { post }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'list'] });
    },
  });
};

const usePostEditMutation = ({ uuid, post }: { uuid: string; post: NewPost }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['post', 'edit', uuid],
    mutationFn: () => fetch.put<Post[]>(`https://api.example.com/post/${uuid}`, { post }),
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
    mutationFn: () => fetch.delete<Post[]>(`https://api.example.com/post/${uuid}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['post', 'get', uuid] });
    },
  });
};
