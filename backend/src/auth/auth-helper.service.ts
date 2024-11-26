import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthHelperService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Common function to check if the user exists by email
  async checkIfUserExists(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }
    return user;
  }

  // Hash the password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10
  }

  // Generate a JWT token for the user
  generateToken(user: any) {
    return this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  // Validate the input password against the stored hashed password
  async validatePassword(inputPassword: string, storedPassword: string) {
    return bcrypt.compare(inputPassword, storedPassword); // Compare plain password with stored hash
  }

  async validateUser(payload: JwtPayload) {
    const user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    return user || null;
  }
}
