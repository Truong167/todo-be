import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { CreateTodo } from './dtos/todo.dto';
import { UpdateTodo } from './dtos/updateTodo.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getAllTodo(): Promise<Todo[]> {
    return this.todoService.getAllTodo();
  }

  @Get('/:id')
  async getTodo(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getTodo(id);
  }

  @Post()
  async createTodo(@Body() body: CreateTodo): Promise<string> {
    return this.todoService.createTodo(body);
  }

  @Patch('/:id')
  async updateTodo(
    @Param('id') id: string,
    @Body() body: UpdateTodo,
  ): Promise<string> {
    return this.todoService.updateTodo(id, body);
  }

  @Delete('/:id')
  async deleteTodo(@Param('id') id: string): Promise<string> {
    return this.todoService.deleteTodo(id);
  }
}
