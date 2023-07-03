import { Test, TestingModule } from '@nestjs/testing';
import { LevelStatesController } from './level-states.controller';
import { LevelStatesService } from './level-states.service';
import { LevelState } from '@prisma/client';
import { CreateLevelStateDto } from './dto/create-level-state.dto';
import { UpdateLevelStateDto } from './dto/update-level-state.dto';
import { NotFoundException } from '@nestjs/common';

const InMemoryLevelStates: Array<LevelState> = [
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

describe('LevelStatesController', () => {
  let controller: LevelStatesController;
  let service: LevelStatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelStatesController],
      providers: [{
        provide: LevelStatesService,
        useValue: {
          findAll: jest.fn().mockResolvedValue(InMemoryLevelStates),
          findOne: jest.fn((id: string) => {
            return InMemoryLevelStates.find(item => item.id === id);
          }),
          update: jest.fn((id: string, body: UpdateLevelStateDto) => {

            const item = InMemoryLevelStates.find(item => item.id === id);
            const idx = InMemoryLevelStates.indexOf(item);

            const updatedLevelState: LevelState = {
              id,
              title: body?.title || item.title,
              requiredXp: body?.requiredXp || item.requiredXp
            };

            InMemoryLevelStates[idx] = updatedLevelState;

            return updatedLevelState;
          }),
          create: jest.fn((body: CreateLevelStateDto) => {

            body['id'] = crypto.randomUUID();

            InMemoryLevelStates.push(body as LevelState);

            return InMemoryLevelStates[InMemoryLevelStates.length - 1];
          }),
          remove: jest.fn()
        }
      }],
    }).compile();

    service = module.get<LevelStatesService>(LevelStatesService);
    controller = module.get<LevelStatesController>(LevelStatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a level state entity successfully', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(InMemoryLevelStates);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(/* nothing */);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return an individual level state', async () => {
      const result = await controller.findOne('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');

      expect(result).toEqual(InMemoryLevelStates[0]);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');
    });

    it('should return an exception when not find level state', async () => {
      let error: Error;
      try {
        await controller.findOne('invalid-id');
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotFoundException);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error());

      expect(controller.findOne('some-id')).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a level state successfully', async () => {
      const body: CreateLevelStateDto = {
        title: 'O Axiomático',
        requiredXp: 777
      }

      const result = await controller.create(body);

      expect(result).toBeDefined();
      expect(result).toEqual(InMemoryLevelStates[InMemoryLevelStates.length - 1]);
      expect(typeof result).toEqual(typeof InMemoryLevelStates[0]);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      const body: CreateLevelStateDto = {
        title: 'O Axiomático',
        requiredXp: 777
      }

      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());

      expect(controller.create(body)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a level state', async () => {
      const body: UpdateLevelStateDto = {
        title: 'O Modalista',
        requiredXp: 30000
      }

      const existingLevelState = InMemoryLevelStates[0];

      const result = await controller.update(existingLevelState.id, body);

      expect(result).toBeDefined();
      expect(result).toEqual(InMemoryLevelStates[0]);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(existingLevelState.id, body);
    });

    it('should return undefined when not find level state', async () => {

      const body: UpdateLevelStateDto = {
        title: 'O Modalista',
        requiredXp: 30000
      }
      jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);
      const result = await controller.update('not-a-valid-id', body);

      expect(result).toBeUndefined();
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith('not-a-valid-id', body);
    });

    it('should throw an exception', () => {
      const body: UpdateLevelStateDto = {
        title: 'O Modalista',
        requiredXp: 30000
      }

      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());

      expect(controller.update('some-id', body)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should remove an existing level state', async () => {
      const existingLevelStateId = '1c937b93-b38e-47dd-9fe8-a99b9802ed9e';

      jest.spyOn(service, 'remove').mockResolvedValueOnce(existingLevelStateId as unknown as LevelState);

      const result = await controller.remove(existingLevelStateId);

      expect(result).toEqual(existingLevelStateId);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(existingLevelStateId);
    });

    it('should throw an error if the level state to remove does not exist', async () => {
      const nonExistingLevelStateId = 'non-existing-id';

      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error('Level state not found'));

      await expect(controller.remove(nonExistingLevelStateId)).rejects.toThrowError('Level state not found');
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(nonExistingLevelStateId);
    });

    it('should throw an exception', () => {

      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error());

      expect(controller.remove('some-id')).rejects.toThrowError();

    });
  });
});
