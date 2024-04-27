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
  getAllTodo(): Promise<Todo[]> {
    return this.todoService.getAllTodo();
  }

  @Get('/:id')
  getTodo(@Param('id') id: string) {
    return this.todoService.getTodo(id);
  }

  @Post()
  createTodo(@Body() body: CreateTodo) {
    return this.todoService.createTodo(body);
  }

  @Patch('/:id')
  updateTodo(@Param('id') id: string, @Body() body: UpdateTodo) {
    return this.todoService.updateTodo(id, body);
  }

  @Delete('/:id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodo(id);
  }
}
