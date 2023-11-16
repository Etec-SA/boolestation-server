import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const setupProfilePictures = async () => {
  const promises = [
    prisma.profilePicture.upsert({
      where: { id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a" },
      update: {},
      create: {
        id: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
        title: "Aristotle",
        url: "https://cdn.thecollector.com/wp-content/uploads/2023/05/francesco-hayez-aristotle-painting.jpg",
      },
    }),
    prisma.profilePicture.upsert({
      where: { id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511" },
      update: {},
      create: {
        id: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        title: "Plato",
        url: "https://images.saymedia-content.com/.image/t_share/MTgwMDE1OTM1MjA4NjI5Mzcw/the-ancient-greek-philosopher-plato-his-life-and-works.jpg",
      },
    }),
  ];

  await Promise.all(promises);
};

export { setupProfilePictures };
