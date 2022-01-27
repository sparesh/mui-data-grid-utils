import { Member } from "../../common/member";
import { MemberSortingDirection } from "../enums/member-sorting-direction";
import { SortingDescriptor } from "./sorting-descriptor";

export interface MemberSortingDescriptor extends SortingDescriptor {
  direction: MemberSortingDirection;
  member: Member;
}
