import ts, {
  BindingElement,
  ExpressionStatement,
  PropertySignature,
  TemplateExpression,
  factory,
} from 'typescript';
import {
  convertMutationTypeName,
  convertMutationTypeToFetchMethod,
  convertPascalToHypen,
  convertTypeStringToSyntaxKind,
} from './convert';

const createMutation = ({
  mutationType,
  entityName,
  keyColumn,
}: {
  mutationType: MutationType;
  entityName: string;
  keyColumn?: KeyColumn;
}) => {
  const resourceName = convertPascalToHypen(entityName);

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(
            `use${entityName}${convertMutationTypeName(mutationType)}Mutation`,
          ),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createObjectBindingPattern(
                  [
                    mutationType === 'remove'
                      ? undefined
                      : factory.createBindingElement(
                          undefined,
                          undefined,
                          factory.createIdentifier(resourceName),
                          undefined,
                        ),
                    keyColumn
                      ? factory.createBindingElement(
                          undefined,
                          undefined,
                          factory.createIdentifier(keyColumn.name),
                          undefined,
                        )
                      : undefined,
                  ].filter((value): value is BindingElement => !!value),
                ),
                undefined,
                factory.createTypeLiteralNode(
                  [
                    mutationType === 'remove'
                      ? undefined
                      : factory.createPropertySignature(
                          undefined,
                          factory.createIdentifier(resourceName),
                          undefined,
                          factory.createTypeReferenceNode(
                            factory.createIdentifier(`New${entityName}`),
                            undefined,
                          ),
                        ),
                    keyColumn
                      ? factory.createPropertySignature(
                          undefined,
                          factory.createIdentifier(keyColumn.name),
                          undefined,
                          factory.createKeywordTypeNode(
                            convertTypeStringToSyntaxKind(keyColumn.type),
                          ),
                        )
                      : undefined,
                  ].filter((value): value is PropertySignature => !!value),
                ),
                undefined,
              ),
            ],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createVariableStatement(
                  undefined,
                  factory.createVariableDeclarationList(
                    [
                      factory.createVariableDeclaration(
                        factory.createIdentifier('queryClient'),
                        undefined,
                        undefined,
                        factory.createCallExpression(
                          factory.createIdentifier('useQueryClient'),
                          undefined,
                          [],
                        ),
                      ),
                    ],
                    ts.NodeFlags.Const,
                  ),
                ),
                factory.createReturnStatement(
                  factory.createCallExpression(
                    factory.createIdentifier('useMutation'),
                    undefined,
                    [
                      factory.createObjectLiteralExpression(
                        [
                          factory.createPropertyAssignment(
                            factory.createIdentifier('mutationKey'),
                            factory.createArrayLiteralExpression(
                              [
                                factory.createStringLiteral(resourceName),
                                factory.createStringLiteral(mutationType),
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
                            factory.createIdentifier('mutationFn'),
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
                                  factory.createIdentifier(
                                    convertMutationTypeToFetchMethod(
                                      mutationType,
                                    ),
                                  ),
                                ),
                                [
                                  factory.createTypeReferenceNode(
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
                                            factory.createIdentifier(
                                              keyColumn.name,
                                            ),
                                            factory.createTemplateTail('', ''),
                                          ),
                                        ],
                                      )
                                    : factory.createNoSubstitutionTemplateLiteral(
                                        `https://api.example.com/${resourceName}`,
                                        `https://api.example.com/${resourceName}`,
                                      ),
                                  mutationType === 'remove'
                                    ? undefined
                                    : factory.createObjectLiteralExpression(
                                        [
                                          factory.createShorthandPropertyAssignment(
                                            factory.createIdentifier(
                                              resourceName,
                                            ),
                                            undefined,
                                          ),
                                        ],
                                        false,
                                      ),
                                ].filter(
                                  (value): value is TemplateExpression =>
                                    !!value,
                                ),
                              ),
                            ),
                          ),
                          factory.createPropertyAssignment(
                            factory.createIdentifier('onSuccess'),
                            factory.createArrowFunction(
                              undefined,
                              undefined,
                              [],
                              undefined,
                              factory.createToken(
                                ts.SyntaxKind.EqualsGreaterThanToken,
                              ),
                              factory.createBlock(
                                [
                                  factory.createExpressionStatement(
                                    factory.createCallExpression(
                                      factory.createPropertyAccessExpression(
                                        factory.createIdentifier('queryClient'),
                                        factory.createIdentifier(
                                          'invalidateQueries',
                                        ),
                                      ),
                                      undefined,
                                      [
                                        factory.createObjectLiteralExpression(
                                          [
                                            factory.createPropertyAssignment(
                                              factory.createIdentifier(
                                                'queryKey',
                                              ),
                                              factory.createArrayLiteralExpression(
                                                [
                                                  factory.createStringLiteral(
                                                    resourceName,
                                                  ),
                                                  factory.createStringLiteral(
                                                    'list',
                                                  ),
                                                ],
                                                false,
                                              ),
                                            ),
                                          ],
                                          false,
                                        ),
                                      ],
                                    ),
                                  ),
                                  keyColumn
                                    ? factory.createExpressionStatement(
                                        factory.createCallExpression(
                                          factory.createPropertyAccessExpression(
                                            factory.createIdentifier(
                                              'queryClient',
                                            ),
                                            factory.createIdentifier(
                                              'invalidateQueries',
                                            ),
                                          ),
                                          undefined,
                                          [
                                            factory.createObjectLiteralExpression(
                                              [
                                                factory.createPropertyAssignment(
                                                  factory.createIdentifier(
                                                    'queryKey',
                                                  ),
                                                  factory.createArrayLiteralExpression(
                                                    [
                                                      factory.createStringLiteral(
                                                        resourceName,
                                                      ),
                                                      factory.createStringLiteral(
                                                        'get',
                                                      ),
                                                      factory.createIdentifier(
                                                        keyColumn.name,
                                                      ),
                                                    ],
                                                    false,
                                                  ),
                                                ),
                                              ],
                                              false,
                                            ),
                                          ],
                                        ),
                                      )
                                    : undefined,
                                ].filter(
                                  (value): value is ExpressionStatement =>
                                    !!value,
                                ),
                                true,
                              ),
                            ),
                          ),
                        ],
                        true,
                      ),
                    ],
                  ),
                ),
              ],
              true,
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
};

export const createMutations = ({
  entityName,
  keyColumn,
}: {
  entityName: string;
  keyColumn: KeyColumn;
}) => [
  createMutation({ mutationType: 'add', entityName }),
  createMutation({ mutationType: 'edit', entityName, keyColumn }),
  createMutation({ mutationType: 'remove', entityName, keyColumn }),
];
