import {
  SessionResponse,
  sessionResponseSchema,
} from '../../../modules/common/response/sessionResponse.schema';

export { sessionResponseSchema as loginResponseSchema };
export type LoginResponse = SessionResponse;
