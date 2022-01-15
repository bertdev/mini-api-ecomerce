import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userExists = await usersRepository.findByEmail(email);
    if (userExists) {
      throw new AppError('This email is aready in use');
    }

    const passwordEncrypted = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: passwordEncrypted,
    });
    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
