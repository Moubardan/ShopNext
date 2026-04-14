import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should return all products', async () => {
    const products = [{ id: 1, name: 'Test' }];
    mockRepo.find.mockResolvedValue(products);

    const result = await service.findAll();
    expect(result).toEqual(products);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('should search products by name', async () => {
    mockRepo.find.mockResolvedValue([]);
    await service.findAll('keyboard');
    expect(mockRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.any(Array) }),
    );
  });

  it('should return a single product', async () => {
    const product = { id: 1, name: 'Test', price: 10 };
    mockRepo.findOne.mockResolvedValue(product);

    const result = await service.findOne(1);
    expect(result).toEqual(product);
  });

  it('should throw NotFoundException for missing product', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a product', async () => {
    const dto = { name: 'New', description: 'Desc', price: 20 };
    const created = { id: 1, ...dto };
    mockRepo.create.mockReturnValue(created);
    mockRepo.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result.name).toBe('New');
  });

  it('should delete a product', async () => {
    const product = { id: 1, name: 'Test' };
    mockRepo.findOne.mockResolvedValue(product);
    mockRepo.remove.mockResolvedValue(product);

    await service.remove(1);
    expect(mockRepo.remove).toHaveBeenCalledWith(product);
  });
});
