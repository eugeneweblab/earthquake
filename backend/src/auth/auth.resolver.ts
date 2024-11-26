import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { User } from './entities/user.entity';

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  data: User;

  @Field()
  token: string;
}

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.loginUser(loginUserInput);
  }

  @Mutation(() => User)
  async register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.createUser(createUserInput);
  }
}
