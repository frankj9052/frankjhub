import {
  ActionListRequest,
  ActionListResponse,
  ActionOptionListResponse,
  ActionSingleResponse,
} from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { getActionById, getActionList, getActionOptions } from '@/services/action.service';

export const getActionListAsync = createAppAsyncThunk<
  ActionListResponse,
  { pagination: ActionListRequest }
>('action/list', async ({ pagination }) => {
  const result = await getActionList(pagination);
  if (result.status === 'success') {
    return result;
  } else {
    throw result;
  }
});

export const getActoinOptionsAsync = createAppAsyncThunk<ActionOptionListResponse>(
  'action/option-list',
  async () => {
    const result = await getActionOptions();
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);

export const getActionByIdAsync = createAppAsyncThunk<ActionSingleResponse, { id: string }>(
  'action/getById',
  async ({ id }) => {
    const result = await getActionById(id);
    if (result.status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
);
