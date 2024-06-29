import { Test, TestingModule } from '@nestjs/testing';
import { MakesResolver } from './makes.resolver';
import { MakesService } from './makes.service';

describe('MakesResolver', () => {
  let resolver: MakesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MakesResolver, MakesService],
    }).compile();

    resolver = module.get<MakesResolver>(MakesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
