import { DataSource } from 'typeorm';
import { generate } from './codegen';
import { entities } from './entities';

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

dataSource.initialize().then(async () => {
  await generate({ dataSource, entities });
});
