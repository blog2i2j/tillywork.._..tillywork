<script setup lang="ts">
import { useUsersService } from '@/services/useUsersService';

import { type Field, FieldTypes, type User } from '@tillywork/shared';

import BaseCardChip from '../BaseCardChip.vue';

const { field, item, users } = defineProps<{
  field: Field;
  item: string;
  users: User[];
}>();

const { getUserFullName } = useUsersService();

const fieldItem = computed(() =>
  field.items?.find((fieldItem) => fieldItem.item === item)
);
const user = computed(() => users.find((user) => user.id === +item));
</script>

<template>
  <template v-if="[FieldTypes.LABEL, FieldTypes.DROPDOWN].includes(field.type)">
    <v-chip :color="fieldItem?.color" density="compact" class="text-caption">{{
      item
    }}</v-chip>
  </template>
  <template v-else-if="field.type === FieldTypes.USER && !!user">
    <div class="d-inline-flex align-center ga-1">
      <base-avatar :photo="user.photo" :text="getUserFullName(user)" />
      <span>{{ getUserFullName(user) }}</span>
    </div>
  </template>
  <template v-else-if="field.type === FieldTypes.CARD">
    <base-card-chip :card="{ id: +item }" density="compact" height="24" />
  </template>
</template>
