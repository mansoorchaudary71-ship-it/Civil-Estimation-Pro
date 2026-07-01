const fs = require('fs');

const content = fs.readFileSync('./src/routes.jsx', 'utf8');

// We want to extract paths. We can just use regex.
const list = [];
const lines = content.split('\n');
let currentPrefix = '';

for (const line of lines) {
  const matchParent = line.match(/path:\s*"(\/calculators\/[^"]+)"/);
  if (matchParent) {
    currentPrefix = matchParent[1];
    list.push(currentPrefix);
    continue;
  }
  const matchChild = line.match(/\{\s*path:\s*"([^"]+)"/);
  if (matchChild && currentPrefix) {
    list.push(currentPrefix + '/' + matchChild[1]);
  }
}

// Add static top-level routes
list.push('/', '/about', '/pricing', '/standards');

fs.writeFileSync('routes_list.json', JSON.stringify(list, null, 2));
console.log('Generated routes_list.json');
