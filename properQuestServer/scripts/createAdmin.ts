import { sequelizeConn } from '../src/config/database';
import { User, UserPassword } from '../src/models';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    // ensure DB is connected
    await sequelizeConn.authenticate();
    console.log('✅ Database connected');

    // 1️⃣ Create user (NO password here)
    const user = await User.create({
      email: 'muhammadmeek2@gmail.com',
      role: 'admin',
      isVerified: true,
      active: true,
      name: 'Super',
      surname: 'Admin',
    });

    // 2️⃣ Create password (password lives here)
    await UserPassword.create({
      userId: user.userId,
      password: '12345678', // will be hashed automatically
    });

    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
}

createAdmin();

