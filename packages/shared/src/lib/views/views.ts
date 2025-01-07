import { SortOption } from '../common';
import { Field } from '../fields';
import { Filter } from '../filters';
import { List, ListGroupOptions } from '../lists';

export interface View {
  id: number;
  name: string;
  type: ViewTypes;
  listId: number;
  list: List;
  options: ViewOptions;
  updatedAt: string;
  filters?: Filter;
}

export enum ViewTypes {
  TABLE = 'table',
  BOARD = 'board',
  CALENDAR = 'calendar',
  GANTT = 'gantt',
  LIST = 'list',
}

export type ViewOptions = {
  groupBy: ViewGroupByOption;
  sortBy?: SortOption;
  hideCompleted?: boolean;
  hideChildren?: boolean;
  columns?: string[];
};

export type ViewGroupByOption = {
  type: ListGroupOptions;
  fieldId?: number;
};

export interface ViewSortOption {
  label: string;
  value: SortOption;
  icon: string;
}

export interface ViewGroupOption {
  label: string;
  value: ListGroupOptions;
  field?: Field;
}
