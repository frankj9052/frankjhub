import { ActionResult } from '@/types';
import {
  ActionCreateRequest,
  actionCreateRequestSchema,
  ActionListRequest,
  ActionListResponse,
  ActionOptionListResponse,
  ActionSingleResponse,
  ActionUpdateRequest,
  actionUpdateRequestSchema,
  idParamsSchema,
} from '@frankjhub/shared-schema';
import { getErrorMessage } from '@frankjhub/shared-utils';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getActionList(
  pagination: ActionListRequest
): Promise<ActionResult<ActionListResponse>> {
  try {
    const res = await axios.get(`${baseURL}/api/action/list`, {
      withCredentials: true,
      params: pagination,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to fetch action list');
    return { status: 'error', error: message };
  }
}

export async function getActionOptions(): Promise<ActionResult<ActionOptionListResponse>> {
  try {
    const res = await axios.get(`${baseURL}/api/action/options`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to fetch action options');
    return { status: 'error', error: message };
  }
}

export async function getActionById(id: string): Promise<ActionResult<ActionSingleResponse>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    const res = await axios.get(`${baseURL}/api/action/${parsed.id}`, {
      withCredentials: true,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to fetch action by id');
    return { status: 'error', error: message };
  }
}

export async function softDeleteAction(id: string): Promise<ActionResult<ActionSingleResponse>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    const res = await axios.patch(
      `${baseURL}/api/action/soft-delete`,
      { id: parsed.id },
      { withCredentials: true }
    );
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to delete action');
    return { status: 'error', error: message };
  }
}

export async function restoreAction(id: string): Promise<ActionResult<ActionSingleResponse>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    const res = await axios.patch(
      `${baseURL}/api/action/restore`,
      { id: parsed.id },
      { withCredentials: true }
    );
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to restore action');
    return { status: 'error', error: message };
  }
}

export async function hardDeleteAction(id: string): Promise<ActionResult<ActionSingleResponse>> {
  try {
    const parsed = idParamsSchema.parse({ id });
    const res = await axios.delete(`${baseURL}/api/action/hard-delete`, {
      withCredentials: true,
      params: { id: parsed.id },
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to delete action permanently');
    return { status: 'error', error: message };
  }
}

export async function updateAction(
  data: ActionUpdateRequest
): Promise<ActionResult<ActionSingleResponse>> {
  try {
    const parsed = actionUpdateRequestSchema.parse(data);
    const res = await axios.patch(`${baseURL}/api/action/update`, parsed, {
      withCredentials: true,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to update action');
    return { status: 'error', error: message };
  }
}

export async function createAction(
  data: ActionCreateRequest
): Promise<ActionResult<ActionSingleResponse>> {
  try {
    const parsed = actionCreateRequestSchema.parse(data);
    const res = await axios.post(`${baseURL}/api/action`, parsed, {
      withCredentials: true,
    });
    return { status: 'success', data: res.data };
  } catch (err) {
    console.error(err);
    const message = getErrorMessage(err, 'Failed to create action');
    return { status: 'error', error: message };
  }
}
