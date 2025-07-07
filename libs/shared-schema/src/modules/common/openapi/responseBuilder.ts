import { ErrorClassNames } from './errorTypes';

type ErrorResponseInput = Record<number, ErrorClassNames>;

/**
 * Remove trailing "Error" from class name to get response component name.
 */
const extractResponseName = (errorClass: ErrorClassNames): string =>
  errorClass.replace(/Error$/, '');

/**
 * Build OpenAPI error responses with $ref
 */
export const buildErrorResponses = (input: ErrorResponseInput) => {
  const result: Record<number, { $ref: string }> = {};

  for (const [status, className] of Object.entries(input)) {
    result[Number(status)] = {
      $ref: `#/components/responses/${extractResponseName(className as ErrorClassNames)}`,
    };
  }

  return result;
};
