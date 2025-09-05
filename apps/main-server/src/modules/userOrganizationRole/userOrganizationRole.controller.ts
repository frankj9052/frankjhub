import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserOrganizationRoleService } from './userOrganizationRole.service';
import {
  idParamsSchema,
  userOrganizationRoleCreateRequestSchema,
  userOrganizationRoleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';

const uorService = new UserOrganizationRoleService();

export const createUserOrganizationRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = userOrganizationRoleCreateRequestSchema.parse(req.body);
    const createdBy = req.currentUser?.userName;
    if (!createdBy) throw new UnauthorizedError('User identity not found in request');

    const result = await uorService.createUserOrganizationRole(parsed, createdBy);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserOrganizationRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = userOrganizationRoleUpdateRequestSchema.parse(req.body);
    const updatedBy = req.currentUser?.userName;
    if (!updatedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await uorService.updateUserOrganizationRole(parsed, updatedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserOrganizationRoleByUserIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.params);
    const result = await uorService.getOrganizationRolesById(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
