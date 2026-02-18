export class TypeScriptCodegenOptions {
  constructor({
    outputDir = 'src/generated/scedel',
    defaultNamespace = 'App.Generated.Scedel',
    generateConstructors = true,
  } = {}) {
    this.outputDir = outputDir;
    this.defaultNamespace = defaultNamespace;
    this.generateConstructors = generateConstructors;
  }
}
