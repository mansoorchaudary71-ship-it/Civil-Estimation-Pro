import fs from 'fs';
import path from 'path';

const dir = './src/components';
const walk = (d) => {
  let res = [];
  const list = fs.readdirSync(d);
  list.forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      res = res.concat(walk(p));
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      res.push(p);
    }
  });
  return res;
};

const files = walk(dir);

let count = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('Calculation Results')) {
    console.log(file);
  }
});
