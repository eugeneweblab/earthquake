import { InputType, PartialType } from '@nestjs/graphql';

import { CreateEarthquakeInput } from './create-earthquake.input';

@InputType()
export class UpdateEarthquakeInput extends PartialType(CreateEarthquakeInput) {}
