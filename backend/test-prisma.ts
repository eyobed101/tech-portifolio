import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prisma connection...');
    try {
        const profile = await prisma.profile.findUnique({ where: { id: 'singleton' } });
        console.log('Profile found:', profile);
    } catch (err) {
        console.error('Prisma error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
