import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../infra/typeorm/entities/Order';
import OrdersRepository from '../infra/typeorm/repositories/OrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer_id);
    if (!customerExists) {
      throw new AppError('This customer does not exists', 404);
    }

    const existsProducts = await productsRepository.findAllByIds(products);
    if (!existsProducts.length) {
      throw new AppError('Poducts does not found', 404);
    }

    const existsProductsIds = existsProducts.map(product => product.id);
    const checkInexistentsProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );
    if (checkInexistentsProducts.length) {
      throw new AppError(
        `Could not found a product with the id: ${checkInexistentsProducts[0].id}`,
        404,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );
    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for the product with the id ${quantityAvailable[0].id}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.find(p => p.id === product.id)?.price as number,
    }));

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        (existsProducts.find(p => p.id === product.product_id)
          ?.quantity as number) - product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
