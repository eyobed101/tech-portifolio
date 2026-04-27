const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                email,
                password: hashedPassword,
                name: 'Eyobed Elias'
            }
        });
        console.log('Admin user created/updated:', user.email);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
