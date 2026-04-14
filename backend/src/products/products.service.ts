import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
  ) {}

  findAll(search?: string) {
    if (search) {
      return this.productsRepo.find({
        where: [
          { name: ILike(`%${search}%`) },
          { description: ILike(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }
    return this.productsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto) {
    const product = this.productsRepo.create(dto);
    return this.productsRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepo.remove(product);
  }
}
