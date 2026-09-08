import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: { in: ['zakaryaoukil2003@gmail.com', 'admin@dzprime.academy'] } },
  });
  console.log(JSON.stringify(user, null, 2));
}

main().finally(() => prisma.$disconnect());
