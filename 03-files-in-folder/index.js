const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  for (const file of files) {
    if (file.isFile()) {
      const mas = file.name.split('.');
      const pathFile = path.join(file.path, file.name);

      fs.stat(pathFile, (err, file) => {
        if (err) {
          console.log(err);
        }
        const sizeKb = (file.size / 1024).toFixed(2) + 'kb';
        mas.push(sizeKb);
        console.log(mas.join(' - '));
      });
    } else if (err) {
      console.log(err);
    }
  }
});
