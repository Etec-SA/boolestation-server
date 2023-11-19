import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const setupAlternatives = async () => {
  await Promise.all([
    prisma.alternative.upsert({
      where: { id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a" },
      update: {},
      create: {
        id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        content: "Silogismo Inválido",
        exerciseId: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        isCorrect: true,
      },
    }),
    prisma.alternative.upsert({
      where: { id: "4b11819c-e966-4f04-8eb0-851bb542e275" },
      update: {},
      create: {
        id: "4b11819c-e966-4f04-8eb0-851bb542e275",
        content: "Silogismo Válido",
        exerciseId: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        isCorrect: false,
      },
    }),
    prisma.alternative.upsert({
      where: { id: "673965bc-cc26-4300-a1f5-8287124a4108" },
      update: {},
      create: {
        id: "673965bc-cc26-4300-a1f5-8287124a4108",
        content: "Silogismo Válido 2",
        exerciseId: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        isCorrect: false,
      },
    }),
    prisma.alternative.upsert({
      where: { id: "8e6b9ecd-e755-4e85-aee4-89eaac8f81cb" },
      update: {},
      create: {
        id: "8e6b9ecd-e755-4e85-aee4-89eaac8f81cb",
        content: "Silogismo Válido 3",
        exerciseId: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        isCorrect: false,
      },
    }),
  ]);

  await Promise.all([
    prisma.alternative.upsert({
      where: { id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511" },
      update: {},
      create: {
        id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        content: "¬P v Q",
        exerciseId: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        isCorrect: true,
      },
    }),
    prisma.alternative.upsert({
      where: { id: "3a40bdea-cb78-420c-917f-f61d0d58c6d7" },
      update: {},
      create: {
        id: "3a40bdea-cb78-420c-917f-f61d0d58c6d7",
        content: "A ^ A",
        exerciseId: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        isCorrect: false,
      },
    }),
    prisma.alternative.upsert({
      where: { id: "1e38ce3c-c5ef-42f5-852f-53ba77bcaa6c" },
      update: {},
      create: {
        id: "1e38ce3c-c5ef-42f5-852f-53ba77bcaa6c",
        content: "A ^ ¬A",
        exerciseId: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        isCorrect: false,
      },
    }),
    prisma.alternative.upsert({
      where: { id: "8db9e069-e4d7-46b9-a4c2-dcc1ae5b90ea" },
      update: {},
      create: {
        id: "8db9e069-e4d7-46b9-a4c2-dcc1ae5b90ea",
        content: "¬¬(A ^ ¬¬A)",
        exerciseId: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        isCorrect: false,
      },
    }),
  ]);
};

export { setupAlternatives };
