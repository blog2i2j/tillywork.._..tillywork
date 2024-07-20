import type { FieldFilterOption } from './types';
import { FieldTypes } from '../../fields/types';

export const quickFilterGroupsCustomFields = ['dropdown', 'label'] as const;

export const quickFilterItemsDate: FieldFilterOption[] = [
  {
    field: 'card.dueAt',
    operator: 'isNull',
    value: [],
    title: 'No Due Date',
    type: FieldTypes.DATE,
  },
  {
    title: 'Today',
    type: FieldTypes.DATE,
    field: 'card.dueAt',
    operator: 'between',
    value: [':startOfDay', ':endOfDay'],
  },
  {
    field: 'card.dueAt',
    operator: 'between',
    value: [':startOfTime', ':startOfDay'],
    title: 'Past Due',
    type: FieldTypes.DATE,
  },
];

export type QuickFilter = Record<string, FieldFilterOption[]>;
