const fs = require('fs');
const path = require('path');
const { readdir, rm, mkdir, copyFile, writeFile } = require('fs/promises');

const buildPage = async () => {
  try {
    const __distFolder = path.join(__dirname, 'project-dist');
    const distInFolder = await readdir(__dirname);

    if (distInFolder.includes('project-dist')) {
      await rm(__distFolder, { recursive: true });
    }

    copyAssets(__distFolder);
    mergeStyles(__distFolder);
    createHtml(__distFolder);

  } catch (err) {
    console.log(err);
  }
};

const copyAssets = async (src) => {
  try {
    const __assetsFolder = path.join(__dirname, 'assets');
    const __assetsDistFolder = path.join(src, 'assets');
    await mkdir(src, { recursive: true });
    await mkdir(__assetsDistFolder, { recursive: true });
    copyDir(__assetsFolder, __assetsDistFolder);

  } catch (err) {
    console.log(err);
  }
};

const copyDir = async (src, srcDist) => {
  try {
    const files = await readdir(src);
    for (const file of files) {
      const __currentPath = path.join(src, file);
      const __currentDistPath = path.join(srcDist, file);
      fs.stat(__currentPath, (err, stats) => {
        if (!stats.isFile()) {
          mkdir(__currentDistPath);
          copyDir( __currentPath,__currentDistPath,);
        } else {
          copyFile((__currentPath), (__currentDistPath));
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const mergeStyles = async (src) => {
  try {
    const __stylesFolder = path.join(__dirname, 'styles');
    const stylesFiles = await readdir(__stylesFolder);
    const __stylePath = path.join(src, 'style.css');
    const output = fs.createWriteStream(__stylePath);
    for (const file of stylesFiles) {
      const pathFile = path.join(__stylesFolder, file);
      fs.stat(pathFile, (err, stats) => {
        if (stats.isFile() && path.extname(file) === '.css') {
          const stream = fs.createReadStream(pathFile, 'utf-8');
          stream.pipe(output);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const createHtml = async (src) => {
  try {
    const __htmlDistPath = path.join(src, 'index.html');
    const __htmlPath = path.join(__dirname, 'template.html');
    const __compPath = path.join(__dirname, 'components');
    const filesInComp = await readdir(__compPath);
    let data = '';
    const stream = fs.createReadStream(__htmlPath, 'utf-8');
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => changeTags(data));

    let changeTags = (dataTemplate) => {
      for (const file of filesInComp) {
        const __fileName = path.basename(file, '.html');
        const __filePath = path.join(__compPath, file);
        const currentStream = fs.createReadStream(__filePath, 'utf-8');
        let currentData = '';
        currentStream.on('data', chunk => currentData += chunk);
        currentStream.on('end', () => {
          dataTemplate = dataTemplate.replace(`{{${__fileName}}}`, currentData);
          writeFile(__htmlDistPath, dataTemplate);
        });
      }
    };
  } catch (err) {
    console.log(err);
  }
};
buildPage();