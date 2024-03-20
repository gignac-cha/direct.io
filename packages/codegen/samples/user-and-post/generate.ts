import { resolve } from 'path';
import { generateSourceFile } from '../../src/index';

const interfaces: Interface[] = [
  {
    name: 'User',
    properties: [
      { name: 'uuid', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'email', type: 'string' },
      { name: 'createdAt', type: 'string' },
      { name: 'updatedAt', type: 'string' },
    ],
  },
  {
    name: 'Post',
    properties: [
      { name: 'uuid', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'content', type: 'string' },
      { name: 'createdBy', type: () => 'User' },
      { name: 'createdAt', type: 'string' },
      { name: 'updatedAt', type: 'string' },
    ],
  },
];

const entities: FakeEntity[] = [
  {
    entityName: 'Post',
    keyColumn: { type: 'string', name: 'uuid' },
  },
];

generateSourceFile({ outputPath: resolve('samples/user-and-post/build'), interfaces, entities });
