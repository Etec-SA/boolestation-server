import { PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

const prisma = new PrismaClient();
dayjs.extend(utc);

const setupUsers = async ()=>{
    await prisma.user.upsert({
        where: { id: '4151e54b-8517-4871-a1d2-acfb67a8bf1a' },
        update: {},
        create: {
          id: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
          name: 'Aristotle',
          username: 'aristotle',
          email: 'aristotle@athenas.com',
          birthdate: dayjs('1999-11-11').utc().format(),
          levelStateId: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
          profilePictureId: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
          password: 'zonpoNWDNIEONAwqplaźwdqwd-20@(13142',
        }
      });
    
      await prisma.user.upsert({
        where: { id: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511' },
        update: {},
        create: {
            id: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511',
            name: 'Plato',
            username: 'plato',
            email: 'plato@athenas.com',
            birthdate: dayjs('1999-11-11').utc().format(),
            levelStateId: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511',
            profilePictureId: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511',
            password: 'zonpoNWDNIEONAwqplaźwdqwd-20@(1314sda21342',
          }
      });
}

export {setupUsers};
