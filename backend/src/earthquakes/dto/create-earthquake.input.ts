import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsNumber, IsString, Matches } from 'class-validator';

@InputType()
export class CreateEarthquakeInput {
  @Field()
  @IsString()
  @Matches(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, {
    message: 'Location should be in the format "latitude,longitude"',
  })
  location: string;

  @Field()
  @IsNumber()
  magnitude: number;

  @Field()
  @IsDateString()
  date: string;
}
