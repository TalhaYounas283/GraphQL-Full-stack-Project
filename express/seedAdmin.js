require('dotenv').config();
const datasource = require('./db-config/data-source');
const User = require('./Entity/User');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    // Initialize DB connection
    await datasource.initialize();
    console.log('Database connected!');

    const userRepo = datasource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepo.findOne({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const salt = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash('123456', salt);

    const adminUser = userRepo.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await userRepo.save(adminUser);
    console.log('✅ Admin user created:', adminUser.email);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
}

seedAdmin();