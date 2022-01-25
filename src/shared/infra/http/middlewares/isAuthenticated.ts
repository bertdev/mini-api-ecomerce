import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');
  try {
    const decodedToken = verify(token, authConfig.jwt.secret);
    const { sub } = decodedToken;
    request.user = {
      id: sub as string,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}

export default isAuthenticated;
