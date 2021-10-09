export const replaceSize = (content: string, size: number) => {
  return content.replace(/#size#/g, String(size));
};

export const replaceCases = (content: string, cases: string) => {
  return content.replace(/#cases#/g, cases);
};

export const replaceNames = (content: string, names: string[]) => {
  return content.replace(/#names#/g, names.join(`' | '`));
};

export const replaceNamesArray = (content: string, names: string[]) => {
  return content.replace(
    /#namesArray#/g,
    JSON.stringify(names)
      .replace(/"/g, '\'')
      .replace(/','/g, '\', \'')
  );
};

export const replaceComponentName = (content: string, name: string) => {
  return content.replace(/#componentName#/g, name);
};

export const replaceSingleIconContent = (content: string, render: string) => {
  return content.replace(/#iconContent#/g, render);
};

export const replaceImports = (content: string, imports: string[]) => {
  return content.replace(/#imports#/g, imports.map((item) => `import ${item} from './${item}';`).join('\n'));
};

export const replaceSizeUnit = (content: string, unit: string) => {
  return content.replace(/\{size\}/g, `{size + '${unit}'}`);
};

export const replaceExports = (content: string, exports: string[]) => {
  return content.replace(/#exports#/g, exports.map(
    (item) => `export { default as ${item} } from './${item}';`).join('\n')
  );
}