import { NextFunction, Request, RequestHandler, Response } from 'express';
import { RoleService } from './role.service';
import {
  idParamsSchema,
  roleCreateRequestSchema,
  roleListRequestSchema,
  roleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';

const roleService = new RoleService();

export const createRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = roleCreateRequestSchema.parse(req.body);
    const createdBy = req.currentUser?.userName;
    if (!createdBy) throw new UnauthorizedError('User identity not found in request');

    const result = await roleService.createRole(parsed, createdBy);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRoleListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = roleListRequestSchema.parse(req.query);
    const result = await roleService.getRoleList(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRoleByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.params);
    const result = await roleService.getRoleById(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = roleUpdateRequestSchema.parse(req.body);
    const updatedBy = req.currentUser?.userName;
    if (!updatedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await roleService.updateRole(parsed, updatedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const softDeleteRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await roleService.softDeleteRole(parsed.id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const restoreRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await roleService.restoreRole(parsed.id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.query);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await roleService.hardDeleteRole(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRoleOptionListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await roleService.getRoleOptionList();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
