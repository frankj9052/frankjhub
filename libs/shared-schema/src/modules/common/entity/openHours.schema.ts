import { z, zInfer } from '../../../libs/z';

export const openHoursSchema = z.object({
  weekly: z
    .record(
      z.string(),
      z.array(
        z.object({
          open: z.string(),
          close: z.string(),
        })
      )
    )
    .optional(),
  exceptions: z
    .array(
      z.object({
        date: z.string(),
        closed: z.boolean().optional(),
        open: z.string().optional(),
        close: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .optional(),
});

export type OpenHour = zInfer<typeof openHoursSchema>;
