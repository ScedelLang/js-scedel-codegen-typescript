# @scedel/codegen-typescript

<img src="https://raw.githubusercontent.com/ScedelLang/grammar/5f1e7572f328d657c726a2fcaeaf53d9f6863d6a/logo.svg" width="250px" alt="logo" />

Generates TypeScript DTOs from Scedel `SchemaRepository`.

## RFC support

- [Target RFC: `0.14.2`](https://github.com/ScedelLang/grammar/blob/main/RFC-Scedel-0.14.2.md)

## API usage

```js
import { TypeScriptCodeGenerator, TypeScriptCodegenOptions } from '@scedel/codegen-typescript';

const generator = new TypeScriptCodeGenerator();
const result = generator.generate(repository, new TypeScriptCodegenOptions({
  outputDir: 'src/generated/scedel',
  defaultNamespace: 'App.Generated.Scedel'
}));
```

## CLI

```bash
node js/scedel-codegen-typescript/bin/generate-typescript.mjs \
  --output-dir src/generated/scedel \
  --namespace App.Generated.Scedel \
  /absolute/path/schema.scedel
```
