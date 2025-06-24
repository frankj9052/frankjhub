import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { UserProfileResponse, userAllProfilePaginationSchema } from '@frankjhub/shared-schema';

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
