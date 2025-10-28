import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ActionService } from './action.service';
import {
  actionCreateRequestSchema,
  actionListRequestSchema,
  actionUpdateRequestSchema,
  idParamsSchema,
} from '@frankjhub/shared-schema';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';

const actionService = new ActionService();

export const createActionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = actionCreateRequestSchema.parse(req.body);
    const createdBy = req.currentUser?.userName;
    if (!createdBy) throw new UnauthorizedError('User identity not found in request');

    const result = await actionService.createAction(parsed, createdBy);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllActionsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = actionListRequestSchema.parse(req.query);
    const result = await actionService.getActionList(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getActionByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.params);
    const result = await actionService.getActionById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateActionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = actionUpdateRequestSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await actionService.updateAction(parsed, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const softDeleteActionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await actionService.softDeleteAction(id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const restoreActionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.body);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');

    const result = await actionService.restoreAction(id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteActionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idParamsSchema.parse(req.query);
    const performedBy = req.currentUser?.userName;
    if (!performedBy) throw new UnauthorizedError('User identity not found in request');
    const result = await actionService.hardDeleteAction(id, performedBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getActionOptionsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await actionService.getActionOptions();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
