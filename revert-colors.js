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
    .replace(/#7BA876/g, '#D4A843')
    .replace(/#2E5F3E/g, '#B8902A')
    .replace(/rgba\(123, 168, 118/g, 'rgba(201, 168, 76')
    .replace(/rgba\(123,168,118/g, 'rgba(201,168,76')
    .replace(/#92C48C/g, '#e5b954');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Updated', file);
  }
});
