import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Make, MakeSchema } from 'src/schemas/make.schema';

import { MakesService } from './makes.service';
import { MakesResolver } from './makes.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Make.name, schema: MakeSchema }]),
  ],
  providers: [MakesResolver, MakesService],
  exports: [MakesService],
})
export class MakesModule {}
