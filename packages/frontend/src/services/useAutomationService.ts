import type { MaybeRef } from 'vue';

import { useHttp } from '@/composables/useHttp';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import type {
  ActionType,
  Automation,
  AutomationFieldSchema,
  AutomationHandlerMetadata,
  AutomationStepType,
  AutomationValidationResponse,
  CreateAutomationDto,
  TriggerType,
} from '@tillywork/shared';

export type GetAllParams = {
  workspaceId: MaybeRef<number>;
  listId?: MaybeRef<number | undefined>;
  spaceId?: MaybeRef<number | undefined>;
};

interface GetHandlerFieldsParams {
  automationId: MaybeRef<string>;
  handler: MaybeRef<ActionType | TriggerType>;
  data?: MaybeRef<Record<string, any>>;
  enabled?: MaybeRef<boolean>;
}

interface ValidateAutomationStepParams {
  type: MaybeRef<AutomationStepType>;
  value?: MaybeRef<ActionType | TriggerType | undefined>;
  data: MaybeRef<any>;
  automationId: MaybeRef<string>;
}

export const useAutomationService = () => {
  const { sendRequest } = useHttp();
  const queryClient = useQueryClient();

  function getAutomations({
    workspaceId,
    listId,
    spaceId,
  }: GetAllParams): Promise<Automation[]> {
    return sendRequest(`/automations`, {
      params: {
        workspaceId: toValue(workspaceId),
        listId: toValue(listId),
        spaceId: toValue(spaceId),
      },
    });
  }

  function useGetAutomations({ workspaceId, listId, spaceId }: GetAllParams) {
    return useQuery({
      queryKey: [
        'automations',
        {
          workspaceId,
          listId,
          spaceId,
        },
      ],
      queryFn: () => getAutomations({ workspaceId, listId, spaceId }),
    });
  }

  function getAutomation(id: MaybeRef<string>): Promise<Automation> {
    return sendRequest(`/automations/${toValue(id)}`);
  }

  function useGetAutomation(id: MaybeRef<string>) {
    return useQuery({
      queryKey: [
        'automations',
        {
          id,
        },
      ],
      queryFn: () => getAutomation(id),
    });
  }

  function createAutomation(dto: CreateAutomationDto): Promise<Automation> {
    return sendRequest(`/automations`, {
      method: 'POST',
      data: dto,
    });
  }

  function useCreateAutomation() {
    return useMutation({
      mutationFn: createAutomation,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['automations'],
        });
      },
    });
  }

  function updateAutomation(
    automation: Partial<Automation>
  ): Promise<Automation> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sendRequest(`/automations/${automation.id!}`, {
      method: 'PUT',
      data: automation,
    });
  }

  function useUpdateAutomation() {
    return useMutation({
      mutationFn: updateAutomation,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['automations'],
        });
      },
    });
  }

  function deleteAutomation(id: MaybeRef<string>) {
    return sendRequest(`/automations/${toValue(id)}`, {
      method: 'DELETE',
    });
  }

  function useDeleteAutomation() {
    return useMutation({
      mutationFn: deleteAutomation,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['automations'],
        });
      },
    });
  }

  function duplicateAutomation(id: MaybeRef<string>) {
    return sendRequest(`/automations/${toValue(id)}/duplicate`, {
      method: 'POST',
    });
  }

  function useDuplicateAutomation() {
    return useMutation({
      mutationFn: duplicateAutomation,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['automations'],
        });
      },
    });
  }

  function getTriggers(): Promise<AutomationHandlerMetadata[]> {
    return sendRequest('/automations/handlers/triggers');
  }

  function useGetTriggers() {
    return useQuery({
      queryKey: ['triggers'],
      queryFn: getTriggers,
      staleTime: 1000 * 60 * 10,
    });
  }

  function getActions(): Promise<AutomationHandlerMetadata[]> {
    return sendRequest('/automations/handlers/actions');
  }

  function useGetActions() {
    return useQuery({
      queryKey: ['actions'],
      queryFn: getActions,
      staleTime: 1000 * 60 * 10,
    });
  }

  function getHandlerFields({
    automationId,
    handler,
    data,
  }: GetHandlerFieldsParams): Promise<AutomationFieldSchema[]> {
    return sendRequest(`/automations/handlers/fields`, {
      method: 'POST',
      data: {
        automationId: toValue(automationId),
        type: toValue(handler),
        data: toValue(data),
      },
    });
  }

  function useGetHandlerFields({
    automationId,
    handler,
    data,
    enabled,
  }: GetHandlerFieldsParams) {
    return useQuery({
      queryKey: ['handlerFields', automationId, handler],
      queryFn: () => getHandlerFields({ automationId, handler, data }),
      enabled,
    });
  }

  function getHandlerSampleData({
    automationId,
    handler,
    data,
  }: GetHandlerFieldsParams): Promise<Record<string, any>> {
    return sendRequest(`/automations/handlers/sample-data`, {
      method: 'POST',
      data: {
        automationId: toValue(automationId),
        type: toValue(handler),
        data: toValue(data),
      },
    });
  }

  function validateAutomation(id: MaybeRef<string>): Promise<boolean> {
    return sendRequest(`/automations/validation/${toValue(id)}`);
  }

  function useValidateAutomation(id: MaybeRef<string>) {
    return useQuery({
      queryKey: ['automationValidation', id],
      queryFn: () => validateAutomation(id),
    });
  }

  function validateStep({
    type,
    value,
    data,
    automationId,
  }: ValidateAutomationStepParams): Promise<AutomationValidationResponse> {
    return sendRequest('/automations/validation/step', {
      method: 'POST',
      data: {
        value: toValue(value),
        type: toValue(type),
        data: toValue(data),
        automationId: toValue(automationId),
      },
    });
  }

  function useValidateStep({
    type,
    value,
    data,
    automationId,
  }: ValidateAutomationStepParams) {
    return useQuery({
      queryKey: ['stepValidation', type, data, value, automationId],
      queryFn: () => validateStep({ type, data, value, automationId }),
    });
  }

  return {
    useGetAutomations,
    useGetAutomation,
    useCreateAutomation,
    useUpdateAutomation,
    useDeleteAutomation,
    useDuplicateAutomation,
    useGetActions,
    useGetTriggers,
    useGetHandlerFields,
    getHandlerSampleData,
    useValidateAutomation,
    useValidateStep,
  };
};
