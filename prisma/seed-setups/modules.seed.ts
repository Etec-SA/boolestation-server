import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const setupModules = async () => {
  const promises = [
    prisma.module.upsert({
      where: { id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a" },
      update: {},
      create: {
        id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        title: "Lógica Aristotélica",
        slug: "logica-aristotelica",
        description: "Módulo onde aprenderemos sobre teoria dos silogismos",
        createdAt: new Date(Date.UTC(2023, 1, 2)),
        updatedAt: new Date(Date.UTC(2023, 1, 2)),
      },
    }),
    prisma.module.upsert({
      where: { id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511" },
      update: {},
      create: {
        id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        title: "Lógica Proposicional",
        slug: "logica-proposicional",
        description:
          "Módulo onde aprenderemos sobre a lógica clássica criada por Frege.",
        createdAt: new Date(Date.UTC(2023, 1, 2)),
        updatedAt: new Date(Date.UTC(2023, 1, 2)),
      },
    }),
  ];

  await Promise.all(promises);
};

export { setupModules };
