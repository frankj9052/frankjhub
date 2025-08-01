import { Request, Response, NextFunction, RequestHandler } from 'express';
import { OrganizationTypeService } from './organizationType.service';
import {
  idParamsSchema,
  organizationTypeCreateRequestSchema,
  organizationTypeListRequestSchema,
  organizationTypeUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';

const organizationTypeService = new OrganizationTypeService();

export const createOrganizationTypeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = organizationTypeCreateRequestSchema.parse(req.body);
    const createdBy = req.currentUser?.userName;
    if (!createdBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationTypeService.createOrganizationType(parsed, createdBy);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllOrganizationTypesController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = organizationTypeListRequestSchema.parse(req.query);
    const result = await organizationTypeService.getAllOrganizationTypes(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrganizationTypeByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.params);
    const result = await organizationTypeService.getOrganizationTypeById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationTypeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = organizationTypeUpdateRequestSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationTypeService.updateOrganizationType(parsed, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const softDeleteOrganizationTypeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationTypeService.softDeleteOrganizationType(id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const restoreOrganizationTypeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await organizationTypeService.restoreOrganizationType(id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteOrganizationTypeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.query);
    const result = await organizationTypeService.hardDeleteOrganizationType(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrgTypeOptionsController: RequestHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await organizationTypeService.getAllOrgTypeOptions();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
