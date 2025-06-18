import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { UserProfileResponse } from './dto/userProfile.dto';
import { userAllProfilePaginationSchema } from './dto/userAllProfilePagination.dto';

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
    const users = await userService.getUsersAllProfile(email, pagination);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
