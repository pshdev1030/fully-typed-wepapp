import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.toDoList.upsert({
    where: {
      id: "3",
    },
    update: {},
    create: {
      id: "3",
      title: "dummy todolist",
      description: "더미데이터 입니다.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
