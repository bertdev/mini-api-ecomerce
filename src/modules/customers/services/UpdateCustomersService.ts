import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../infra/typeorm/entities/Customer';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

class UpdateCustomersService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const customer = await customersRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer does not found', 404);
    }

    const emailExists = await customersRepository.findByEmail(email);
    if (emailExists && emailExists.id !== id) {
      throw new AppError('This email is already in use');
    }

    customer.email = email;
    customer.name = name;
    await customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomersService;
