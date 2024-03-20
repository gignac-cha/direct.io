import { factory } from 'typescript';

const importNames = [
  'useSuspenseQuery',
  'useQuery',
  'useMutation',
  'useQueryClient',
];

const importFrom = '@tanstack/react-query';

export const createImports = () =>
  factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        importNames.map((name) =>
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier(name),
          ),
        ),
      ),
    ),
    factory.createStringLiteral(importFrom),
    undefined,
  );
