import { getUsersAllProfile } from '@/services/user';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { UserPaginationParams } from '@frankjhub/shared-schema';

interface Props {
  pagination: UserPaginationParams;
}
export const getUsersAllProfileAsync = createAppAsyncThunk(
  'getUsersAllProfile',
  async ({ pagination }: Props) => {
    const result = await getUsersAllProfile({ pagination });
    if (result.status === 'success') {
      return result.data;
    } else {
      throw null;
    }
  }
);
