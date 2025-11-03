import { z } from '../../../../libs';
import { ROUTE_PATH_RE } from '../../constants';

export const pathSchema = z.string().min(1).regex(ROUTE_PATH_RE, 'Invalid route path');
