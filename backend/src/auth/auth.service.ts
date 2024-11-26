import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthHelperService } from './auth-helper.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHelper: AuthHelperService,
  ) {}

  async loginUser(loginUserDto: LoginUserInput) {
    const { email, password } = loginUserDto;

    const user = await this.authHelper.findUserByEmail(email);

    const isPasswordValid = await this.authHelper.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      data: user,
      token: this.authHelper.generateToken(user),
    };
  }

  async createUser(data: CreateUserInput) {
    const { ...userData } = data;

    await this.authHelper.checkIfUserExists(data.email);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: await this.authHelper.hashPassword(data.password),
      },
    });
  }
}
