import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Todo } from '@prisma/client';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getTodo: jest.fn(),
            getAllTodo: jest.fn(),
            createTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('getTodo', () => {
    it('Should throw error if todo not found', async () => {
      jest
        .spyOn(todoService, 'getTodo')
        .mockRejectedValue(new NotFoundException());

      await expect(todoController.getTodo('2')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('Should return todo data by id', async () => {
      const todoId = '1';
      const mockTodo = {
        id: todoId,
        title: 'Learn Nest',
        completed: true,
      } as Todo;

      jest.spyOn(todoService, 'getTodo').mockResolvedValue(mockTodo);
      const result = await todoController.getTodo(todoId);
      expect(result).toEqual(mockTodo);
    });
  });

  describe('get all todo', () => {
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

      jest.spyOn(todoService, 'getAllTodo').mockResolvedValue(mockTodos);
      const result = await todoController.getAllTodo();

      expect(todoService.getAllTodo).toHaveBeenCalled();
      expect(result).toEqual(mockTodos);
    });
  });

  describe('create todo', () => {
    it('should throw error if title conflicts with database', async () => {
      const newTodo = {
        title: 'Learn Nest',
        completed: false,
      };
      jest
        .spyOn(todoService, 'createTodo')
        .mockRejectedValue(new ConflictException());

      await expect(todoController.createTodo(newTodo)).rejects.toThrow(
        ConflictException,
      );
    });
    it('create todo successfully', async () => {
      const newTodo = {
        title: 'Learn Nest',
        completed: false,
      };
      const todoId = '1';
      jest.spyOn(todoService, 'createTodo').mockResolvedValue(todoId);

      const result = await todoController.createTodo(newTodo);
      expect(todoService.createTodo).toHaveBeenCalledWith(newTodo);
      expect(result).toEqual(todoId);
    });
  });

  describe('update todo', () => {
    it('should throw error if todo not found', async () => {
      const todoId = '1';
      const updateTodo = {
        title: 'Learn Nest',
        completed: false,
      };
      jest
        .spyOn(todoService, 'updateTodo')
        .mockRejectedValue(new NotFoundException());

      await expect(
        todoController.updateTodo(todoId, updateTodo),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update todo successfully', async () => {
      const todoId = '1';
      const updateTodo = {
        title: 'Learn Nest',
        completed: false,
      };
      jest.spyOn(todoService, 'updateTodo').mockResolvedValue(todoId);
      const result = await todoController.updateTodo(todoId, updateTodo);
      expect(todoService.updateTodo).toHaveBeenCalledWith(todoId, updateTodo);
      expect(result).toEqual(todoId);
    });
  });
});
