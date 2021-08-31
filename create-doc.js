
const path = require('path')
const fs = require('fs-extra')
const reactDocs = require('react-docgen')
const prettier = require('prettier')

// 读取文件内容
const content = fs.readFileSync(path.resolve('./src/component/person.tsx'), 'utf-8')
// 提取组件信息
const componentInfo = reactDocs.parse(content)

// 生成markdown文档
fs.writeFileSync(path.resolve('./src/component/person.md'), commentToMarkDown(componentInfo))

// 把react-docgen提取的信息转换成markdown格式
function commentToMarkDown(componentInfo) {
  let { props } = componentInfo
  const markdownInfo = renderMarkDown(props)
  // 使用prettier美化格式
  const content = prettier.format(markdownInfo, {
    parser: 'markdown'
  })
  return content
}
function renderMarkDown(props) {
  return `## 参数 Props
  | 属性 |  类型 | 默认值 | 必填 | 描述 |
  | --- | --- | --- | --- | ---|
  ${Object.keys(props)
    .map((key) => renderProp(key, props[key]))
    .join('')}
  `
}

function getType(type) {
  const handler = {
    enum: (type) =>
      type.value.map((item) => item.value.replace(/'/g, '')).join(' \\| '),
    union: (type) => type.value.map((item) => item.name).join(' \\| ')
  }
  if (typeof handler[type.name] === 'function') {
    return handler[type.name](type).replace(/\|/g, '')
  } else {
    return type.name.replace(/\|/g, '')
  }
}

// 渲染1行属性
function renderProp(
  name,
  { type = { name: '-' }, defaultValue = { value: '-' }, required, description }
) {
  return `| ${name} | ${getType(type)} | ${defaultValue.value.replace(
    /\|/g,
    '<span>|</span>'
  )} | ${required ? '✓' : '✗'} |  ${description || '-'} |
  `
}