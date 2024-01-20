const fs = require('fs');
const path = require('path');
const { readdir, rm } = require('fs/promises');

const mergeStyles = async () => {
  try {
    const __stylesFolder = path.join(__dirname, 'styles');
    const __distFolder = path.join(__dirname, 'project-dist');
    const filesInDist = await readdir(__distFolder);
    const filesInFolder = await readdir(__stylesFolder, {
      withFileTypes: true,
    });
    const bundlePath = path.join(__distFolder, 'bundle.css');
    if (filesInDist.includes('bundle.css')) {
      await rm(bundlePath);
    }

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
mergeStyles();
