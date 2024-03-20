declare interface KeyColumn {
  type: ValueType;
  name: string;
}
declare type ValueType = 'number' | 'string';

declare interface FakeEntity {
  entityName: string;
  keyColumn: KeyColumn;
}
