import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTodo } from './todo.dto';

export class UpdateTodo extends CreateTodo {
  @IsOptional()
  title: string;

  @IsBoolean()
  completed: boolean;
}
