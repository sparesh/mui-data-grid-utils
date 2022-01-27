import { FilterDescriptor } from "./filter-descriptor";
import { CompositeFilterOperator } from "../enums/composite-filter-operator";

export interface CompositeFilterDescriptor extends FilterDescriptor {
  operator: CompositeFilterOperator;
  filters: FilterDescriptor[];
}
