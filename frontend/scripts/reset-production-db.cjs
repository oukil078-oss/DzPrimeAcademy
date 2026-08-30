require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@dzprime.academy').toLowerCase();

  const results = {};
  results.bundlePurchase = (await prisma.bundlePurchase.deleteMany({})).count;
  results.sessionRegistration = (await prisma.sessionRegistration.deleteMany({})).count;
  results.enrollment = (await prisma.enrollment.deleteMany({})).count;
  results.postComment = (await prisma.postComment.deleteMany({})).count;
  results.post = (await prisma.post.deleteMany({})).count;
  results.rating = (await prisma.rating.deleteMany({})).count;
  results.subscription = (await prisma.subscription.deleteMany({})).count;
  results.liveSession = (await prisma.liveSession.deleteMany({})).count;
  results.course = (await prisma.course.deleteMany({})).count;
  results.facultyPayout = (await prisma.facultyPayout.deleteMany({})).count;
  results.teacherProfile = (await prisma.teacherProfile.deleteMany({})).count;
  results.ambassadorProfile = (await prisma.ambassadorProfile.deleteMany({})).count;
  results.passwordResetToken = (await prisma.passwordResetToken.deleteMany({})).count;
  results.session = (await prisma.session.deleteMany({})).count;
  results.loginAttempt = (await prisma.loginAttempt.deleteMany({})).count;
  results.user = (await prisma.user.deleteMany({ where: { email: { not: adminEmail } } })).count;

  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  const bundleCount = await prisma.bundle.count();
  const wilayaCount = await prisma.wilaya.count();

  console.log(JSON.stringify(results, null, 2));
  console.log('Admin account preserved:', adminUser ? adminUser.email : 'MISSING - RECHECK');
  console.log('Bundles preserved:', bundleCount);
  console.log('Wilayas/reference data preserved:', wilayaCount);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
