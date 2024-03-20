import { mkdir, writeFile } from 'fs/promises';
import { format } from 'prettier';
import {
  EmitHint,
  Node,
  ScriptTarget,
  createPrinter,
  createSourceFile,
} from 'typescript';
import { createExports } from './utilities/export';
import { createImports } from './utilities/import';
import { createInterfaces } from './utilities/interface';
import { createRequest } from './utilities/request';
import { createMutations } from './utilities/useMutation';
import { createQueries } from './utilities/useQuery';

const printNode = (node: Node) =>
  createPrinter().printNode(
    EmitHint.Unspecified,
    node,
    createSourceFile('', '', ScriptTarget.Latest),
  );

const getSource = (node: Node) => printNode(node);

const formatSource = async (source: string) =>
  format(source, { singleQuote: true, parser: 'typescript' });

const generateDefinitionFile = async ({
  interfaces,
}: {
  interfaces: Interface[];
}) => {
  const formattedSources = await Promise.all(
    createInterfaces({
      interfaces,
    }).map((node) => formatSource(getSource(node))),
  );
  return formattedSources.join('\n');
};

const generateQueryFile = async ({ entities }: { entities: FakeEntity[] }) => {
  const formattedSources = await Promise.all(
    [
      createImports(),
      ...createRequest(),
      ...entities
        .map(({ entityName, keyColumn }) => [
          ...createQueries({ entityName, keyColumn }),
          ...createMutations({ entityName, keyColumn }),
        ])
        .flat(),
      ...createExports({
        entityNames: entities.map(({ entityName }) => entityName),
      }),
    ].map((node) => formatSource(getSource(node))),
  );
  return formattedSources.join('\n');
};

export const generateSourceFile = async ({
  outputPath = 'dist',
  interfaces,
  entities,
}: {
  outputPath?: string;
  interfaces: Interface[];
  entities: FakeEntity[];
}) => {
  await mkdir(outputPath, { recursive: true });

  await writeFile(
    `${outputPath}/__generated.d.ts`,
    await generateDefinitionFile({ interfaces }),
  );
  await writeFile(
    `${outputPath}/__generated.ts`,
    await generateQueryFile({ entities }),
  );
};
