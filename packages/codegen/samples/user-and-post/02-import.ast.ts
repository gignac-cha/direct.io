import { factory } from 'typescript';

[
  factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(false, undefined, factory.createIdentifier('useSuspenseQuery')),
        factory.createImportSpecifier(false, undefined, factory.createIdentifier('useQuery')),
        factory.createImportSpecifier(false, undefined, factory.createIdentifier('useMutation')),
        factory.createImportSpecifier(false, undefined, factory.createIdentifier('useQueryClient')),
      ]),
    ),
    factory.createStringLiteral('@tanstack/react-query'),
    undefined,
  ),
];
