import { writeFile } from 'fs/promises';
import { ColumnType, DataSource, EntityMetadata } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { convertResourceName, entityKeyMap } from './store';

const getTypeString = (type: ColumnType) => {
  switch (typeof type) {
    case 'function':
      switch (type.name) {
        case 'Number':
          return 'number';
        case 'String':
          return 'string';
      }
      return 'unknown';
    case 'string':
      switch (type) {
        case 'uuid':
        case 'timestamp':
        case 'date':
          return 'string';
      }
      return 'unknown';
  }
};

const getEntityColumnString = (columnMetadata: ColumnMetadata) => {
  return `  ${columnMetadata.propertyName}: ${getTypeString(columnMetadata.type)};`;
};

const getEntityString = (entityMetadata: EntityMetadata) => {
  const lines = [`declare interface ${entityMetadata.name} {`];
  for (const column of entityMetadata.columns) {
    if (!column.isPrimary) {
      lines.push(getEntityColumnString(column));
    }
  }
  lines.push('}');
  lines.push(`declare interface New${entityMetadata.name} {`);
  for (const column of entityMetadata.columns) {
    if (!column.isPrimary && column.isUpdate) {
      lines.push(getEntityColumnString(column));
    }
  }
  lines.push('}');
  return lines.join('\n');
};

const generateTypeDefinitions = async (
  entityMetadataList: EntityMetadata[],
) => {
  const lines: string[] = [];
  for (const entityMetadata of entityMetadataList) {
    lines.push(getEntityString(entityMetadata));
  }
  await writeFile('__generated.d.ts', lines.join('\n'));
};

const getListQueryString = ({
  queryName,
  entityName,
  resourceName,
  isSuspense,
}: {
  queryName: string;
  entityName: string;
  resourceName: string;
  isSuspense: boolean;
}) => {
  const functionName = isSuspense ? 'useSuspenseQuery' : 'useQuery';
  return [
    `const ${queryName} = () => {`,
    `  return ${functionName}({`,
    `    queryKey: ['direct', '${resourceName}', 'get', 'list'],`,
    `    queryFn: () => request.get<${entityName}[]>(\`${'http://localhost:3000'}/${resourceName}\`),`,
    `  });`,
    `};`,
  ];
};
const getListItemQueryString = ({
  queryName,
  entityName,
  resourceName,
  keyColumnName,
  keyColumnType,
  isSuspense,
}: {
  queryName: string;
  entityName: string;
  resourceName: string;
  keyColumnName: string;
  keyColumnType: string;
  isSuspense: boolean;
}) => {
  const functionName = isSuspense ? 'useSuspenseQuery' : 'useQuery';
  return [
    `const ${queryName} = (${keyColumnName}: ${keyColumnType}) => {`,
    `  return ${functionName}({`,
    `    queryKey: ['direct', '${resourceName}', 'get', ${keyColumnName}],`,
    `    queryFn: () => request.get<${entityName}>(\`${'http://localhost:3000'}/${resourceName}/\${${keyColumnName}}\`),`,
    `  });`,
    `};`,
  ];
};

const getQueryStrings = ({
  entityMetadata,
  keyColumnName,
  isSuspense,
}: {
  entityMetadata: EntityMetadata;
  keyColumnName: string;
  isSuspense: boolean;
}): [string, string[]][] => {
  const entityName = entityMetadata.name;
  const resourceName = convertResourceName(entityName);
  const suspenseName = isSuspense ? 'Suspense' : '';
  const keyColumn = entityMetadata.columns.find(
    (columnMetadata: ColumnMetadata) =>
      columnMetadata.propertyName === keyColumnName,
  );
  const keyColumnType = getTypeString(keyColumn?.type ?? 'raw');
  return [
    [
      `use${entityName}List${suspenseName}Query`,
      getListQueryString({
        queryName: `use${entityName}List${suspenseName}Query`,
        entityName,
        resourceName,
        isSuspense,
      }),
    ],
    [
      `use${entityName}${suspenseName}Query`,
      getListItemQueryString({
        queryName: `use${entityName}${suspenseName}Query`,
        entityName,
        resourceName,
        keyColumnName,
        keyColumnType,
        isSuspense,
      }),
    ],
  ];
};

