<script setup lang="ts">
import { useListsService } from '@/services/useListsService';
import { useSnackbarStore } from '@/stores/snackbar';
import { useQueryClient } from '@tanstack/vue-query';
import { DIALOGS, UpsertDialogMode } from '@/components/common/dialogs/types';
import { useDialogStore } from '@/stores/dialog';
import { useAuthStore } from '@/stores/auth';
import type { CardType, List } from '@tillywork/shared';

const listMenu = ref(false);
const { useDeleteListMutation, useUpdateListMutation } = useListsService();
const { showSnackbar } = useSnackbarStore();
const queryClient = useQueryClient();
const dialog = useDialogStore();
const { workspace } = storeToRefs(useAuthStore());

const deleteListMutation = useDeleteListMutation();
const { mutateAsync: updateList } = useUpdateListMutation();

const props = defineProps<{
  list: List;
}>();
const emit = defineEmits(['hover:freeze', 'hover:unfreeze']);

const confirmDialogIndex = computed(() =>
  dialog.getDialogIndex(DIALOGS.CONFIRM)
);

function handleListMenuClick() {
  listMenu.value = !listMenu.value;
  emit('hover:freeze');
}

function closeListMenu() {
  listMenu.value = false;
}

function handleDeleteList(list: List) {
  dialog.openDialog({
    dialog: DIALOGS.CONFIRM,
    data: {
      title: 'Confirm',
      message: 'Are you sure you want to delete this list?',
      onCancel: () => dialog.closeDialog(confirmDialogIndex.value),
      onConfirm: () => deleteList(list),
      isLoading: deleteListMutation.isPending.value,
    },
  });
}

function deleteList(list: List) {
  deleteListMutation
    .mutateAsync(list.id)
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      queryClient.invalidateQueries({ queryKey: ['list', list.id] });
      dialog.closeDialog(confirmDialogIndex.value);
    })
    .catch(() => {
      showSnackbar({
        message: 'Something went wrong, please try again.',
        color: 'error',
        timeout: 3000,
      });
    });
}

function isCardTypeSetAsListDefault(cardType: CardType) {
  return cardType.id === props.list.defaultCardType.id;
}

function handleUpdateDefaultCardType(cardType: CardType) {
  if (!isCardTypeSetAsListDefault(cardType)) {
    updateList({
      id: props.list.id,
      updateDto: {
        defaultCardType: cardType,
      },
    })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: [
            'spaces',
            {
              workspaceId: workspace.value?.id,
            },
          ],
        });
      })
      .catch(() => {
        showSnackbar({
          message: 'Something went wrong, please try again.',
          color: 'error',
        });
      });
  }
}

function openEditStagesDialog(list: List) {
  listMenu.value = false;
  dialog.openDialog({
    dialog: DIALOGS.EDIT_LIST_STAGES,
    data: {
      list,
    },
  });
}

function openUpdateListDialog(list: List) {
  dialog.openDialog({
    dialog: DIALOGS.UPSERT_LIST,
    data: {
      list,
      mode: UpsertDialogMode.UPDATE,
    },
  });
  closeListMenu();
}

watch(listMenu, (v) => {
  if (!v) {
    emit('hover:unfreeze');
  }
});
</script>

<template>
  <base-icon-btn
    id="list-menu-btn"
    icon="mdi-dots-vertical"
    @click.stop="handleListMenuClick"
    density="compact"
  />

  <v-menu
    v-model="listMenu"
    target="#list-menu-btn"
    :close-on-content-click="false"
    width="220"
  >
    <v-card :loading="deleteListMutation.isPending.value">
      <v-list>
        <v-list-item @click="openUpdateListDialog(list)">
          <template #prepend>
            <v-icon icon="mdi-playlist-edit" />
          </template>
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
        <v-list-item to="/settings/custom-fields" @click="closeListMenu">
          <template #prepend>
            <v-icon icon="mdi-form-select" />
          </template>
          <v-list-item-title>Custom fields</v-list-item-title>
        </v-list-item>
        <v-menu location="end" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon icon="mdi-toy-brick-outline" />
              </template>
              <v-list-item-title>Default card type</v-list-item-title>
              <template #append>
                <v-icon icon="mdi-chevron-right" />
              </template>
            </v-list-item>
          </template>
          <v-card>
            <v-card-title class="d-flex align-center pt-2 pe-1">
              <span class="text-body-3">Card Types</span>
              <v-spacer />
              <v-btn
                size="small"
                variant="text"
                class="text-capitalize"
                to="/settings/card-types"
                @click="closeListMenu"
              >
                Edit
              </v-btn>
            </v-card-title>
            <v-list min-height="200">
              <template
                v-for="cardType in workspace?.cardTypes"
                :key="cardType.id"
              >
                <v-list-item
                  :active="isCardTypeSetAsListDefault(cardType)"
                  @click="handleUpdateDefaultCardType(cardType)"
                >
                  <v-list-item-title>{{ cardType.name }}</v-list-item-title>
                  <template #append>
                    <v-icon
                      size="x-small"
                      icon="mdi-check"
                      v-if="isCardTypeSetAsListDefault(cardType)"
                    />
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-menu>
        <v-list-item @click="openEditStagesDialog(list)">
          <template #prepend>
            <v-icon icon="mdi-text-box-edit" />
          </template>
          <v-list-item-title>Edit stages</v-list-item-title>
        </v-list-item>
        <v-list-item class="text-error" @click="handleDeleteList(list)">
          <template #prepend>
            <v-icon icon="mdi-delete" />
          </template>
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
