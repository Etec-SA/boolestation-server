import { Test, TestingModule } from '@nestjs/testing';
import { LevelStatesService } from './level-states.service';
import { PrismaService } from '../database/prisma.service'


const InMemoryLevelStates = [
  {
    id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Aprendiz',
    requiredXp: 100
  },
  {
    id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Curioso',
    requiredXp: 200
  },
  {
    id: '45a215cd-0ad1-48ae-89b3-cb429bf86512',
    title: 'Mago da Lógica',
    requiredXp: 400
  },
  {
    id: '246bbc9a-67fa-4547-89a2-00f12ea6c5b7',
    title: 'O Logicista',
    requiredXp: 800
  },
]

const prismaMock = {
  levelState: {
    create: jest.fn().mockReturnValue(InMemoryLevelStates[0]),
    findMany: jest.fn().mockResolvedValue(InMemoryLevelStates),
    findFirst: jest.fn().mockResolvedValue(InMemoryLevelStates[0]),
    update: jest.fn().mockResolvedValue(InMemoryLevelStates[0]),
    delete: jest.fn(),
  },
};

describe('LevelStatesService', () => {
  let service: LevelStatesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelStatesService,
        {provide: PrismaService, useValue: prismaMock}
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<LevelStatesService>(LevelStatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('findAll', ()=>{
    it('should return an array of level states', async ()=>{
      const response = await service.findAll();
      expect(response).toEqual(InMemoryLevelStates);
      expect(prisma.levelState.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.findMany).toHaveBeenCalledWith(/* nothing */);
    });
  });

  describe('findOne', ()=>{
    it('should return a single level state', async ()=>{
      const response = await service.findOne('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');

      expect(response).toEqual(InMemoryLevelStates[0]);
      expect(prisma.levelState.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.findFirst).toHaveBeenCalledWith({
        where: { id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e' },
      });
    });

    it(`should return nothing when level state is not found`, async () => {
      jest.spyOn(prisma.levelState, 'findFirst').mockResolvedValue(undefined);

      const response = await service.findOne('1c111b93-b38e-47dd-9fe8-a99b9802ed9e');

      expect(response).toBeUndefined();
      //expect(prisma.levelState.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.findFirst).toHaveBeenCalledWith({
        where: { id: '1c111b93-b38e-47dd-9fe8-a99b9802ed9e' },
      });
    });
  });
});
