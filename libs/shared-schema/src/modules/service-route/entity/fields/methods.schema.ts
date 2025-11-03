import { HTTP_METHOD } from '../../../../enums';
import { z } from '../../../../libs/z';

export const methodsSchema = z
  .array(z.nativeEnum(HTTP_METHOD))
  .min(1, 'methods must contain at least one HTTP method')
  .refine(arr => new Set(arr).size === arr.length, 'methods must be unique');
