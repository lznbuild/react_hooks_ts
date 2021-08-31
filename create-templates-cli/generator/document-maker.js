const tmp_translation = require('../utils/tmp.translation');
const translation = require('../utils/translation');

// html or css  生成块
function createHtmlOrCss(Path, tmpPath, tmpName, prefix) {
  const renderData = {
    componentName: translation.transComponentName(tmpName, prefix),
    tmpName,
  };

  return tmp_translation.writeContent(Path, renderData, tmpPath);
}


module.exports = {
  createHtmlOrCss,
};
