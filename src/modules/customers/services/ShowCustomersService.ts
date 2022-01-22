import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
}

class ShowCustomersService {
  public async execute({ id }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const customer = await customersRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer does not found', 404);
    }

    return customer;
  }
}

export default ShowCustomersService;