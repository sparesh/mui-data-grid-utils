import { SortingDescriptor } from "./sorting-descriptor";
import { MemberSortingDescriptor } from "./member-sorting-descriptor";

export interface CompositeSortingDescriptor extends SortingDescriptor, Array<MemberSortingDescriptor> {
  [i: number]: MemberSortingDescriptor;
}
