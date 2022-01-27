import { FilterDescriptor } from "./filter-descriptor";
import { MemberFilterOperator } from "../enums/member-filter-operator";
import { Member, MemberValue } from "../../common/member";

export interface MemberFilterDescriptor extends FilterDescriptor {
  member: Member;
  operator: MemberFilterOperator;
  value: MemberValue;
}
