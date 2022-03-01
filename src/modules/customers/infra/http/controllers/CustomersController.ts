import { Request, Response } from 'express';
import CreateCustomersService from '../../../services/CreateCustomersService';
import DeleteCustomersService from '../../../services/DeleteCustomersService';
import ListCustomersService from '../../../services/ListCustomersService';
import ShowCustomersService from '../../../services/ShowCustomersService';
import UpdateCustomersService from '../../../services/UpdateCustomersService';
import container from '@shared/container';

class CustomersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listCustomersService = new ListCustomersService();

    const customers = await listCustomersService.execute();

    return response.status(200).json(customers);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showCustomersService = new ShowCustomersService();
    const customer = await showCustomersService.execute({ id });

    return response.status(200).json(customer);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const createCustomersService = container.resolve(CreateCustomersService);
    const customer = await createCustomersService.execute({ name, email });

    return response.status(201).json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const { id } = request.params;
    const updateCustomerService = new UpdateCustomersService();
    const customer = await updateCustomerService.execute({ id, name, email });

    return response.status(200).json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const deleteCustomersService = new DeleteCustomersService();
    await deleteCustomersService.excute({ id });

    return response.sendStatus(204);
  }
}

export default CustomersController;
