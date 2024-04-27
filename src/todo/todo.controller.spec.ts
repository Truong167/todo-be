import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('getTodo', () => {
    it('Should throw error if todo not found', async () => {
      jest
        .spyOn(todoService, 'getTodo')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getTodo('2')).rejects.toThrow(NotFoundException);
    });
    it('')
  });
});
