import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  avatarFileName: string;
  userId: string;
}

class UploadUserAvatarService {
  public async execute({ avatarFileName, userId }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.avatar) {
      const userAvaterFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvaterFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvaterFilePath);
      }
    }

    user.avatar = avatarFileName;
    await usersRepository.save(user);

    return user;
  }
}

export default UploadUserAvatarService;
