/*
  生成驼峰名
  例子：
  * @param 'zdt-module-select'
  * @return 'zdtModuleSelectComponent'
*/
function transComponentName(tmpName, postfix) {
  const newName =
    tmpName[0].toUpperCase() +
    tmpName.slice(1).replace(/[-_\s]+(.)?/g, function (match, c) {
      return c ? c.toUpperCase() : '';
    });

  return newName + postfix;
}

// 中划线化
function transDasherizeName(tmpName) {
  return tmpName
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase();
}

// import line 查找
function searchLastDataForRegExp(list) {
  let importIndex = -1;

  const regExp = /^import {/;

  list.forEach((line, index) => {
    if (regExp.test(line)) {
      importIndex = index;
    }
  });

  return importIndex;
}

// declaration查找
function searchDeclarationsForRegExp(list) {
  const declarationsInfo = {
    isSameLine: true,
    index: -1,
  };

  const preReg = /^@NgModule\(\{/;
  const regExp = /^declarations:/;

  list.forEach((line, index) => {
    const commonLine = line.replace(/\s/g, '');
    if (regExp.test(commonLine) && preReg.test(list[index - 1].replace(/\s/g, ''))) {
      if (/,/g.test(commonLine)) {
        // 同行
        declarationsInfo.index = index;
      } else {
        // 换行
        for (let i = index; i < list.length; i++) {
          if (list[i].replace(/\s/g, '') === '],' || list[i].replace(/\s/g, '') === ']') {
            declarationsInfo.index = i - 1;
            declarationsInfo.isSameLine = false;
            break;
          }
        }
      }
    }
  });

  return declarationsInfo;
}

// route 查找
function searchRouteForRegExp(list) {
  let routeIndex = -1;

  const redirectReg = /^{path:'',redirectTo:/;
  const regExp = /^{path:'[\w|-]+',component:\w+}/;

  list.forEach((line, index) => {
    if (regExp.test(line.replace(/\s/g, '')) || redirectReg.test(line.replace(/\s/g, ''))) {
      routeIndex = index;
    }
  });

  return routeIndex;
}

// exports 查找
function searchExportsForRegExp(list) {
  const exportsInfo = {
    index: -1,
    isSameLine: true,
  };

  const exportsReg = /^exports:/;

  list.forEach((line, index) => {
    const commonLine = line.replace(/\s/g, '');

    if (exportsReg.test(commonLine)) {
      if (/,/g.test(commonLine)) {
        // 同行
        exportsInfo.index = index;
      } else {
        // 换行
        for (let i = index; i < list.length; i++) {
          if (list[i].replace(/\s/g, '') === '],' || list[i].replace(/\s/g, '') === ']') {
            exportsInfo.index = i - 1;
            exportsInfo.isSameLine = false;
            break;
          }
        }
      }
    }
  });

  return exportsInfo;
}

// 模版path的处理
function formatTemplatePath(dialogTypeTmpPath) {
  return [
    `${dialogTypeTmpPath}/tsx.template`,
    `${dialogTypeTmpPath}/less.template`,
  ];
}

// 生成文件path的处理
function formatCreateSourcePath(dirPath, templateName) {
  return [
    `${dirPath}/${templateName}.tsx`,
    `${dirPath}/${templateName}.module.less`,
  ];
}

module.exports = {
  transComponentName,
  transDasherizeName,
  searchLastDataForRegExp,
  searchDeclarationsForRegExp,
  searchRouteForRegExp,
  searchExportsForRegExp,
  formatTemplatePath,
  formatCreateSourcePath,
};
