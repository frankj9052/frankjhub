import { ApiResponse, BaseErrorResponse } from '@frankjhub/shared-schema';
import { ZodSchema } from 'zod';
import { ValidationError } from '@frankjhub/shared-errors';
import { convertZodIssuesToErrorDetails } from '@frankjhub/shared-error-utils';

/**
 * Validates input data against a given Zod schema and returns a typed result.
 *
 * @template T - The expected shape of the validated data.
 * @param schema - A Zod schema used to validate the input.
 * @param input - The input data to validate (typically an object).
 * @returns
 *   - `{ success: true, data: T }` if validation passes.
 *   - `{ success: false, error: ApiResponse<BaseErrorResponse> }` if validation fails, including
 *     a standardized validation error payload (converted via `ValidationError` and `convertZodIssuesToErrorDetails`).
 *
 * @example
 * const result = validateInput(userSchema, req.body);
 * if (!result.success) return res.status(400).json(result.error);
 * const user = result.data;
 */
export function validateInput<T>(
  schema: ZodSchema<T>,
  input: unknown
):
  | {
      success: true;
      data: T;
    }
  | { success: false; error: ApiResponse<BaseErrorResponse> } {
  const parsed = schema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const error = new ValidationError(convertZodIssuesToErrorDetails(parsed.error)).toJSON();
  return { success: false, error };
}
