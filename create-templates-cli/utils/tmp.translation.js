const fs = require('fs');
const Handlebars = require('handlebars');
const chalk = require('chalk');

function writeContent(dest_file_path, data_obj, template_path) {

  return new Promise((resolve) => {
    const source = fs.readFileSync(template_path, 'utf8');

    const template = Handlebars.compile(source);

    // Handlebars.registerHelper('raw-loud', (options) => options.fn());

    const content = template(data_obj);

    try {
      fs.writeFileSync(dest_file_path, content);

      console.log(chalk.green(`✔ ${dest_file_path} 创建完成`));

      resolve();
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = {
  writeContent
};
