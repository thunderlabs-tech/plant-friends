import { GraphQLServer } from 'graphql-yoga';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import PlantResolver from './resolvers/PlantResolver';

async function bootstrap(): Promise<void> {
  const schema = await buildSchema({
    resolvers: [PlantResolver],
    emitSchemaFile: true,
  });

  const server = new GraphQLServer({
    schema,
  });

  server.start(() => console.log('Server is running on http://localhost:4000'));
}

bootstrap();
