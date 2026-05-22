import fs from 'fs';
import path from 'path';

const walk = (dir: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/components/modules');

let replaced = 0;
files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/\{"" && <span[^>]*>\{\"\"\}<\/span>\}/g, '');
  content = content.replace(/\{"([^"]+)" && (<span[^>]*>)\{"\1"\}(<\/span>)\}/g, '$2$1$3');

  content = content.replace(/\{"([^"]*?[^"]*?)" && (<p[^>]*>)\{?"\1"\}?(<\/p>)\}/g, '$2$1$3');
  content = content.replace(/\{`([^`]+)` && (<p[^>]*>)\{?`\1`\}?(<\/p>)\}/g, '$2$1$3');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    replaced++;
    console.log('Fixed', file);
  }
});
console.log(`Replaced in ${replaced} files.`);
