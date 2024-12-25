import type { Field, ListGroupOptions } from '@tillywork/shared';

export enum ViewTypes {
  TABLE = 'table',
  BOARD = 'board',
  CALENDAR = 'calendar',
  GANTT = 'gantt',
  LIST = 'list',
}

export interface ListGroupOption {
  label: string;
  value: ListGroupOptions;
  field?: Field;
}

export type SortDirection = 'ASC' | 'DESC';

export interface ListSortOption {
  label: string;
  value: TableSortOption;
  icon: string;
}

export const DEFAULT_SORT_OPTIONS: ListSortOption[] = [
  {
    label: 'Creation Date',
    icon: 'mdi-clock-edit',
    value: {
      key: 'card.createdAt',
      order: 'ASC',
    },
  },
  {
    label: 'Completed',
    icon: 'mdi-list-status',
    value: {
      key: 'listStage.isCompleted',
      order: 'ASC',
    },
  },
];

export interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
  sort?: TableSortState;
}

export interface TableSortOption {
  key: string;
  order: string;
}

export type TableSortState = TableSortOption[];

export const DEFAULT_PAGINATION_OPTIONS: PaginationParams = {
  sort: [
    {
      key: 'createdAt',
      order: 'ASC',
    },
  ],
  page: 1,
  itemsPerPage: 5,
};
