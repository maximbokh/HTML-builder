const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const address = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(address);

stdout.write('Enter the data:\n');
stdin.on('data', (data) => {
  const str = data.toString().trim();
  if (str === 'exit') {
    exitMode();
  }
  output.write(data);
});

function exitMode() {
  stdout.write('Data written to text.txt\n');
  process.exit();
}
process.on('SIGINT', exitMode);
