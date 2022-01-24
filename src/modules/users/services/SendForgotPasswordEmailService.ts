import EtherealMail from '@config/mail/EtherealMail';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import path from 'path';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userTokensRepository = getCustomRepository(UserTokensRepository);
    const token = await userTokensRepository.generate(user.id);
    const forgotPasswordMailTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Teste da api - recuperação de senha',
      templateData: {
        file: forgotPasswordMailTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token?.id}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
