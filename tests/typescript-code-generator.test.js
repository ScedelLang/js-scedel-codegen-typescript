import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RepositoryBuilder } from '../../scedel-schema/src/index.js';
import { TypeScriptCodeGenerator, TypeScriptCodegenOptions } from '../src/index.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(currentDir, '../../..');
const examplePath = path.join(workspaceRoot, 'example.scedel');

function buildRepository() {
  return new RepositoryBuilder().buildFromFile(examplePath);
}

test('TypeScriptCodeGenerator generates files for record-like custom types', () => {
  const repository = buildRepository();
  const generator = new TypeScriptCodeGenerator();

  const result = generator.generate(
    repository,
    new TypeScriptCodegenOptions({
      outputDir: 'tmp/generated',
      defaultNamespace: 'App.Generated.Scedel',
    }),
  );

  const generatedPaths = result.files.map((file) => file.path).sort();
  assert.deepEqual(generatedPaths, [
    'tmp/generated/Comment.ts',
    'tmp/generated/Post.ts',
    'tmp/generated/PostWithStatus.ts',
  ]);

  const postFile = result.files.find((file) => file.path.endsWith('/Post.ts'));
  assert.ok(postFile);
  assert.ok(postFile.contents.includes('export class Post'));
  assert.equal(postFile.contents.includes('internalNote'), false);

  assert.equal(result.warnings.length, 3);
  assert.deepEqual(
    result.warnings.map((warning) => warning.typeName).sort(),
    ['DateTimeFormatted', 'OddRangedInt', 'PostStatus'],
  );
});

test('TypeScriptCodeGenerator supports interface mode', () => {
  const repository = buildRepository();
  const generator = new TypeScriptCodeGenerator();

  const result = generator.generate(
    repository,
    new TypeScriptCodegenOptions({
      outputDir: 'tmp/generated',
      generateConstructors: false,
    }),
  );

  const postFile = result.files.find((file) => file.path.endsWith('/Post.ts'));
  assert.ok(postFile);
  assert.ok(postFile.contents.includes('export interface Post'));
  assert.equal(postFile.contents.includes('constructor(data = {})'), false);
});
