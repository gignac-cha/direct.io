import { KeywordTypeSyntaxKind, SyntaxKind } from 'typescript';

export const convertPascalToHypen = (value: string) => {
  const firstCharacter = value.slice(0, 1).toLowerCase();
  const restString = value
    .slice(1)
    .replace(/[A-Z]/g, (character: string) => `_${character.toLowerCase()}`);
  return `${firstCharacter}${restString}`;
};

export const convertTypeStringToSyntaxKind = (
  type?: ValueType,
): KeywordTypeSyntaxKind => {
  switch (type) {
    case 'number':
      return SyntaxKind.NumberKeyword;
    case 'string':
      return SyntaxKind.StringKeyword;
    default:
      return SyntaxKind.UnknownKeyword;
  }
};

export const convertQueryTypeName = (type: QueryType) => {
  switch (type) {
    case 'list':
      return 'List';
    case 'get':
      return '';
  }
};

export const convertMutationTypeName = (type: MutationType) => {
  switch (type) {
    case 'add':
      return 'Add';
    case 'edit':
      return 'Edit';
    case 'remove':
      return 'Remove';
  }
};
export const convertMutationTypeToFetchMethod = (type: MutationType) => {
  switch (type) {
    case 'add':
      return 'post';
    case 'edit':
      return 'put';
    case 'remove':
      return 'delete';
  }
};
