const fs = require('fs');
const path = require('path');
const configJsonPath = require(path.resolve(__dirname, '../config.json'));
var folder = '';
var basePath = '';

const treeOption = {
  label: 'text',
  children: 'items',
  link: 'link',
};

/**
 * @desc 根据路径生成目录结构
 * @param { boolean } a
 * @return { boolean } 返回值为true
 */
exports.generateFileTree = function (obj) {
  folder = obj.path;
  basePath = obj.name;

  const data = folderToTree(obj.path);
  return data.items;
};

// 处理文件名称
function handleProcessFileName(name, isDirectory) {
  let keyStr = '';
  let code = '';

  if (isDirectory) {
    keyStr = 'folder';
    code = name.split('-')[1] || name;
  } else {
    keyStr = 'file';
    code = name.replace('.md', '').split('-')[1] || name;
  }
  return configJsonPath[keyStr][code];
}

function folderToTree(folderPath) {
  const tree = {
    [treeOption.label]: handleProcessFileName(path.basename(folderPath), 1),
    [treeOption.children]: [],
  };

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      tree[treeOption.children].push(folderToTree(filePath));
    } else {
      tree[treeOption.children].push({
        [treeOption.label]: handleProcessFileName(path.basename(filePath), 0),
        [treeOption.link]: '/' + basePath + filePath.split(folder)[1].replace('.md', '').replaceAll('\\', '/'),
      });
    }
  });

  return tree;
}
