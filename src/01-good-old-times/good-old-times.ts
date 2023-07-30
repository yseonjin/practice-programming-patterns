import fs, { OpenMode } from 'fs';
import path from 'path';

function touchOpen(filename: string, flags: OpenMode): number {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
  return fs.openSync(filename, flags);
}

export function main() {
  let data = [];
  const dataBuffer = Buffer.from(new ArrayBuffer(1024));

  const stopWordFd = fs.openSync(
    path.join(__dirname, '../stop_words.txt'),
    'r'
  );

  fs.readSync(stopWordFd, dataBuffer, 0, dataBuffer.length, null);

  data = data.concat(dataBuffer.toString('utf8').split(','));

  data.push([]);
  data.push(null);
  data.push(0);
  data.push(false);
  data.push('');
  data.push('');
  data.push(0);

  const wordFreqs = touchOpen(
    path.join(__dirname, 'result/word_freqs.txt'),
    'rb+'
  );

  const inputFile = fs
    .readFileSync(path.join(__dirname, '../pride-and-prejudice.txt'), 'utf-8')
    .split('\n');

  for (let lineIndex = 0; lineIndex < inputFile.length; lineIndex++) {
    data[1] = [inputFile[lineIndex]];
    if (data[1][0] === '') {
      break;
    }
    if (data[1][0][data[1][0].length - 1] !== '\n') {
      data[1][0] += '\n';
    }
    data[2] = null;
    data[3] = 0;

    for (let charIndex = 0; charIndex < data[1][0].length; charIndex++) {
      const c = data[1][0][charIndex];
      if (data[2] === null) {
        if (c.match(/[a-zA-Z0-9]/)) {
          data[2] = data[3];
        }
      } else {
        if (!c.match(/[a-zA-Z0-9]/)) {
          data[4] = false;
          data[5] = data[1][0].substring(data[2], data[3]).toLowerCase();
          if (data[5].length >= 2 && !data[0].includes(data[5])) {
            while (true) {
              const line = fs.readFileSync(wordFreqs, 'utf-8').trim();
              if (line === '') {
                break;
              }
              data[7] = parseInt(line.split(',')[1]);
              data[6] = line.split(',')[0].trim();
              if (data[5] === data[6]) {
                data[7] += 1;
                data[4] = true;
                break;
              }
            }
            if (!data[4]) {
              fs.writeSync(
                wordFreqs,
                data[5] + ',' + ('0000' + 1).slice(-4) + '\n'
              );
            } else {
              fs.writeSync(
                wordFreqs,
                data[5] + ',' + ('0000' + data[7]).slice(-4) + '\n'
              );
            }
          }
          data[2] = null;
        }
      }
      data[3] += 1;
    }
  }

  data = [];

  data = data.concat(Array(25 - data.length).fill([]));
  data.push('');
  data.push(0);

  while (true) {
    data[25] = fs.readFileSync(wordFreqs, 'utf-8').trim();
    if (data[25] === '') {
      break;
    }
    data[26] = parseInt(data[25].split(',')[1]);
    data[27] = data[25].split(',')[0].trim();
    for (let i = 0; i < 25; i++) {
      if (data[i].length === 0 || data[i][1] < data[26]) {
        data.splice(i, 0, [data[26], data[27]]);
        data.pop();
        break;
      }
    }
  }

  for (const result of data.slice(0, 25)) {
    if (result.length === 2) {
      console.log(result[0], ' - ', result[1]);
    }
  }
}
