import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const setupExercises = async ()=>{
    await prisma.exercise.upsert({
        where: { id: '4151e54b-8517-4871-a1d2-acfb67a8bf1a' },
        update: {},
        create: {
          id: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
          title: 'Invalidade de Silogismos',
          description: 'Qual dos seguintes silogismos possui uma forma inválida?',
          lessonId: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
        }
      });
    
      await prisma.exercise.upsert({
        where: { id: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511' },
        update: {},
        create: {
          id: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511',
          title: 'Equivalência da Implicação',
          description: 'Quais das seguintes fórmulas é equivalente a uma implicação?',
          lessonId: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511'
        }
      });
}

export {setupExercises};