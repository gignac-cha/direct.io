declare interface InterfaceProperty {
  name: string;
  type: ValueType | (() => string);
}

declare interface Interface {
  name: string;
  properties: InterfaceProperty[];
}
