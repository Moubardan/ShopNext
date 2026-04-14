import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { ProductsService } from '../products/products.service';

describe('OrdersService', () => {
  let service: OrdersService;
  const mockOrderRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockProductsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it('should create an order with correct total', async () => {
    mockProductsService.findOne.mockResolvedValue({
      id: 1, name: 'Item', price: 25.0,
    });
    mockOrderRepo.create.mockImplementation((data) => data);
    mockOrderRepo.save.mockImplementation((data) => ({ id: 1, ...data }));

    const result = await service.create(1, { items: [{ productId: 1, quantity: 2 }] });

    expect(result.total).toBe(50);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Item');
  });

  it('should return orders for a user', async () => {
    const orders = [{ id: 1, userId: 1, total: 50 }];
    mockOrderRepo.find.mockResolvedValue(orders);

    const result = await service.findAllByUser(1);
    expect(result).toEqual(orders);
  });

  it('should throw NotFoundException for missing order', async () => {
    mockOrderRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
  });

  it('should return a single order', async () => {
    const order = { id: 1, userId: 1, total: 50, items: [] };
    mockOrderRepo.findOne.mockResolvedValue(order);

    const result = await service.findOne(1, 1);
    expect(result.id).toBe(1);
  });
});
