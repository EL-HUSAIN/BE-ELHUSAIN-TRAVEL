import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "super@elhusein.com";
  const plainPassword = "SuperSecret123!";

  // Hash password
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // Upsert SUPER admin
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {}, // tidak ada perubahan jika sudah ada
    create: {
      email,
      passwordHash,
      role: AdminRole.SUPER,
    },
  });

  console.log("✅ Seeded SUPER admin:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
