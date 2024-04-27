import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTodo } from './dtos/todo.dto';
import { UpdateTodo } from './dtos/updateTodo.dto';

@Injectable()
export class TodoService {
  logger = new Logger(TodoService.name);
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
      this.logger.log(error.message);
      throw new ConflictException();
    }
  }

  async updateTodo(id: string, todo: UpdateTodo) {
    try {
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
      if (error.code === 'P2025') {
        this.logger.log(error.meta.cause);
      } else {
        throw new ConflictException();
      }
    }
  }

  async deleteTodo(id: string) {
    try {
      await this.primaService.todo.delete({
        where: {
          id,
        },
      });

      return { message: 'Delete Successfully' };
    } catch (error) {
      this.logger.log(error.meta.cause);
    }
  }
}
