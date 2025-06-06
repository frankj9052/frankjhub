import './docs/openapi';
import { Router } from 'express';
import { currentUserController, loginController } from './auth.controller';
import { loginSchema } from './dto/login.dto';
import { requireAuth } from './middlewares/requireAuth';
import { validateRequest } from '../common/middlewares/validateRequest';

const router = Router();

router.post('/auth/login', validateRequest({ body: loginSchema }), loginController);
router.get('/auth/current-user', requireAuth, currentUserController);

export function register(parent: Router) {
  parent.use('/', router);
}
