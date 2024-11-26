import { Module } from '@nestjs/common';

import { EarthquakeResolver } from './earthquake.resolver';
import { EarthquakeService } from './earthquake.service';

@Module({
  imports: [],
  providers: [EarthquakeService, EarthquakeResolver],
})
export class EarthquakeModule {}
