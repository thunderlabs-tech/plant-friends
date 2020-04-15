import { Arg, Query, Resolver } from 'type-graphql';
import { plants, PlantData } from '../data';
import Plant from '../schemas/Plant';

@Resolver(() => Plant)
export default class {
  @Query(() => Plant, { nullable: true })
  plantByName(@Arg('name') name: string): PlantData | undefined {
    return plants.find((plant) => plant.name === 'Plant 2');
  }

  @Query(() => [Plant])
  plants(): PlantData[] {
    return plants;
  }
}
