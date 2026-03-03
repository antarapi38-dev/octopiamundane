const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/#D4A843/g, '#7BA876')
    .replace(/#B8902A/g, '#2E5F3E')
    .replace(/rgba\(201, 168, 76/g, 'rgba(123, 168, 118')
    .replace(/rgba\(201,168,76/g, 'rgba(123,168,118')
    .replace(/#e5b954/g, '#92C48C'); // lighter hover color
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Updated', file);
  }
});
