import ts, { factory } from 'typescript';
import { convertMutationTypeName } from './convert';

const createSuspenseQueriesExport = ({
  entityNames,
}: {
  entityNames: string[];
}) =>
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('suspenseQueries'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(
            entityNames
              .map((entityName) => [
                factory.createPropertyAssignment(
                  factory.createIdentifier(`use${entityName}ListQuery`),
                  factory.createIdentifier(`use${entityName}ListSuspenseQuery`),
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier(`use${entityName}Query`),
                  factory.createIdentifier(`use${entityName}SuspenseQuery`),
                ),
              ])
              .flat(20),
            true,
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );

const createQueriesExport = ({ entityNames }: { entityNames: string[] }) =>
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('queries'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(
            entityNames
              .map((entityName) => [
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(`use${entityName}ListQuery`),
                  undefined,
                ),
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(`use${entityName}Query`),
                  undefined,
                ),
              ])
              .flat(20),
            true,
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );

const createMutationsExport = ({ entityNames }: { entityNames: string[] }) =>
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('mutations'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(
            entityNames
              .map((entityName) => [
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(
                    `use${entityName}${convertMutationTypeName('add')}Mutation`,
                  ),
                  undefined,
                ),
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(
                    `use${entityName}${convertMutationTypeName('edit')}Mutation`,
                  ),
                  undefined,
                ),
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(
                    `use${entityName}${convertMutationTypeName('remove')}Mutation`,
                  ),
                  undefined,
                ),
              ])
              .flat(20),
            true,
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );

export const createExports = ({ entityNames }: { entityNames: string[] }) => [
  createSuspenseQueriesExport({ entityNames }),
  createQueriesExport({ entityNames }),
  createMutationsExport({ entityNames }),
];
