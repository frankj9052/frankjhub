import { Request, Response, NextFunction, RequestHandler } from 'express';
import { OrganizationService } from './organization.service';
import {
  organizationCreateSchema,
  organizationPaginationSchema,
  organizationUpdateSchema,
  userIdParamsSchema,
} from '@frankjhub/shared-schema';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';

const organizationService = new OrganizationService();

export const createOrganizationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = organizationCreateSchema.parse(req.body);
    const createdBy = req.currentUser?.userName;
    if (!createdBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationService.createOrganization(parsed, createdBy);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllOrganizationsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = organizationPaginationSchema.parse(req.query);
    const result = await organizationService.getAllOrganizations(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrganizationByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = userIdParamsSchema.parse(req.params);
    const result = await organizationService.getOrganizationById(id);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = organizationUpdateSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationService.updateOrganization(parsed, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const softDeleteOrganizationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = userIdParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationService.softDeleteOrganization(id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const restoreOrganizationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = userIdParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationService.restoreOrganization(id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteOrganizationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = userIdParamsSchema.parse(req.query);
    const result = await organizationService.hardDeleteOrganization(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
