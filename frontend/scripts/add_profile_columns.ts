import { prisma } from '../src/lib/db';

async function main() {
  console.log('Adding columns to User table...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "User" 
    ADD COLUMN IF NOT EXISTS "jobTitle" TEXT,
    ADD COLUMN IF NOT EXISTS "adminRole" TEXT,
    ADD COLUMN IF NOT EXISTS "bio" TEXT,
    ADD COLUMN IF NOT EXISTS "facebook" TEXT,
    ADD COLUMN IF NOT EXISTS "instagram" TEXT,
    ADD COLUMN IF NOT EXISTS "linkedin" TEXT,
    ADD COLUMN IF NOT EXISTS "telegram" TEXT,
    ADD COLUMN IF NOT EXISTS "youtube" TEXT,
    ADD COLUMN IF NOT EXISTS "whatsapp" TEXT,
    ADD COLUMN IF NOT EXISTS "website" TEXT,
    ADD COLUMN IF NOT EXISTS "twitter" TEXT;
  `);
  console.log('Columns added successfully!');
}

main()
  .catch((e) => {
    console.error('Error adding columns:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
