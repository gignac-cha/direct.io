import { ContextType, PropsWithChildren } from 'react';
import { mutations, queries, suspenseQueries } from './__generated';
import { DirectContext } from './context';

export const DirectContextProvider = ({ children }: PropsWithChildren) => {
  const value: Required<ContextType<typeof DirectContext>> = {
    queries,
    suspenseQueries,
    mutations,
  };

  return (
    <DirectContext.Provider value={value}>{children}</DirectContext.Provider>
  );
};
