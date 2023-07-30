
import fs, { OpenMode } from 'fs';
import path from 'path';


  const inputText = fs
    .readFileSync(path.join(__dirname, '../pride-and-prejudice.txt'), 'utf-8')
    .split('\n');

  const stopWords = fs.
    readFileSync(path.join(__dirname, '../pride-and-prejudice.txt'), 'utf-8')
    .split('\n');


  const filteredWords = words.filter((word) => !stopWords.includes(word));
  return filteredWords;
}

function countWordOccurrences(words: string[]): Map<string, number> {
  const wordOccurrences = new Map<string, number>();
  for (const word of words) {
    wordOccurrences.set(word, (wordOccurrences.get(word) || 0) + 1);
  }
  return wordOccurrences;
}


const wordOccurrences = countWordOccurrences(nonStopWords);

const sortedWordOccurrences = new Map([...wordOccurrences.entries()].sort((a, b) => b[1] - a[1]));
const topWords = [...sortedWordOccurrences.entries()].slice(0, 25);

for (const [word, count] of topWords) {
  console.log(`${word} - ${count}`);
}

