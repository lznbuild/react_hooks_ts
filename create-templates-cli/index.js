#!/usr/bin/env node

const inquirer = require('inquirer');
const mkdirp = require('mkdirp');

const translation = require('./utils/translation.js');

const maker = require(`./generator/document-maker`);
const { transComponentName, formatTemplatePath, formatCreateSourcePath } = translation;
const { createHtmlOrCss } = maker;

inquirer
  .prompt([
    {
      type: 'list',
      name: 'templateType',
      message: '1. 请选择生成的文件类型',
      choices: [
        {
          name: 'component',
          value: 'component',
        },
        {
          name: 'page',
          value: 'page',
        },
      ],
      default: 0,
    },
    {
      type: 'input',
      name: 'templateName',
      message: '2. 请输入需要新生成的文件名称',
      validate: (val) => {
        if (val.length) {
          return true;
        }
        return '此输入不能为空';
      },
      default: '',
    },
  ])
  .then(function (result) {
    const { templateType, templateName } = result;

    const PATH_CREATE = {
      component: __dirname.replace('create-templates-cli', `src/component`),
      page: __dirname.replace('create-templates-cli', `src/page`),
    };

    const prefix = templateType === 'component' ? 'Component' : 'Page';
    const componentName = transComponentName(templateName, prefix);


    // 生成的文件地址
    const basePath = PATH_CREATE[templateType];
    const dirPath = `${basePath}/${componentName}`;

    const [tsxPath, cssPath] = formatCreateSourcePath(dirPath, templateName);

    // 获取模板地址
    const tmpPath = `${__dirname}/templates`;
    const dialogTypeTmpPath = `${tmpPath}/${templateType}-templates`;

    const [tsxTmpPath, cssTmpPath] = formatTemplatePath(dialogTypeTmpPath);

    mkdirp(dirPath, (err) => {
      if (err) {
        process.exit();
      } else {
        const createSourceList = [
          createHtmlOrCss(tsxPath, tsxTmpPath, templateName, prefix),
          createHtmlOrCss(cssPath, cssTmpPath, templateName, prefix),
        ];


        Promise.all(createSourceList);
      }
    });
  });
