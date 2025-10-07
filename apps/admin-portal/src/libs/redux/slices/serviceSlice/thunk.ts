import {
  ServiceListRequest,
  ServiceListResponse,
  ServiceSingleResponse,
} from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { getServiceById, getServiceList } from '@/services/service.service';

export const getServiceListAsync = createAppAsyncThunk<
  ServiceListResponse,
  { data: ServiceListRequest }
>('service/list', async ({ data }, { rejectWithValue }) => {
  const result = await getServiceList(data);
  if (result.status === 'success') {
    return result;
  } else {
    return rejectWithValue(result.message);
  }
});

export const getServiceByIdAsync = createAppAsyncThunk<ServiceSingleResponse, { id: string }>(
  'service/:id',
  async ({ id }, { rejectWithValue }) => {
    const result = await getServiceById(id);
    if (result.status === 'success') {
      return result;
    } else {
      return rejectWithValue(result.message);
    }
  }
);
