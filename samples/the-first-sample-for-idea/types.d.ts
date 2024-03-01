declare type Entities = NonNullable<
  import('typeorm/data-source/BaseDataSourceOptions').BaseDataSourceOptions['entities']
>;
declare type Entity = Entities extends import('typeorm').MixedList<infer T>
  ? T
  : never;
