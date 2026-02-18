# @scedel/codegen-typescript

Generates TypeScript DTOs from SCEDel `SchemaRepository`.

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
