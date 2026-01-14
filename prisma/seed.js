// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// 1. Setup the connection manually since Schema doesn't have it
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log("Script is running! 1..."); 

async function main() {
  console.log('🌱 Starting seed logic...');

  // 2. Cleanup
  // Deleting in correct order to avoid foreign key errors
  await prisma.review.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ingredient.deleteMany();
  
  console.log('🧹 Cleanup finished.');

  // 3. Create User
  const user = await prisma.user.create({
    data: {
      email: 'debug@test.com',
      password: 'password123',
      name: 'Debug User',
      role: 'ADMIN',
    },
  });
  
  console.log('👤 User created:', user.email);

  // 4. Create Recipe
  await prisma.recipe.create({
    data: {
      title: 'Debug Pasta',
      description: 'Test recipe',
      instructions: 'Boil water.',
      prepTime: 5,
      cookTime: 10,
      difficulty: 'EASY',
      authorId: user.id,
      ingredients: {
        create: [
          { 
             ingredient: {
               create: { name: 'Debug Tomato' }
             },
             quantity: '2', 
             unit: 'cans' 
          },
        ],
      },
    },
  });

  console.log('🍝 Recipe created.');
}

// EXECUTE
main()
  .catch((e) => {
    console.error("❌ ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("✅ FINISHED");
  });