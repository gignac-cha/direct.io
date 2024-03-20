import ts, { factory } from 'typescript';
import {
  convertPascalToHypen,
  convertQueryTypeName,
  convertTypeStringToSyntaxKind,
} from './convert';

const createQuery = ({
  queryType,
  entityName,
  keyColumn,
  isSuspense,
}: {
  queryType: QueryType;
  entityName: string;
  keyColumn?: KeyColumn;
  isSuspense: boolean;
}) => {
  const resourceName = convertPascalToHypen(entityName);

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(
            `use${entityName}${convertQueryTypeName(queryType)}${isSuspense ? 'Suspense' : ''}Query`,
          ),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            keyColumn
              ? [
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    factory.createObjectBindingPattern([
                      factory.createBindingElement(
                        undefined,
                        undefined,
                        factory.createIdentifier(keyColumn.name),
                        undefined,
                      ),
                    ]),
                    undefined,
                    factory.createTypeLiteralNode([
                      factory.createPropertySignature(
                        undefined,
                        factory.createIdentifier(keyColumn.name),
                        undefined,
                        factory.createKeywordTypeNode(
                          convertTypeStringToSyntaxKind(keyColumn.type),
                        ),
                      ),
                    ]),
                    undefined,
                  ),
                ]
              : [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createCallExpression(
              factory.createIdentifier(
                `use${isSuspense ? 'Suspense' : ''}Query`,
              ),
              undefined,
              [
                factory.createObjectLiteralExpression(
                  [
                    factory.createPropertyAssignment(
                      factory.createIdentifier('queryKey'),
                      factory.createArrayLiteralExpression(
                        [
                          factory.createStringLiteral(resourceName),
                          factory.createStringLiteral(queryType),
                          keyColumn
                            ? factory.createIdentifier(keyColumn.name)
                            : undefined,
                        ].filter(
                          (value): value is NonNullable<typeof value> =>
                            !!value,
                        ),
                        false,
                      ),
                    ),
                    factory.createPropertyAssignment(
                      factory.createIdentifier('queryFn'),
                      factory.createArrowFunction(
                        undefined,
                        undefined,
                        [],
                        undefined,
                        factory.createToken(
                          ts.SyntaxKind.EqualsGreaterThanToken,
                        ),
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier('fetch'),
                            factory.createIdentifier('get'),
                          ),
                          [
                            queryType === 'list'
                              ? factory.createArrayTypeNode(
                                  factory.createTypeReferenceNode(
                                    factory.createIdentifier(entityName),
                                    undefined,
                                  ),
                                )
                              : factory.createTypeReferenceNode(
                                  factory.createIdentifier(entityName),
                                  undefined,
                                ),
                          ],
                          [
                            keyColumn
                              ? factory.createTemplateExpression(
                                  factory.createTemplateHead(
                                    `https://api.example.com/${resourceName}/`,
                                    `https://api.example.com/${resourceName}/`,
                                  ),
                                  [
                                    factory.createTemplateSpan(
                                      factory.createIdentifier(keyColumn.name),
                                      factory.createTemplateTail('', ''),
                                    ),
                                  ],
                                )
                              : factory.createNoSubstitutionTemplateLiteral(
                                  `https://api.example.com/${resourceName}`,
                                  `https://api.example.com/${resourceName}`,
                                ),
                          ],
                        ),
                      ),
                    ),
                  ],
                  true,
                ),
              ],
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
};

export const createQueries = ({
  entityName,
  keyColumn,
}: {
  entityName: string;
  keyColumn: KeyColumn;
}) => [
  createQuery({ queryType: 'list', entityName, isSuspense: true }),
  createQuery({
    queryType: 'get',
    entityName,
    keyColumn,
    isSuspense: true,
  }),
  createQuery({ queryType: 'list', entityName, isSuspense: false }),
  createQuery({
    queryType: 'get',
    entityName,
    keyColumn,
    isSuspense: false,
  }),
];
