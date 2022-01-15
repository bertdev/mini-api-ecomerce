import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const isPassowrdCorrect = await compare(password, user.password);
    if (!isPassowrdCorrect) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const tokenJWT = await sign({}, 'b8f1232b92e4efe718f4229b1c141478', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user, token: tokenJWT };
  }
}

export default CreateSessionsService;
