import { setupLevelStates } from "./seed-setups/level-state.seed";
import { setupProfilePictures } from "./seed-setups/profile-picture.seed";
import { PrismaClient } from "@prisma/client";
import { setupUsers } from "./seed-setups/user.seed";
import { setupModules } from "./seed-setups/modules.seed";
import { setupLessons } from "./seed-setups/lesson.seed";
import { setupExercises } from "./seed-setups/exercises.seed";
import { setupAlternatives } from "./seed-setups/alternatives.seed";
const prisma = new PrismaClient();

async function main() {
  await setupLevelStates();
  await setupProfilePictures();
  await setupUsers();
  await setupModules();
  await setupLessons();
  await setupExercises();
  await setupAlternatives();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
