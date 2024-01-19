const path = require('path');
const { readdir, mkdir, rm, copyFile } = require('fs/promises');

const copyDir = async () => {
  try {
    const __currentFolder = path.join(__dirname, 'files');
    const __copyFolder = path.join(__dirname, 'files-copy');
    const files = await readdir(__dirname);
    const filesInFolder = await readdir(__currentFolder, {
      withFileTypes: true,
    });

    if (files.includes('files-copy')) {
      await rm(__copyFolder, { recursive: true });
    }
    await mkdir(__copyFolder);

    for (const file of filesInFolder) {
      const currFilePath = path.join(__currentFolder, file.name);
      const copyFilePath = path.join(__copyFolder, file.name);
      await copyFile(currFilePath, copyFilePath);
    }
  } catch (err) {
    console.log(err);
  }
};
copyDir();
