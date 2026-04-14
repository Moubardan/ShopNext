import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  async create(userId: number, dto: CreateOrderDto) {
    const orderItems = [];
    let total = 0;

    for (const item of dto.items) {
      const product = await this.productsService.findOne(item.productId);
      const lineTotal = Number(product.price) * item.quantity;
      total += lineTotal;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity,
      });
    }

    const order = this.ordersRepo.create({
      userId,
      items: orderItems,
      total,
    });

    return this.ordersRepo.save(order);
  }

  findAllByUser(userId: number) {
    return this.ordersRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return this.ordersRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findOne(id: number, userId?: number) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.ordersRepo.findOne({ where });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