const getAddListMutationString = ({
  mutationName,
  entityName,
  resourceName,
}: {
  mutationName: string;
  entityName: string;
  resourceName: string;
}) => {
  return [
    `const ${mutationName} = () => {`,
    `  const queryClient = useQueryClient();`,
    `  return useMutation({`,
    `    mutationKey: ['direct', '${resourceName}', 'add', 'list'],`,
    `    mutationFn: (${resourceName}List: New${entityName}[]) => request.post<${entityName}[]>(\`${'http://localhost:3000'}/${resourceName}\`, JSON.stringify(${resourceName}List)),`,
    `    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', '${resourceName}', 'get', 'list'] }),`,
    `  });`,
    `};`,
  ];
};
const getAddMutationString = ({
  mutationName,
  entityName,
  resourceName,
}: {
  mutationName: string;
  entityName: string;
  resourceName: string;
}) => {
  return [
    `const ${mutationName} = () => {`,
    `  const queryClient = useQueryClient();`,
    `  return useMutation({`,
    `    mutationKey: ['direct', '${resourceName}', 'add'],`,
    `    mutationFn: (${resourceName}: New${entityName}) => request.post<${entityName}>(\`${'http://localhost:3000'}/${resourceName}\`, JSON.stringify(${resourceName})),`,
    `    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', '${resourceName}', 'get', 'list'] }),`,
    `  });`,
    `};`,
  ];
};
const getEditMutationString = ({
  mutationName,
  entityName,
  resourceName,
  keyColumnName,
  keyColumnType,
}: {
  mutationName: string;
  entityName: string;
  resourceName: string;
  keyColumnName: string;
  keyColumnType: string;
}) => {
  return [
    `const ${mutationName} = (${keyColumnName}: ${keyColumnType}) => {`,
    `  const queryClient = useQueryClient();`,
    `  return useMutation({`,
    `    mutationKey: ['direct', '${resourceName}', ${keyColumnName}],`,
    `    mutationFn: (${resourceName}: New${entityName}) => request.put<${entityName}>(\`${'http://localhost:3000'}/${resourceName}/\${${keyColumnName}}\`, JSON.stringify(${resourceName})),`,
    `    onSuccess: () => {`,
    `      queryClient.invalidateQueries({ queryKey: ['direct', '${resourceName}', 'get', 'list'] });`,
    `      queryClient.invalidateQueries({ queryKey: ['direct', '${resourceName}', 'get', ${keyColumnName}] });`,
    `    },`,
    `  });`,
    `};`,
  ];
};
const getRemoveMutationString = ({
  mutationName,
  resourceName,
  keyColumnName,
  keyColumnType,
}: {
  mutationName: string;
  resourceName: string;
  keyColumnName: string;
  keyColumnType: string;
}) => {
  return [
    `const ${mutationName} = (${keyColumnName}: ${keyColumnType}) => {`,
    `  const queryClient = useQueryClient();`,
    `  return useMutation({`,
    `    mutationKey: ['direct', '${resourceName}', ${keyColumnName}],`,
    `    mutationFn: () => request.delete<{ ${keyColumnName}: ${keyColumnType} }>(\`${'http://localhost:3000'}/${resourceName}/\${${keyColumnName}}\`),`,
    `    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direct', '${resourceName}', 'get', 'list'] }),`,
    `  });`,
    `};`,
  ];
};

