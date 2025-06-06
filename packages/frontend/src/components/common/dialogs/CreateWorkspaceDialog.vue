<script setup lang="ts">
import { useWorkspacesService } from '@/services/useWorkspacesService';
import { useSnackbarStore } from '@/stores/snackbar';
import CreateWorkspaceForm from '@/components/common/workspaces/CreateWorkspaceForm.vue';
import { useDialogStore } from '@/stores/dialog';
import { DIALOGS } from './types';
import { useAuthStore } from '@/stores/auth';
import { useStateStore } from '@/stores/state';
import type { Workspace } from '@tillywork/shared';

const workspacesService = useWorkspacesService();
const dialog = useDialogStore();
const { showSnackbar } = useSnackbarStore();
const { setWorkspace } = useAuthStore();
const { setSelectedModule } = useStateStore();

const currentDialogIndex = computed(() =>
  dialog.getDialogIndex(DIALOGS.CREATE_WORKSPACE)
);
const currentDialog = computed(() => dialog.dialogs[currentDialogIndex.value]);

const { mutateAsync: createWorkspace, isPending } =
  workspacesService.useCreateWorkspaceMutation();

async function handleCreate(workspaceDto: Partial<Workspace>) {
  createWorkspace(workspaceDto)
    .then((createdWorkspace) => {
      dialog.closeDialog(currentDialogIndex.value);
      setWorkspace(createdWorkspace);
      setSelectedModule(createdWorkspace.type);
    })
    .catch(() => {
      showSnackbar({
        message: 'Something went wrong, please try again.',
        color: 'error',
        timeout: 5000,
      });
    });
}
</script>

<template>
  <v-card color="dialog" elevation="12" border="thin" :loading="isPending">
    <div class="d-flex align-center ps-0 pa-4">
      <v-card-subtitle class="text-h6">Create workspace</v-card-subtitle>
      <v-spacer />
      <base-icon-btn
        icon="mdi-close"
        color="default"
        @click="dialog.closeDialog(currentDialogIndex)"
      />
    </div>
    <create-workspace-form
      @submit="handleCreate"
      :loading="isPending"
      card-class="mt-16"
      :data="currentDialog.data"
    />
  </v-card>
</template>
