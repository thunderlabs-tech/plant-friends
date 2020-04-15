import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import PlantResolver from '../resolvers/PlantResolver';

buildSchema({
  resolvers: [PlantResolver],
  emitSchemaFile: true,
});
