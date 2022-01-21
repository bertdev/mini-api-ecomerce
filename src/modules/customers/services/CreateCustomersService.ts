import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

class CreateCustomersService {
  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const emailExists = await customersRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError('This email is already in use');
    }

    const customer = customersRepository.create({ name, email });
    await customersRepository.save(customer);

    return customer;
  }
}

export default CreateCustomersService;
