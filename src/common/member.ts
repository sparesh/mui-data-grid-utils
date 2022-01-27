export type MemberValue = any;

export interface MemberType {
  typeName: string;
  defaultValue: any;
}

export interface Member {
  type: MemberType;
  name: string;
}
