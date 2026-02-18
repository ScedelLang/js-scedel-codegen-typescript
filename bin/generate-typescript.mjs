#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { RepositoryBuilder } from '../../scedel-schema/src/index.js';
import { TypeScriptCodeGenerator, TypeScriptCodegenOptions } from '../src/index.js';

const args = process.argv.slice(2);

let outputDir = 'src/generated/scedel';
let namespace = 'App.Generated.Scedel';
let noConstructor = false;
const positionals = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--output-dir') {
    outputDir = args[i + 1] ?? outputDir;
    i++;
    continue;
  }

  if (arg === '--namespace') {
    namespace = args[i + 1] ?? namespace;
    i++;
    continue;
  }

  if (arg === '--no-constructor') {
    noConstructor = true;
    continue;
  }

  if (arg.startsWith('--')) {
    console.error('Usage:');
    console.error('  generate-typescript [--output-dir <dir>] [--namespace <ns>] [--no-constructor] <schema.scedel>');
    process.exit(2);
  }

  positionals.push(arg);
}

if (positionals.length !== 1) {
  console.error('Usage:');
  console.error('  generate-typescript [--output-dir <dir>] [--namespace <ns>] [--no-constructor] <schema.scedel>');
  process.exit(2);
}

const schemaPath = path.resolve(positionals[0]);

try {
  const repository = new RepositoryBuilder().buildFromFile(schemaPath);
  const options = new TypeScriptCodegenOptions({
    outputDir,
    defaultNamespace: namespace,
    generateConstructors: !noConstructor,
  });

  const result = new TypeScriptCodeGenerator().generate(repository, options);

  let generatedCount = 0;
  for (const file of result.files) {
    const absolutePath = path.resolve(file.path);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, file.contents, 'utf8');
    generatedCount++;
    console.log(`generated: ${absolutePath}`);
  }

  console.log(`\nGenerated ${generatedCount} file(s).`);

  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of result.warnings) {
      const prefix = warning.typeName ?? 'schema';
      console.log(`- [${warning.code}] ${prefix}: ${warning.message}`);
    }
  }
} catch (error) {
  console.error('Failed to generate TypeScript files:');
  console.error(`- ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}
