import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const productExits = await productsRepository.findByName(name);

    if (productExits) {
      throw new AppError('There is already one product using this name');
    }

    const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-products-list');

    const product = productsRepository.create({ name, price, quantity });
    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
