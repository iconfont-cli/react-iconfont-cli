import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import glob from 'glob';
import colors from 'colors';
import { camelCase, upperFirst } from 'lodash';
import { XmlData } from 'iconfont-parser';
import { Config } from './getConfig';
import { getTemplate } from './getTemplate';
import {
  replaceCases,
  replaceColorFunc,
  replaceComponentName,
  replaceImports,
  replaceNames,
  replaceNamesArray,
  replaceSingleIconContent,
  replaceSize,
  replaceSizeUnit,
  replaceSummaryIcon,
} from './replace';
import { whitespace } from './whitespace';
import { GENERATE_MODE } from './generateMode';

const ATTRIBUTE_FILL_MAP = ['path'];

export const generateComponent = (data: XmlData, config: Config) => {
  const names: string[] = [];
  const imports: string[] = [];
  const saveDir = path.resolve(config.save_dir);
  const jsxExtension = config.use_typescript ? '.tsx' : '.js';
  const jsExtension = config.use_typescript ? '.ts' : '.js';
  let cases: string = '';

  mkdirp.sync(saveDir);
  glob.sync(path.join(saveDir, '*')).forEach((file) => fs.unlinkSync(file));

  if (config.generate_mode === GENERATE_MODE.dependsOn) {
    fs.copyFileSync(
      path.join(__dirname, '..', 'templates', `helper${jsExtension}.template`),
      path.join(saveDir, `helper${jsExtension}`),
    );
  }

  data.svg.symbol.forEach((item) => {
    let singleFile: string;
    const iconId = item.$.id;
    const iconIdAfterTrim = config.trim_icon_prefix
      ? iconId.replace(
        new RegExp(`^${config.trim_icon_prefix}(.+?)$`),
        (_, value) => value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1')
      )
      : iconId;
    const componentName = upperFirst(camelCase(iconId));

    names.push(iconIdAfterTrim);

    cases += `${whitespace(4)}case '${iconIdAfterTrim}':\n`;

    if (config.generate_mode === GENERATE_MODE.allInOne) {
      cases += `${whitespace(6)}return (${generateCase(item, 8)}${whitespace(6)});\n`;

      return;
    }

    imports.push(componentName);
    cases += `${whitespace(6)}return <${componentName} size={size} color={color} {...rest} />;\n`;

    singleFile = getTemplate('SingleIcon' + jsxExtension);
    singleFile = replaceSize(singleFile, config.default_icon_size);
    singleFile = replaceComponentName(singleFile, componentName);
    singleFile = replaceSingleIconContent(singleFile, generateCase(item, 4));
    singleFile = replaceSizeUnit(singleFile, config.unit);

    fs.writeFileSync(path.join(saveDir, componentName + jsxExtension), singleFile);

    if (!config.use_typescript) {
      let typeDefinitionFile = getTemplate('SingleIcon.d.ts');

      typeDefinitionFile = replaceComponentName(typeDefinitionFile, componentName);
      fs.writeFileSync(path.join(saveDir, componentName + '.d.ts'), typeDefinitionFile);
    }

    console.log(`${colors.green('√')} Generated icon "${colors.yellow(iconId)}"`);
  });

  let iconFile =  getTemplate('Icon.' + config.generate_mode + jsxExtension);

  iconFile = replaceSize(iconFile, config.default_icon_size);
  iconFile = replaceCases(iconFile, cases);
  iconFile = replaceImports(iconFile, imports);

  if (config.use_typescript) {
    iconFile = replaceNames(iconFile, names);
  } else {
    iconFile = replaceNamesArray(iconFile, names);

    let typeDefinitionFile = getTemplate(`Icon.${config.generate_mode}.d.ts`);

    typeDefinitionFile = replaceNames(typeDefinitionFile, names);
    typeDefinitionFile = replaceSummaryIcon(typeDefinitionFile, config.summary_component_name);
    fs.writeFileSync(path.join(saveDir, config.summary_component_name + '.d.ts'), typeDefinitionFile);
  }

  if (config.generate_mode === GENERATE_MODE.allInOne) {
    iconFile = replaceColorFunc(iconFile, jsExtension);
    iconFile = replaceSizeUnit(iconFile, config.unit);
  }

  iconFile = replaceSummaryIcon(iconFile, config.summary_component_name);

  fs.writeFileSync(path.join(saveDir, config.summary_component_name + jsxExtension), iconFile);

  console.log(`\n${colors.green('√')} All icons have putted into dir: ${colors.green(config.save_dir)}\n`);
};

const generateCase = (data: XmlData['svg']['symbol'][number], baseIdent: number) => {
  let template = `\n${whitespace(baseIdent)}<svg viewBox="${data.$.viewBox}" width={size} height={size} style={style} {...rest}>\n`;

  for (const domName of Object.keys(data)) {
    if (domName === '$') {
      continue;
    }

    if (!domName) {
      console.error(colors.red(`Unable to transform dom "${domName}"`));
      process.exit(1);
    }

    const counter = {
      colorIndex: 0,
      baseIdent,
    };

    if (data[domName].$) {
      template += `${whitespace(baseIdent + 2)}<${domName}${addAttribute(domName, data[domName], counter)}\n${whitespace(baseIdent + 2)}/>\n`;
    } else if (Array.isArray(data[domName])) {
      data[domName].forEach((sub) => {
        template += `${whitespace(baseIdent + 2)}<${domName}${addAttribute(domName, sub, counter)}\n${whitespace(baseIdent + 2)}/>\n`;
      });
    }
  }

  template += `${whitespace(baseIdent)}</svg>\n`;

  return template;
};

const addAttribute = (domName: string, sub: XmlData['svg']['symbol'][number]['path'][number], counter: { colorIndex: number, baseIdent: number }) => {
  let template = '';

  if (sub && sub.$) {
    if (ATTRIBUTE_FILL_MAP.includes(domName)) {
      // Set default color same as in iconfont.cn
      // And create placeholder to inject color by user's behavior
      sub.$.fill = sub.$.fill || '#333333';
    }

    for (const attributeName of Object.keys(sub.$)) {
      if (attributeName === 'fill') {
        template += `\n${whitespace(counter.baseIdent + 4)}${attributeName}={getIconColor(color, ${counter.colorIndex}, '${sub.$[attributeName]}')}`;
        counter.colorIndex += 1;
      } else {
        template += `\n${whitespace(counter.baseIdent + 4)}${attributeName}="${sub.$[attributeName]}"`;
      }
    }
  }

  return template;
};
