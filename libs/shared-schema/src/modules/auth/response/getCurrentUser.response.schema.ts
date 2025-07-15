import {
  SessionResponse,
  sessionResponseSchema,
} from '../../../modules/common/response/sessionResponse.schema';

export { sessionResponseSchema as getCurrentUserResponseSchema };
export type GetCurrentUserResponse = SessionResponse;
