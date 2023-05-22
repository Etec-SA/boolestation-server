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
  levelStates: {
    create: jest.fn().mockReturnValue(InMemoryLevelStates[0]),
    findMany: jest.fn().mockResolvedValue(InMemoryLevelStates),
    findUnique: jest.fn().mockResolvedValue(InMemoryLevelStates[0]),
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
});
