import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Todo } from '@prisma/client';

describe('TodoService', () => {
  let service: TodoService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: { todo: { findUnique: jest.fn() } },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('getTodo', () => {
    it('should throw NotfoundException', async () => {
      jest.spyOn(prismaService.todo, 'findUnique').mockResolvedValue(null);

      await expect(service.getTodo('1')).rejects.toThrow(NotFoundException);
    });

    it('should find todo by id', async () => {
      const todoId = '1';
      const mockTodo = {
        id: todoId,
        title: 'Learn Nestjs',
        completed: true,
      } as Todo;

      jest.spyOn(prismaService.todo, 'findUnique').mockResolvedValue(mockTodo);

      const result = await service.getTodo(todoId);
      expect(prismaService.todo.findUnique).toHaveBeenCalledWith({
        where: {
          id: todoId,
        },
      });
      expect(result).toEqual(mockTodo);
    });
  });
});
