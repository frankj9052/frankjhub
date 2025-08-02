import { NextFunction, Request, RequestHandler, Response } from 'express';
import { PermissionService } from './permission.service';
import {
  idParamsSchema,
  permissionCreateRequestSchema,
  permissionListRequestSchema,
  permissionUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';

const permissionService = new PermissionService();

export const createPermissionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = permissionCreateRequestSchema.parse(req.body);
    const createdBy = req.currentUser?.userName;
    if (!createdBy) throw new UnauthorizedError('User identity not found in request');

    const result = await permissionService.createPermission(parsed, createdBy);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPermissionListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = permissionListRequestSchema.parse(req.query);
    const result = await permissionService.getPermissionList(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPermissionByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.params);
    const result = await permissionService.getPermissionById(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePermissionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = permissionUpdateRequestSchema.parse(req.body);
    const updatedBy = req.currentUser?.userName;
    if (!updatedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await permissionService.updatePermission(parsed, updatedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const softDeletePermissionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await permissionService.softDeletePermission(parsed.id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const restorePermissionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await permissionService.restorePermission(parsed.id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const hardDeletePermissionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.query);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await permissionService.hardDeletePermission(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPermissionOptionListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await permissionService.getPermissionOptionList();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
