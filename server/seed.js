const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seedUsers(numUsers) {
  try {
    const usersToCreate = Array.from({ length: numUsers }).map(() => ({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    }));

    const createdUsers = await prisma.user.createMany({
      data: usersToCreate,
    });

    console.log(`Successfully seeded ${numUsers} users.`);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers(5);
