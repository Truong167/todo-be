import {
  ConflictException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { TodoService } from './todo.service';
import { UpdateTodo } from './dtos/updateTodo.dto';

// jest.mock('@nestjs/common', () => ({
//   ...jest.requireActual('@nestjs/common'),
//   Logger: jest.fn().mockImplementation(() => ({
//     log: jest.fn(),
//   })),
// }));

describe('TodoService', () => {
  const mockLogger: jest.Mocked<Logger> = {
    log: jest.fn(),
  } as any;
  let service: TodoService;
  let prismaService: PrismaService;

  // mockLogger = {
  //   log: jest.fn(),
  // } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
    service['logger'] = mockLogger;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(mockLogger).toBeDefined();
  });

  describe('getAllTodo', () => {
    it('should return an array of todo', async () => {
      const mockTodos = [
        {
          id: '1',
          title: 'Learn Nest',
          completed: true,
        },
        {
          id: '2',
          title: 'Learn Next',
          completed: false,
        },
      ] as Todo[];

      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue(mockTodos);
      const result = await service.getAllTodo();
      expect(prismaService.todo.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockTodos);
    });
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

  describe('Create Todo', () => {
    it('should throw error if title conflicts with database', async () => {
      const error = new Error('Title already exists');
      const newTodo = {
        title: 'Learn Nest',
        completed: false,
      };

      jest.spyOn(prismaService.todo, 'create').mockRejectedValue(error);

      // Expect the exception to be thrown
      await expect(service.createTodo(newTodo)).rejects.toThrow(
        ConflictException,
      );

      expect(mockLogger.log).toHaveBeenCalledTimes(1);
      expect(mockLogger.log).toHaveBeenCalledWith(error);
    });

    it('create new todo successfully', async () => {
      const todoId = '1';
      const newTodo: Todo = {
        id: todoId,
        title: 'Learn Nest1',
        completed: false,
        createdAt: undefined,
        updatedAt: undefined,
      };

      jest.spyOn(prismaService.todo, 'create').mockResolvedValue(newTodo);

      const result = await service.createTodo(newTodo);

      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: {
          ...newTodo,
        },
      });
      expect(result).toBe(todoId);
    });
  });
  describe('updateTodo', () => {
    it('should throw error if todo not found', async () => {
      const error = new Error('Todo not found');
      const todoId = '1';
      const body: UpdateTodo = {
        title: 'Learn',
        completed: false,
      };
      jest.spyOn(prismaService.todo, 'update').mockRejectedValue(error);

      await expect(service.updateTodo(todoId, body)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('update todo successfully', async () => {
      const todoId = '1';

      const body: UpdateTodo = {
        title: 'Learn',
        completed: false,
      };

      const todoUpdate = {
        id: todoId,
        title: 'Learn Nest1',
        completed: false,
        createdAt: undefined,
        updatedAt: undefined,
      };

      jest.spyOn(prismaService.todo, 'update').mockResolvedValue(todoUpdate);

      const result = await service.updateTodo(todoId, body);

      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: {
          id: todoId,
        },
        data: {
          ...body,
        },
      });
      expect(result).toBe(todoId);
    });
  });

  describe('Delete Todo', () => {
    it('Should throw error if todo not found', async () => {
      const error = new Error('Todo not found');

      jest.spyOn(prismaService.todo, 'delete').mockRejectedValue(error);

      await expect(service.deleteTodo('1')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('Delete todo successfully', async () => {
      const todoId = '1';
      const mockTodo = {
        id: todoId,
        title: 'Learn Nest1',
        completed: false,
        createdAt: undefined,
        updatedAt: undefined,
      };

      jest.spyOn(prismaService.todo, 'delete').mockResolvedValue(mockTodo);

      const result = await service.deleteTodo(todoId);

      expect(prismaService.todo.delete).toHaveBeenCalledWith({
        where: {
          id: todoId,
        },
      });
      expect(result).toBe(todoId);
    });
  });
});
