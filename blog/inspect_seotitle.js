const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'posts.json');
const s = fs.readFileSync(p, 'utf8');
let idx = 0;
let count = 0;
while((idx = s.indexOf('"seoTitle"', idx)) !== -1){
  count++;
  const start = Math.max(0, idx-120);
  const end = Math.min(s.length, idx+40);
  console.log('\n--- OCCURRENCE', count, 'AT', idx, '---');
  console.log(s.slice(start, end));
  idx += 9;
}
console.log('\nTOTAL', count);