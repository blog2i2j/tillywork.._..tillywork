import { useHttp } from '@/composables/useHttp';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { CreateFieldDto, Field } from '@tillywork/shared';
import type { MaybeRef } from 'vue';

export type GetFieldsParams = {
  workspaceId?: MaybeRef<number>;
  listId?: MaybeRef<number>;
  cardTypeId?: MaybeRef<number>;
  createdByType?: MaybeRef<'system' | 'user'>;
};

export const useFieldsService = () => {
  const { sendRequest } = useHttp();
  const queryClient = useQueryClient();

  async function getField({ id }: { id: MaybeRef<number> }): Promise<Field> {
    return sendRequest(`/fields/${toValue(id)}`);
  }

  function useFieldQuery({
    id,
    enabled,
  }: {
    id: MaybeRef<number>;
    enabled: MaybeRef<boolean>;
  }) {
    return useQuery({
      queryKey: ['fields', id],
      queryFn: () => getField({ id }),
      staleTime: 1000 * 60 * 1,
      enabled,
    });
  }

  async function getFields({
    workspaceId,
    listId,
    cardTypeId,
    createdByType,
  }: GetFieldsParams): Promise<Field[]> {
    return sendRequest('/fields', {
      method: 'GET',
      params: {
        workspaceId: toValue(workspaceId),
        listId: toValue(listId),
        cardTypeId: toValue(cardTypeId),
        createdByType: toValue(createdByType),
      },
    });
  }

  function useFieldsQuery(
    params: GetFieldsParams & { enabled?: MaybeRef<boolean> }
  ) {
    return useQuery({
      queryKey: [
        'fields',
        {
          workspaceId: params.workspaceId,
          listId: params.listId,
          cardTypeId: params.cardTypeId,
          createdByType: params.createdByType,
        },
      ],
      queryFn: () => getFields(params),
      staleTime: 1000 * 60 * 1,
      enabled: params.enabled,
    });
  }

  function updateField(field: Partial<Field>) {
    return sendRequest(`/fields/${field.id}`, {
      method: 'PUT',
      data: field,
    });
  }

  function updateFieldMutation() {
    return useMutation({
      mutationFn: updateField,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fields'] }),
    });
  }

  function createField(fieldDto: CreateFieldDto) {
    return sendRequest('/fields', {
      method: 'POST',
      data: fieldDto,
    });
  }

  function createFieldMutation() {
    return useMutation({
      mutationFn: createField,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fields'] }),
    });
  }

  function deleteField(fieldId: number) {
    return sendRequest(`/fields/${fieldId}`, {
      method: 'DELETE',
    });
  }

  function deleteFieldMutation() {
    return useMutation({
      mutationFn: deleteField,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fields'] });
      },
    });
  }

  return {
    useFieldQuery,
    useFieldsQuery,
    updateFieldMutation,
    createFieldMutation,
    deleteFieldMutation,
  };
};
