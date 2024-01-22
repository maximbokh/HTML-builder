const fs = require('fs');
const path = require('path');
const { readdir, rm, mkdir, copyFile, writeFile } = require('fs/promises');

const buildPage = async () => {
  try {
    const __projectFolder = path.join(__dirname, 'project-dist');
    const files = await readdir(__dirname);

    if (files.includes('project-dist')) {
      await rm(__projectFolder, { recursive: true });
    }
    await mkdir(__projectFolder);

    copyDir(__currentFolder, __copyFolder);
    mergeStyles(__projectFolder);
    createHtml();
  } catch (err) {
    console.log(err);
  }
};
buildPage();

const mergeStyles = async (src) => {
  try {
    const __stylesFolder = path.join(__dirname, 'styles');
    const filesInFolder = await readdir(__stylesFolder, {
      withFileTypes: true,
    });
    const bundlePath = path.join(src, 'style.css');
    const outputFile = fs.createWriteStream(bundlePath);

    for (const file of filesInFolder) {
      const pathFile = path.join(file.path, file.name);
      const typeOfFile = path.extname(pathFile);

      if (file.isFile() && typeOfFile === '.css') {
        const stream = fs.createReadStream(pathFile, 'utf-8');
        stream.pipe(outputFile);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const copyDir = async (pathFolder, pathCopyFolder) => {
  try {
    const filesInFolder = await readdir(pathFolder, {
      withFileTypes: true,
    });

    await mkdir(pathCopyFolder);

    for (const file of filesInFolder) {
      if (file.isDirectory()) {
        copyDir(
          path.join(pathFolder, file.name),
          path.join(pathCopyFolder, file.name),
        );
      } else {
        copyFile(
          path.join(pathFolder, file.name),
          path.join(pathCopyFolder, file.name),
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const __currentFolder = path.join(__dirname, 'assets');
const __copyFolder = path.join(__dirname, 'project-dist', 'assets');

const createHtml = async () => {
  try {
    const pathComponents = path.join(__dirname, 'components');
    const pathIndexFile = path.join(__dirname, 'project-dist', 'index.html');
    const filesComponents = await readdir(pathComponents, {
      withFileTypes: true,
    });
    let data = '';
    const fileTemplate = path.join(__dirname, 'template.html');
    const stream = fs.createReadStream(pathIndexFile, 'utf-8');
    await copyFile(fileTemplate, pathIndexFile);
    stream.on('data', (chunk) => (data += chunk));
    stream.on('end', () => changeTags(data));

    const changeTags = (dataTemplate) => {
      for (const file of filesComponents) {
        const fileName = file.name.split('.')[0];
        const filePath = path.join(file.path, file.name);
        const currentStream = fs.createReadStream(filePath, 'utf-8');
        let currentData = '';
        currentStream.on('data', (chunk) => (currentData += chunk));
        currentStream.on('end', () => {
          dataTemplate = dataTemplate.replace(`{{${fileName}}}`, currentData);
          writeFile(pathIndexFile, dataTemplate);
        });
      }
    };
  } catch (err) {
    console.log(err);
  }
};
