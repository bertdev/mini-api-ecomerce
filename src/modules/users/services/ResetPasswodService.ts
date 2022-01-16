import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import { addHours, isAfter } from 'date-fns';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const userTokensRepository = getCustomRepository(UserTokensRepository);
    const userToken = await userTokensRepository.findByTokenId(token);
    if (!userToken) {
      throw new AppError('User token not exists');
    }

    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreated_at = userToken.created_at;
    const compareDate = addHours(tokenCreated_at, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    const passwordEncrypted = await hash(password, 8);
    user.password = passwordEncrypted;
    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
