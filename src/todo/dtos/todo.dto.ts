import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateTodo {
  @IsNotEmpty()
  @MinLength(6)
  title: string;
}
