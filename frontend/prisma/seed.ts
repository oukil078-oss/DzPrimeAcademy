import { ensureSeeded } from '../src/lib/seed';
import { prisma } from '../src/lib/db';

ensureSeeded()
  .then(() => {
    console.log('Seed complete.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
