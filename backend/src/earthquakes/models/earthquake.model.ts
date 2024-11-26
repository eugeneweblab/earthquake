import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Earthquake {
  @Field()
  id: string;

  @Field()
  location: string;

  @Field()
  magnitude: number;

  @Field()
  date: Date;
}
