import fastifyCors from '@fastify/cors';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { DataSource } from 'typeorm';
import { generate } from './codegen';
import { entities } from './entities';
import { entityKeyMap, entityNameMap } from './store';

const server = fastify({ logger: true });

server.register(fastifyCors);

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'direct',
  password: 'direct',
  database: 'direct',
  synchronize: true,
  entities,
  logging: true,
});

server.get(
  '/:resourceName/:resourceKeyValue?',
  async (
    request: FastifyRequest<{
      Params: { resourceName: string; resourceKeyValue: string };
    }>,
  ) => {
    const { resourceName, resourceKeyValue } = request.params;
    const entityName = entityNameMap.get(resourceName) ?? 'invalid-entity-name';
    const repository = dataSource.getRepository(entityName);
    if (!resourceKeyValue) {
      const primaryColumnName =
        dataSource.getMetadata(entityName).primaryColumns.at(0)?.propertyName ??
        'invalid-column-name';
      return repository.find({ order: { [primaryColumnName]: 'desc' } });
    }
    const rseourceKeyName = entityKeyMap.get(entityName) ?? 'invalid-key-name';
    return repository.findOne({
      where: { [rseourceKeyName]: resourceKeyValue },
    });
  },
);

server.post(
  '/:resourceName',
  async (
    request: FastifyRequest<{
      Params: { resourceName: string };
      Body: Record<string, unknown>;
    }>,
  ) => {
    const { resourceName } = request.params;
    const entityName = entityNameMap.get(resourceName) ?? 'invalid-entity-name';
    const repository = dataSource.getRepository(entityName);
    const entity = repository.create();
    for (const key in request.body) {
      entity[key] = request.body[key];
    }
    return repository.save(entity);
  },
);

server.put(
  '/:resourceName/:resourceKeyValue',
  async (
    request: FastifyRequest<{
      Params: { resourceName: string; resourceKeyValue: string };
      Body: Record<string, unknown>;
    }>,
    reply: FastifyReply,
  ) => {
    const { resourceName, resourceKeyValue } = request.params;
    if (!resourceKeyValue) {
      reply.status(400);
      throw reply;
    }
    const entityName = entityNameMap.get(resourceName) ?? 'invalid-entity-name';
    const repository = dataSource.getRepository(entityName);
    const rseourceKeyName = entityKeyMap.get(entityName) ?? 'invalid-key-name';
    try {
      const entity = await repository.findOne({
        where: { [rseourceKeyName]: resourceKeyValue },
      });
      if (!entity) {
        reply.callNotFound();
        return;
      }
      for (const key in request.body) {
        entity[key] = request.body[key];
      }
      return repository.save(entity);
    } catch (error) {
      reply.callNotFound();
    }
  },
);

server.delete(
  '/:resourceName/:resourceKeyValue',
  async (
    request: FastifyRequest<{
      Params: { resourceName: string; resourceKeyValue: string };
      Body: Record<string, unknown>;
    }>,
    reply: FastifyReply,
  ) => {
    const { resourceName, resourceKeyValue } = request.params;
    if (!resourceKeyValue) {
      reply.status(400);
      throw reply;
    }
    const entityName = entityNameMap.get(resourceName) ?? 'invalid-entity-name';
    const repository = dataSource.getRepository(entityName);
    const rseourceKeyName = entityKeyMap.get(entityName) ?? 'invalid-key-name';
    try {
      const entity = await repository.findOne({
        where: { [rseourceKeyName]: resourceKeyValue },
      });
      if (!entity) {
        reply.callNotFound();
        return;
      }
      return repository.remove(entity);
    } catch (error) {
      reply.callNotFound();
    }
  },
);

server.addHook('onClose', async () => {
  await dataSource.destroy();
});

server.listen({ port: 3000 }).then(async () => {
  await dataSource.initialize();
  await generate({ dataSource, entities });
});
