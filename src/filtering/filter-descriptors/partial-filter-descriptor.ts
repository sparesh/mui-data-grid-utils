import { FilterDescriptor } from "./filter-descriptor";

export interface PartialFilterDescriptor<T extends FilterDescriptor> extends FilterDescriptor {
  filterGroupId: string;
  name: string;
  description: string;
  filter: T;
}
