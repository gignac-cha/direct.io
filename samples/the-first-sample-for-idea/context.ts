import { createContext, useContext } from 'react';
import { mutations, queries, suspenseQueries } from './__generated';

const defaultValue: {
  queries: typeof queries;
  suspenseQueries: typeof suspenseQueries;
  mutations: typeof mutations;
} = JSON.parse('{}');

export const DirectContext = createContext<typeof defaultValue>(defaultValue);

export const useDirectContext = () =>
  useContext<typeof defaultValue>(DirectContext);
