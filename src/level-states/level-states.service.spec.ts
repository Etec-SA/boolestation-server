import { Test, TestingModule } from "@nestjs/testing";
import { LevelStatesService } from "./level-states.service";
import { PrismaService } from "../database/prisma.service";
import { CreateLevelStateDto } from "./dto/create-level-state.dto";
import { UpdateLevelStateDto } from "./dto/update-level-state.dto";
import { NotFoundException } from "@nestjs/common";

interface LevelState {
  id: string;
  title: string;
  requiredXp: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const InMemoryLevelStates: Array<LevelState> = [
  {
    id: "1c937b93-b38e-47dd-9fe8-a99b9802ed9e",
    title: "Aprendiz",
    requiredXp: 100,
  },
  {
    id: "1c937b93-b38e-47dd-9fe8-a99b9802ed9e",
    title: "Curioso",
    requiredXp: 200,
  },
  {
    id: "45a215cd-0ad1-48ae-89b3-cb429bf86512",
    title: "Mago da Lógica",
    requiredXp: 400,
  },
  {
    id: "246bbc9a-67fa-4547-89a2-00f12ea6c5b7",
    title: "O Logicista",
    requiredXp: 800,
  },
];

const prismaMock = {
  levelState: {
    create: jest.fn(({ data }: { data: CreateLevelStateDto }) => {
      const { title, requiredXp } = data;
      InMemoryLevelStates.push({ id: crypto.randomUUID(), title, requiredXp });
      return InMemoryLevelStates[InMemoryLevelStates.length - 1];
    }),
    findMany: jest.fn().mockResolvedValue(InMemoryLevelStates),
    findFirst: jest.fn().mockResolvedValue(InMemoryLevelStates[0]),
    update: jest.fn().mockResolvedValue(InMemoryLevelStates[0]),
    delete: jest.fn(),
  },
};

describe("LevelStatesService", () => {
  let service: LevelStatesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelStatesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<LevelStatesService>(LevelStatesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of level states", async () => {
      const response = await service.findAll();
      expect(response).toEqual(InMemoryLevelStates);
      expect(prisma.levelState.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.findMany).toHaveBeenCalledWith(/* nothing */);
    });
  });

  describe("findOne", () => {
    it("should return a single level state", async () => {
      const response = await service.findOne(
        "1c937b93-b38e-47dd-9fe8-a99b9802ed9e"
      );

      expect(response).toEqual(InMemoryLevelStates[0]);
      expect(prisma.levelState.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.findFirst).toHaveBeenCalledWith({
        where: { id: "1c937b93-b38e-47dd-9fe8-a99b9802ed9e" },
      });
    });

    it(`should return an error when level state is not found`, async () => {
      jest
        .spyOn(prisma.levelState, "findFirst")
        .mockResolvedValueOnce(undefined);

      try {
        await service.findOne("1c111b93-b38e-47dd-9fe8-a99b9802ed9e");
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("findLowestLevelStateId", () => {
    it("should return a single level state id", async () => {
      jest
        .spyOn(prisma.levelState, "findFirst")
        .mockResolvedValueOnce(InMemoryLevelStates[0].id as any);
      const response = await service.findLowestLevelStateId();

      expect(response).toEqual(InMemoryLevelStates[0].id);
      expect(prisma.levelState.findFirst).toHaveBeenCalledTimes(3);
      expect(prisma.levelState.findFirst).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        orderBy: {
          requiredXp: "asc",
        },
      });
    });

    it(`should throw an error`, async () => {
      jest
        .spyOn(prisma.levelState, "findFirst")
        .mockResolvedValueOnce(undefined);

      try {
        await service.findLowestLevelStateId();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("create", () => {
    it("should create a new level-state and return it", async () => {
      const oldArraySize = InMemoryLevelStates.length;

      const newLevelState: CreateLevelStateDto = {
        title: "Arquimago",
        requiredXp: 1000,
      };

      const createdLevelState = await service.create(newLevelState);

      expect(createdLevelState).toBeDefined();
      expect(createdLevelState.id).toBeDefined();
      expect(createdLevelState.title).toEqual(newLevelState.title);
      expect(createdLevelState.requiredXp).toEqual(newLevelState.requiredXp);

      expect(prisma.levelState.create).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.create).toHaveBeenCalledWith({
        data: { ...newLevelState },
      });

      expect(InMemoryLevelStates.length).toBeGreaterThan(oldArraySize);
    });

    it("should throw an error if the level state creation fails", async () => {
      const newLevelState: CreateLevelStateDto = {
        title: "Arquimago",
        requiredXp: 1000,
      };
      const oldArraySize = InMemoryLevelStates.length;

      jest
        .spyOn(prisma.levelState, "create")
        .mockRejectedValueOnce(new Error("Failed to create level state"));

      await expect(service.create(newLevelState)).rejects.toThrowError(
        "Failed to create level state"
      );
      expect(prisma.levelState.create).toHaveBeenCalledTimes(2);
      expect(prisma.levelState.create).toHaveBeenCalledWith({
        data: { ...newLevelState },
      });
      expect(InMemoryLevelStates.length).not.toBeGreaterThan(oldArraySize);
    });
  });

  describe("update", () => {
    it("should update an existing level state and return the updated level state", async () => {
      const existingLevelState: LevelState = InMemoryLevelStates[0];

      const updatedLevelStateData: UpdateLevelStateDto = {
        title: "Mestre",
        requiredXp: 200,
      };

      const updatedLevelState: LevelState = {
        id: "1c937b93-b38e-47dd-9fe8-a99b9802ed9e",
        title: "Mestre",
        requiredXp: 200,
      };

      jest
        .spyOn(prisma.levelState, "update")
        .mockResolvedValueOnce(updatedLevelState as any);

      const result = await service.update(
        existingLevelState.id,
        updatedLevelStateData
      );

      expect(result).toEqual(updatedLevelState);
      expect(prisma.levelState.update).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.update).toHaveBeenCalledWith({
        where: { id: existingLevelState.id },
        data: updatedLevelStateData,
      });
    });

    it("should throw an error if the level state does not exist", async () => {
      const nonExistingLevelStateId = "non-existing-id";
      const updatedLevelStateData: UpdateLevelStateDto = {
        title: "Mestre",
        requiredXp: 200,
      };

      jest
        .spyOn(prisma.levelState, "update")
        .mockRejectedValueOnce(new Error());

      await expect(
        service.update(nonExistingLevelStateId, updatedLevelStateData)
      ).rejects.toThrowError();
      expect(prisma.levelState.update).toHaveBeenCalledTimes(2);
      expect(prisma.levelState.update).toHaveBeenCalledWith({
        where: { id: nonExistingLevelStateId },
        data: updatedLevelStateData,
      });
    });

    it("should handle errors during update", async () => {
      const existingLevelState: LevelState = InMemoryLevelStates[0];

      const updatedLevelStateData: UpdateLevelStateDto = {
        title: "Mestre",
        requiredXp: 200,
      };

      const updateError = new Error("Failed to update level state");

      jest
        .spyOn(prisma.levelState, "update")
        .mockRejectedValueOnce(updateError);

      await expect(
        service.update(existingLevelState.id, updatedLevelStateData)
      ).rejects.toThrowError(updateError);
      expect(prisma.levelState.update).toHaveBeenCalledTimes(3);
      expect(prisma.levelState.update).toHaveBeenCalledWith({
        where: { id: existingLevelState.id },
        data: updatedLevelStateData,
      });
    });
  });

  describe("remove", () => {
    it("should remove an existing level state", async () => {
      const existingLevelStateId = "1c937b93-b38e-47dd-9fe8-a99b9802ed9e";

      jest
        .spyOn(prisma.levelState, "delete")
        .mockResolvedValueOnce(existingLevelStateId as any);

      const result = await service.remove(existingLevelStateId);

      expect(result).toEqual(existingLevelStateId);
      expect(prisma.levelState.delete).toHaveBeenCalledTimes(1);
      expect(prisma.levelState.delete).toHaveBeenCalledWith({
        where: { id: existingLevelStateId },
      });
    });

    it("should throw an error if the level state to remove does not exist", async () => {
      const nonExistingLevelStateId = "non-existing-id";

      jest
        .spyOn(prisma.levelState, "delete")
        .mockRejectedValue(new Error("Level state not found"));

      await expect(
        service.remove(nonExistingLevelStateId)
      ).rejects.toThrowError("Level state not found");
      expect(prisma.levelState.delete).toHaveBeenCalledTimes(2);
      expect(prisma.levelState.delete).toHaveBeenCalledWith({
        where: { id: nonExistingLevelStateId },
      });
    });
  });
});
