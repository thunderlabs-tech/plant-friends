import { Field, ObjectType } from 'type-graphql';
import * as gq from 'type-graphql';

@ObjectType()
export default class Plant {
  @Field()
  name: string;

  @Field()
  wateredAt: string;

  @Field(() => gq.Int)
  wateringPeriodInDays: number;
}
