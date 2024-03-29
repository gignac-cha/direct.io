import ts, { factory } from 'typescript';

[
  factory.createInterfaceDeclaration(
    [factory.createToken(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier('User'),
    undefined,
    undefined,
    [
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('uuid'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('name'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('email'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('createdAt'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('updatedAt'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
    ],
  ),
  factory.createTypeAliasDeclaration(
    [factory.createToken(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier('NewUser'),
    undefined,
    factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
      factory.createTypeReferenceNode(factory.createIdentifier('User'), undefined),
    ]),
  ),
  factory.createInterfaceDeclaration(
    [factory.createToken(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier('Post'),
    undefined,
    undefined,
    [
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('uuid'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('title'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('content'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('createdBy'),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('User'), undefined),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('createdAt'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('updatedAt'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
    ],
  ),
  factory.createTypeAliasDeclaration(
    [factory.createToken(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier('NewPost'),
    undefined,
    factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
      factory.createTypeReferenceNode(factory.createIdentifier('Post'), undefined),
    ]),
  ),
];
