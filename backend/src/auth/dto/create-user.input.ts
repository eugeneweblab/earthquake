import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsIn(['admin', 'customer'], {
    message: 'Role must be one of the following values: "admin", "customer"',
  })
  role: 'admin' | 'customer';
}
