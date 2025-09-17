import { z } from '../../../libs/z';

export const geoJSONPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([
    z.number(), // 经度 lng
    z.number(), // 纬度 lat
  ]),
});
