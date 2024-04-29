import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTodo } from './dtos/todo.dto';
import { UpdateTodo } from './dtos/updateTodo.dto';

@Injectable()
export class TodoService {
  private logger = new Logger(TodoService.name);
  constructor(private primaService: PrismaService) {}

  async getAllTodo() {
    return await this.primaService.todo.findMany();
  }

  async getTodo(id: string) {
    const todo = await this.primaService.todo.findUnique({
      where: {
        id: id,
      },
    });

    if (!todo) {
      throw new NotFoundException();
    }

    return todo;
  }

  async createTodo(todoData: CreateTodo): Promise<string> {
    try {
      const res = await this.primaService.todo.create({
        data: {
          ...todoData,
        },
      });

      return res.id;
    } catch (error) {
      this.logger.log(error);
      throw new ConflictException();
    }
  }

  async updateTodo(id: string, todo: UpdateTodo) {
    try {
      console.log(todo);
      const updateTodo = await this.primaService.todo.update({
        where: {
          id: id,
        },
        data: {
          ...todo,
        },
      });

      return updateTodo.id;
    } catch (error) {
      this.logger.log(error);
      throw new UnprocessableEntityException();
    }
  }

  async deleteTodo(id: string) {
    try {
      const res = await this.primaService.todo.delete({
        where: {
          id,
        },
      });

      return res.id;
    } catch (error) {
      this.logger.log(error);
      throw new UnprocessableEntityException();
    }
  }
}
