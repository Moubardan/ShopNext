import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://shopnext:shopnext@localhost:5432/shopnext',
  entities: [User, Product],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const productRepo = dataSource.getRepository(Product);

  // Create admin user
  const adminExists = await userRepo.findOne({ where: { email: 'admin@shopnext.com' } });
  if (!adminExists) {
    await userRepo.save({
      name: 'Admin',
      email: 'admin@shopnext.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    });
    console.log('Admin user created: admin@shopnext.com / admin123');
  }

  // Create sample products
  const count = await productRepo.count();
  if (count === 0) {
    await productRepo.save([
      { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones', price: 99.99, image: 'https://picsum.photos/seed/headphones/400/400' },
      { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with cherry switches', price: 149.99, image: 'https://picsum.photos/seed/keyboard/400/400' },
      { name: 'USB-C Hub', description: '7-in-1 USB-C hub with HDMI and ethernet', price: 49.99, image: 'https://picsum.photos/seed/usbhub/400/400' },
      { name: 'Webcam HD', description: '1080p webcam with built-in microphone', price: 79.99, image: 'https://picsum.photos/seed/webcam/400/400' },
      { name: 'Mouse Pad XL', description: 'Extra large gaming mouse pad', price: 24.99, image: 'https://picsum.photos/seed/mousepad/400/400' },
      { name: 'Monitor Stand', description: 'Adjustable aluminum monitor stand', price: 59.99, image: 'https://picsum.photos/seed/stand/400/400' },
    ]);
    console.log('6 sample products created');
  }

  await dataSource.destroy();
  console.log('Seed complete!');
}

seed().catch(console.error);
