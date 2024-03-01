export const entityNameMap = new Map<string, string>();
export const entityKeyMap = new Map<string, string>();

const convertPascalToHypen = (value: string) => {
  const firstCharacter = value.slice(0, 1).toLowerCase();
  const restString = value
    .slice(1)
    .replace(/[A-Z]/g, (character: string) => `_${character.toLowerCase()}`);
  return `${firstCharacter}${restString}`;
};

export const convertResourceName = (name: string) => convertPascalToHypen(name);

export const KeyColumn =
  (entityName: string) => (object: unknown, propertyName: string) => {
    entityNameMap.set(convertResourceName(entityName), entityName);
    entityKeyMap.set(entityName, propertyName);
  };
