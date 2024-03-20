import ts, { factory } from 'typescript';
import { convertTypeStringToSyntaxKind } from './convert';

const createInterface = ({ interface_ }: { interface_: Interface }) =>
  factory.createInterfaceDeclaration(
    [factory.createToken(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier(interface_.name),
    undefined,
    undefined,
    interface_.properties.map(({ name, type }) =>
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier(name),
        undefined,
        typeof type === 'function'
          ? factory.createTypeReferenceNode(
              factory.createIdentifier(type()),
              undefined,
            )
          : factory.createKeywordTypeNode(convertTypeStringToSyntaxKind(type)),
      ),
    ),
  );
const createType = ({ interface_ }: { interface_: Interface }) =>
  factory.createTypeAliasDeclaration(
    [factory.createToken(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier(`New${interface_.name}`),
    undefined,
    factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
      factory.createTypeReferenceNode(
        factory.createIdentifier(interface_.name),
        undefined,
      ),
    ]),
  );

export const createInterfaces = ({ interfaces }: { interfaces: Interface[] }) =>
  interfaces
    .map((interface_) => [
      createInterface({ interface_ }),
      createType({ interface_ }),
    ])
    .flat(20);
