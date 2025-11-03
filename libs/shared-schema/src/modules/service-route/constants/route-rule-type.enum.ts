import { z, zInfer } from '../../../libs/z';

export const ROUTE_RULE_TYPE = {
  EXACT: 'exact',
  PREFIX: 'prefix',
} as const;

export const routeRuleTypeSchema = z.nativeEnum(ROUTE_RULE_TYPE);
export type RouteRuleType = zInfer<typeof routeRuleTypeSchema>;