const getMutationStrings = ({
  entityMetadata,
  keyColumnName,
}: {
  entityMetadata: EntityMetadata;
  keyColumnName: string;
}): [string, string[]][] => {
  const entityName = entityMetadata.name;
  const resourceName = convertResourceName(entityName);
  const keyColumn = entityMetadata.columns.find(
    (columnMetadata: ColumnMetadata) =>
      columnMetadata.propertyName === keyColumnName,
  );
  const keyColumnType = getTypeString(keyColumn?.type ?? 'raw');
  return [
    [
      `useAdd${entityName}ListMutation`,
      getAddListMutationString({
        mutationName: `useAdd${entityName}ListMutation`,
        entityName,
        resourceName,
      }),
    ],
    [
      `useAdd${entityName}Mutation`,
      getAddMutationString({
        mutationName: `useAdd${entityName}Mutation`,
        entityName,
        resourceName,
      }),
    ],
    [
      `useEdit${entityName}Mutation`,
      getEditMutationString({
        mutationName: `useEdit${entityName}Mutation`,
        entityName,
        resourceName,
        keyColumnName,
        keyColumnType,
      }),
    ],
    [
      `useRemove${entityName}Mutation`,
      getRemoveMutationString({
        mutationName: `useRemove${entityName}Mutation`,
        resourceName,
        keyColumnName,
        keyColumnType,
      }),
    ],
  ];
};

const generateQueries = async (entitieMetadataList: EntityMetadata[]) => {
  const allQueryNames: string[] = [];
  const allSuspenseQueryNames: string[] = [];
  const allMutationNames: string[] = [];
  const lines = [
    `import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';`,
    `const headers = { 'Content-Type': 'application/json' };`,
    `const request = {`,
    `  get: async <T>(url: string | URL): Promise<T> => fetch(url, { method: 'GET' }).then((response: Response) => response.json()),`,
    `  post: async <T>(url: string | URL, body: string): Promise<T> => fetch(url, { method: 'POST', headers, body }).then((response: Response) => response.json()),`,
    `  put: async <T>(url: string | URL, body: string): Promise<T> => fetch(url, { method: 'PUT', headers, body }).then((response: Response) => response.json()),`,
    `  patch: async <T>(url: string | URL, body: string): Promise<T> => fetch(url, { method: 'PATCH', headers, body }).then((response: Response) => response.json()),`,
    `  delete: async <T>(url: string | URL): Promise<T> => fetch(url, { method: 'DELETE' }).then((response: Response) => response.json()),`,
    `};`,
  ];
  for (const entityMetadata of entitieMetadataList) {
    const keyColumnName =
      entityKeyMap.get(entityMetadata.name) ?? 'invalid-key-name';
    for (const [queryName, queryLines] of getQueryStrings({
      entityMetadata,
      keyColumnName,
      isSuspense: false,
    })) {
      allQueryNames.push(queryName);
      lines.push(...queryLines);
    }
    for (const [queryName, queryLines] of getQueryStrings({
      entityMetadata,
      keyColumnName,
      isSuspense: true,
    })) {
      allSuspenseQueryNames.push(queryName);
      lines.push(...queryLines);
    }
    for (const [mutationName, mutationLines] of getMutationStrings({
      entityMetadata,
      keyColumnName,
    })) {
      allMutationNames.push(mutationName);
      lines.push(...mutationLines);
    }
  }
  lines.push(`export const queries = {`);
  lines.push(`  ${allQueryNames.join(',\n  ')},`);
  lines.push(`};`);
  lines.push(`export const suspenseQueries = {`);
  lines.push(`  ${allSuspenseQueryNames.join(',\n  ')},`);
  lines.push(`};`);
  lines.push(`export const mutations = {`);
  lines.push(`  ${allMutationNames.join(',\n  ')},`);
  lines.push(`};`);
  await writeFile('__generated.ts', lines.join('\n'));
};

export const generate = async ({
  dataSource,
  entities,
}: {
  dataSource: DataSource;
  entities: Entities;
}) => {
  if (Array.isArray(entities)) {
    const entityMetadataList = entities.map((entity: Entity) =>
      dataSource.getMetadata(entity),
    );
    await generateTypeDefinitions(entityMetadataList);
    await generateQueries(entityMetadataList);
  }
};
