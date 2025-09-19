import { InvitationListRequest, InvitationListResponse } from '@frankjhub/shared-schema';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { getInvitationList } from '@/services/invitation.service';

export const getInvitationListAsync = createAppAsyncThunk<
  InvitationListResponse,
  { data: InvitationListRequest }
>('invitation/list', async ({ data }, { rejectWithValue }) => {
  const result = await getInvitationList(data);
  if (result.status === 'success') {
    return result;
  } else {
    return rejectWithValue(result.message);
  }
});
