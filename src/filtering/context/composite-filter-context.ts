import React from "react";

import { v4 as UUIDv4 } from "uuid";

import { PartialFilterDescriptor } from "../filter-descriptors/partial-filter-descriptor";
import { CompositeFilterDescriptor } from "./../filter-descriptors/composite-filter-descriptor";

export interface DataSource {
  get<T>(key: string): T;
  set<T>(key: string, data: T): void;
  delete(key: string): void;
}

class LocalStorageDataSource implements DataSource {
  get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key)!);
  }

  set<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  delete(key: string): void {
    localStorage.removeItem(key);
  }
}

interface EntityHolder<T> {
  id: string;
  entity: T;
}

export interface CompositeFilterAdapter {
  save(
    filter: PartialFilterDescriptor<CompositeFilterDescriptor>,
    dataSource: DataSource
  ): string;

  load(
    filterGroupId: string,
    filterId: string | undefined,
    dataSource: DataSource
  ):
    | PartialFilterDescriptor<CompositeFilterDescriptor>
    | PartialFilterDescriptor<CompositeFilterDescriptor>[];

  delete(filterGroupId: string, filterId: string, dataSource: DataSource): void;
}

class ManageCompositeFilterAdapter implements CompositeFilterAdapter {
  save(
    filter: PartialFilterDescriptor<CompositeFilterDescriptor>,
    dataSource: DataSource
  ): string {
    const entity: EntityHolder<PartialFilterDescriptor<CompositeFilterDescriptor>> = {
      id: UUIDv4(),
      entity: filter,
    };

    const filterGroup =
      dataSource.get<EntityHolder<PartialFilterDescriptor<CompositeFilterDescriptor>>[]>(
        filter.filterGroupId
      ) || [];

    filterGroup.push(entity);

    dataSource.set(filter.filterGroupId, filterGroup);

    return entity.id;
  }

  load(
    filterGroupId: string,
    filterId: string | undefined,
    dataSource: DataSource
  ):
    | PartialFilterDescriptor<CompositeFilterDescriptor>
    | PartialFilterDescriptor<CompositeFilterDescriptor>[] {
    const filterGroup =
      dataSource.get<EntityHolder<PartialFilterDescriptor<CompositeFilterDescriptor>>[]>(
        filterGroupId
      ) || [];

    if (filterId) {
      return filterGroup.find((filter) => filter.id == filterId)!.entity;
    } else {
      return filterGroup.map((filter) => filter.entity);
    }
  }

  delete(filterGroupId: string, filterId: string, dataSource: DataSource): void {
    const filterGroup =
      dataSource.get<EntityHolder<PartialFilterDescriptor<CompositeFilterDescriptor>>[]>(
        filterGroupId
      ) || [];

    const indexToBeRemoved = filterGroup.findIndex((filter) => filter.id == filterId);

    if (indexToBeRemoved >= 0 && filterGroup.length === 1) {
      dataSource.delete(filterGroupId);
    } else {
      filterGroup.splice(indexToBeRemoved);

      dataSource.set(filterGroupId, filterGroup);
    }
  }
}

class CompositeFilterContextValueProvider {
  constructor(
    private _dataSource: DataSource,
    private _compositeFilterAdapter: CompositeFilterAdapter
  ) {}

  setDataSource(dataSource: DataSource) {
    this._dataSource = dataSource;
  }

  saveFilter(filterInfo: PartialFilterDescriptor<CompositeFilterDescriptor>) {
    return this._compositeFilterAdapter.save(filterInfo, this._dataSource);
  }

  loadFilter(filterGroupId: string, filterId: string) {
    return this._compositeFilterAdapter.load(filterGroupId, filterId, this._dataSource);
  }

  loadFilterGroup(filterGroupId: string) {
    return this._compositeFilterAdapter.load(filterGroupId, undefined, this._dataSource);
  }
}

export const createContextValue = () =>
  new CompositeFilterContextValueProvider(
    new LocalStorageDataSource(),
    new ManageCompositeFilterAdapter()
  );

export const CompositeFilterContext = React.createContext(createContextValue());

export const useCompositeFilterContext = () => React.useContext(CompositeFilterContext);
