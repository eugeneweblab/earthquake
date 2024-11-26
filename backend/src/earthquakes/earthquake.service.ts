import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEarthquakeInput } from './dto/create-earthquake.input';
import { UpdateEarthquakeInput } from './dto/update-earthquake.input';

@Injectable()
export class EarthquakeService {
  constructor(private prisma: PrismaService) {}

  async findAll(limit: number, skip: number) {
    const earthquakes = await this.prisma.earthquake.findMany({
      take: limit,
      skip: skip,
    });

    const totalCount = await this.prisma.earthquake.count();

    return {
      earthquakes,
      totalCount,
    };
  }

  async create(
    createEarthquakeInput: CreateEarthquakeInput,
    currentUser: JwtPayload,
  ) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new ForbiddenException(
        "You don't have enough permissions to create a center",
      );
    }

    return this.prisma.earthquake.create({
      data: createEarthquakeInput,
    });
  }

  async update(
    id: string,
    updateEarthquakeInput: UpdateEarthquakeInput,
    currentUser: JwtPayload,
  ) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new ForbiddenException(
        "You don't have enough permissions to create a center",
      );
    }

    const earthquake = await this.prisma.earthquake.findUnique({
      where: { id },
    });

    if (!earthquake) {
      throw new NotFoundException(`Earthquake with id ${id} not found`);
    }

    return this.prisma.earthquake.update({
      where: { id },
      data: updateEarthquakeInput,
    });
  }

  async remove(id: string, currentUser: JwtPayload) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new ForbiddenException(
        "You don't have enough permissions to create a center",
      );
    }

    const earthquake = await this.prisma.earthquake.findUnique({
      where: { id },
    });

    if (!earthquake) {
      throw new NotFoundException(`Earthquake with id ${id} not found`);
    }

    await this.prisma.earthquake.delete({
      where: { id },
    });
    return true;
  }
}
