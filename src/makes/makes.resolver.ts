import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MakesService } from './makes.service';
import { Make } from './models/make.model';

@Resolver(Make)
export class MakesResolver {
  constructor(private readonly makesService: MakesService) {}

  @Query(() => Make)
  async getMake(@Args('id') id: string): Promise<Make> {
    return await this.makesService.findMake(id);
  }

  @Query(() => [Make])
  async getMakes(
    @Args('page', { type: () => Int }) page: number,
  ): Promise<Make[]> {
    return await this.makesService.findMakes(page);
  }
}
