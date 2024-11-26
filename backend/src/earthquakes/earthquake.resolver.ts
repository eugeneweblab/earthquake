import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEarthquakeInput } from './dto/create-earthquake.input';
import { UpdateEarthquakeInput } from './dto/update-earthquake.input';
import { EarthquakeService } from './earthquake.service';
import { Earthquake } from './models/earthquake.model';

@ObjectType()
export class EarthquakeResult {
  @Field(() => [Earthquake])
  earthquakes: Earthquake[];

  @Field(() => Int)
  totalCount: number;
}

@Resolver(() => Earthquake)
@UseGuards(JwtAuthGuard)
export class EarthquakeResolver {
  constructor(private earthquakeService: EarthquakeService) {}

  @Query(() => EarthquakeResult)
  async earthquakes(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.earthquakeService.findAll(limit, skip);
  }

  @Mutation(() => Earthquake)
  async createEarthquake(
    @Args('createEarthquakeInput') createEarthquakeInput: CreateEarthquakeInput,
    @Context() context,
  ) {
    const user = context.req.user;

    return this.earthquakeService.create(createEarthquakeInput, user);
  }

  @Mutation(() => Earthquake)
  async updateEarthquake(
    @Args('id') id: string,
    @Args('updateEarthquakeInput') updateEarthquakeInput: UpdateEarthquakeInput,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.earthquakeService.update(id, updateEarthquakeInput, user);
  }

  @Mutation(() => Boolean)
  async deleteEarthquake(@Args('id') id: string, @Context() context) {
    const user = context.req.user;
    return this.earthquakeService.remove(id, user);
  }
}
