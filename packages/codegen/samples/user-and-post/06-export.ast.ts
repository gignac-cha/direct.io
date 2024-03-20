import ts, { factory } from 'typescript';

[
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('suspenseQueries'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier('usePostListQuery'),
                factory.createIdentifier('usePostListSuspenseQuery'),
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier('usePostQuery'),
                factory.createIdentifier('usePostSuspenseQuery'),
              ),
            ],
            true,
          ),
        ),
      ],
      ts.NodeFlags.Const | ts.NodeFlags.Constant | ts.NodeFlags.Constant,
    ),
  ),
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('queries'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(
            [
              factory.createShorthandPropertyAssignment(factory.createIdentifier('usePostListQuery'), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier('usePostQuery'), undefined),
            ],
            true,
          ),
        ),
      ],
      ts.NodeFlags.Const | ts.NodeFlags.Constant | ts.NodeFlags.Constant,
    ),
  ),
  factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('mutations'),
          undefined,
          undefined,
          factory.createObjectLiteralExpression(
            [
              factory.createShorthandPropertyAssignment(factory.createIdentifier('usePostAddMutation'), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier('usePostEditMutation'), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier('usePostRemoveMutation'), undefined),
            ],
            true,
          ),
        ),
      ],
      ts.NodeFlags.Const | ts.NodeFlags.Constant | ts.NodeFlags.Constant,
    ),
  ),
];
