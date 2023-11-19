import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const setupLessons = async () => {
  const promises = [
    prisma.lesson.upsert({
      where: { id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a" },
      update: {},
      create: {
        id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        title: "Silogismos",
        content: "Exploraremos aqui os silogismos da lógica tradicional",
        slug: "silogismos",
        moduleId: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
      },
    }),
    prisma.lesson.upsert({
      where: { id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511" },
      update: {},
      create: {
        id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        title: "Operador de Implicação",
        slug: "operador-de-implicacao",
        content: "Exploraremos aqui a aplicação do operador de implicação",
        moduleId: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
      },
    }),
  ];

  await Promise.all(promises);
};

export { setupLessons };
