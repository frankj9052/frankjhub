import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ResourceService } from './resource.service';
import {
  idParamsSchema,
  resourceListRequestSchema,
  resourceUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';

const resourceService = new ResourceService();

// export const createResourceController: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const parsed = resourceCreateRequestSchema.parse(req.body);
//     const createdBy = req.currentUser?.userName;
//     if (!createdBy) throw new UnauthorizedError('User identity not found in request');

//     const result = await resourceService.createResource(parsed, createdBy);
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

export const getResourceListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = resourceListRequestSchema.parse(req.query);
    const result = await resourceService.getResourceList(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getResourceByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.params);
    const result = await resourceService.getResourceById(parsed.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateResourceController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.params);
    const parsed = resourceUpdateRequestSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');
    const result = await resourceService.updateResource(id, parsed, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// export const softDeleteResourceController: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const parsed = idParamsSchema.parse(req.body);
//     const performedBy = req.currentUser?.userName;
//     if (!performedBy) throw new UnauthorizedError('User identity not found in request');
//     const result = await resourceService.softDeleteResource(parsed.id, performedBy);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const restoreResourceController: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const parsed = idParamsSchema.parse(req.body);
//     const performedBy = req.currentUser?.userName;
//     if (!performedBy) throw new UnauthorizedError('User identity not found in request');

//     const result = await resourceService.restoreResource(parsed.id, performedBy);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const hardDeleteResourceController: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const parsed = idParamsSchema.parse(req.query);
//     const performedBy = req.currentUser?.userName;
//     if (!performedBy) throw new UnauthorizedError('User identity not found in request');
//     const result = await resourceService.hardDeleteResource(parsed.id, performedBy);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

export const getResourceOptionListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await resourceService.getResourceOptionList();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
