import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import {
  idParamsSchema,
  userListRequestSchema,
  userOptionListRequestSchema,
  userUpdateRequestSchema,
} from '@frankjhub/shared-schema';

const userService = new UserService();

export const getCurrentUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.currentUser?.id;

    if (!id) {
      throw new UnauthorizedError('User identity not found in request');
    }
    const response = await userService.getUserById(id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.currentUser?.email;
    if (!email) throw new UnauthorizedError('User identity not found in request');
    const pagination = userListRequestSchema.parse(req.query);
    const response = await userService.getUserList(email, pagination);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await userService.getUserById(id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const softDeleteUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const userName = req.currentUser?.userName;
    if (!userName) {
      throw new UnauthorizedError('User identity not found in request');
    }
    const response = await userService.softDeleteUser(parsed.id, userName);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const restoreSoftDeletedUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.body);
    const userName = req.currentUser?.userName;
    if (!userName) {
      throw new UnauthorizedError('User identity not found in request');
    }
    const response = await userService.restoreSoftDeletedUser(parsed.id, userName);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = idParamsSchema.parse(req.query);
    const userName = req.currentUser?.userName;
    if (!userName) {
      throw new UnauthorizedError('User identity not found in request');
    }
    const response = await userService.hardDeleteUser(parsed.id, userName);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = userUpdateRequestSchema.parse(req.body);
    const userName = req.currentUser?.userName;
    if (!userName) {
      throw new UnauthorizedError('User identity not found in request');
    }
    const response = await userService.updateUser(parsed, userName);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserOptionListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = userOptionListRequestSchema.parse(req.query);

    const result = await userService.getUserOptionList(parsed.keyword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
