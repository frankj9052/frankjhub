import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import {
  UserProfileResponse,
  userAdminUpdateSchema,
  userAllProfilePaginationSchema,
  userIdParamsSchema,
} from '@frankjhub/shared-schema';

const userService = new UserService();

export const getCurrentUserProfileController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.currentUser?.id;
    const email = req.currentUser?.email;

    if (!id || !email) {
      throw new UnauthorizedError('User identity not found in request');
    }
    const userProfile = await userService.getCurrentUserInfo(id, email);
    const response: UserProfileResponse = {
      status: 'success',
      data: userProfile,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUsersAllProfileController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.currentUser?.email;
    if (!email) throw new UnauthorizedError('User identity not found in request');
    const pagination = userAllProfilePaginationSchema.parse(req.query);
    const response = await userService.getUsersAllProfile(email, pagination);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserAllProfileByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await userService.getUserAllProfileById(id);
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
    const parsed = userIdParamsSchema.parse(req.body);
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
    const parsed = userIdParamsSchema.parse(req.body);
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
    const parsed = userIdParamsSchema.parse(req.query);
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

export const updateUserByAdminController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = userAdminUpdateSchema.parse(req.body);
    const userName = req.currentUser?.userName;
    if (!userName) {
      throw new UnauthorizedError('User identity not found in request');
    }
    const response = await userService.updateUserByAdmin(parsed, userName);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
