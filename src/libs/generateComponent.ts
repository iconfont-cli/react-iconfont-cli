import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import glob from "glob";
import colors from "colors";
import { camelCase, upperFirst } from "lodash";
import { XmlData } from "iconfont-parser";
import { Config } from "./getConfig";
import { getTemplate } from "./getTemplate";
import {
  replaceReactName,
  replaceCases,
  replaceComponentName,
  replaceExports,
  replaceImports,
  replaceNames,
  replaceNamesArray,
  replaceSingleIconContent,
  replaceSize,
  replaceSizeUnit,
} from "./replace";
import { whitespace } from "./whitespace";
import { copyTemplate } from "./copyTemplate";

const ATTRIBUTE_FILL_MAP = ["path"];

export const generateComponent = (data: XmlData, config: Config) => {
  const names: string[] = [];
  const imports: string[] = [];
  const saveDir = path.resolve(config.save_dir);
  const jsxExtension = config.use_typescript ? ".tsx" : ".js";
  const jsExtension = config.use_typescript ? ".ts" : ".js";
  let cases: string = "";

  mkdirp.sync(saveDir);
  glob.sync(path.join(saveDir, "*")).forEach((file) => fs.unlinkSync(file));

  copyTemplate(
    `helper${jsExtension}`,
    path.join(saveDir, `helper${jsExtension}`)
  );
  if (!config.use_typescript) {
    copyTemplate("helper.d.ts", path.join(saveDir, "helper.d.ts"));
  }

  data.svg.symbol.forEach((item) => {
    let singleFile: string;
    const iconId = item.$.id;
    const iconIdAfterTrim = config.trim_icon_prefix
      ? iconId.replace(
          new RegExp(`^${config.trim_icon_prefix}(.+?)$`),
          (_, value) => value.replace(/^[-_.=+#@!~*]+(.+?)$/, "$1")
        )
      : iconId;
    const componentName = upperFirst(camelCase(iconId));

    names.push(iconIdAfterTrim);

    cases += `${whitespace(4)}case '${iconIdAfterTrim}':\n`;

    imports.push(componentName);
    cases += `${whitespace(6)}return <${componentName} {...rest} />;\n`;

    singleFile = getTemplate("SingleIcon" + jsxExtension);
    singleFile = replaceSize(singleFile, config.default_icon_size);

    if (jsxExtension === ".tsx") {
      singleFile = replaceReactName(singleFile, config.can_import_react);
    }

    singleFile = replaceComponentName(singleFile, componentName);
    singleFile = replaceSingleIconContent(singleFile, generateCase(item, 4));
    singleFile = replaceSizeUnit(singleFile, config.unit);

    fs.writeFileSync(
      path.join(saveDir, componentName + jsxExtension),
      singleFile
    );

    if (!config.use_typescript) {
      let typeDefinitionFile = getTemplate("SingleIcon.d.ts");

      typeDefinitionFile = replaceComponentName(
        typeDefinitionFile,
        componentName
      );
      fs.writeFileSync(
        path.join(saveDir, componentName + ".d.ts"),
        typeDefinitionFile
      );
    }

    console.log(
      `${colors.green("√")} Generated icon "${colors.yellow(iconId)}"`
    );
  });

  let iconFile = getTemplate("Icon" + jsxExtension);

  iconFile = replaceCases(iconFile, cases);
  iconFile = replaceImports(iconFile, imports);
  iconFile = replaceExports(iconFile, imports);

  if (config.use_typescript) {
    iconFile = replaceNames(iconFile, names);
  } else {
    iconFile = replaceNamesArray(iconFile, names);

    let typeDefinitionFile = getTemplate(`Icon.d.ts`);

    typeDefinitionFile = replaceExports(typeDefinitionFile, imports);
    typeDefinitionFile = replaceNames(typeDefinitionFile, names);
    fs.writeFileSync(path.join(saveDir, "index.d.ts"), typeDefinitionFile);
  }

  fs.writeFileSync(path.join(saveDir, "index" + jsxExtension), iconFile);

  console.log(
    `\n${colors.green("√")} All icons have putted into dir: ${colors.green(
      config.save_dir
    )}\n`
  );
};

const generateCase = (
  data: XmlData["svg"]["symbol"][number],
  baseIdent: number
) => {
  let template = `\n${whitespace(baseIdent)}<svg viewBox="${
    data.$.viewBox
  }" width={size} height={size} style={style} {...rest}>\n`;

  for (const domName of Object.keys(data)) {
    if (domName === "$") {
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
      template += `${whitespace(baseIdent + 2)}<${domName}${addAttribute(
        domName,
        data[domName],
        counter
      )}\n${whitespace(baseIdent + 2)}/>\n`;
    } else if (Array.isArray(data[domName])) {
      data[domName].forEach((sub) => {
        template += `${whitespace(baseIdent + 2)}<${domName}${addAttribute(
          domName,
          sub,
          counter
        )}\n${whitespace(baseIdent + 2)}/>\n`;
      });
    }
  }

  template += `${whitespace(baseIdent)}</svg>\n`;

  return template;
};

const addAttribute = (
  domName: string,
  sub: XmlData["svg"]["symbol"][number]["path"][number],
  counter: { colorIndex: number; baseIdent: number }
) => {
  let template = "";

  if (sub && sub.$) {
    if (ATTRIBUTE_FILL_MAP.includes(domName)) {
      // Set default color same as in iconfont.cn
      // And create placeholder to inject color by user's behavior
      sub.$.fill = sub.$.fill || "#333333";
    }

    for (const attributeName of Object.keys(sub.$)) {
      if (attributeName === "fill") {
        template += `\n${whitespace(counter.baseIdent + 4)}${camelCase(
          attributeName
        )}={getIconColor(color, ${counter.colorIndex}, '${
          sub.$[attributeName]
        }')}`;
        counter.colorIndex += 1;
      } else {
        template += `\n${whitespace(counter.baseIdent + 4)}${camelCase(
          attributeName
        )}="${sub.$[attributeName]}"`;
      }
    }
  }

  return template;
};
