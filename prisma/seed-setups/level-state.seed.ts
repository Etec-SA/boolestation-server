import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const setupLevelStates = async ()=>{
    const levelState01 = await prisma.levelState.upsert({
        where: { id: '4151e54b-8517-4871-a1d2-acfb67a8bf1a' },
        update: {},
        create: {
          id: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
          title: 'O Aprendiz',
          requiredXp: 100
        }
      });
    
      const levelState02 = await prisma.levelState.upsert({
        where: { id: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511' },
        update: {},
        create: {
          id: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511',
          title: 'Estudante Proposicional',
          requiredXp: 200
        }
      });
}

export {setupLevelStates};