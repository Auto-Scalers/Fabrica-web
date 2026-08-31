import fs from 'fs';
import path from 'path';
const dir = 'components';
function walk(d) {
  let r = [];
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) r = r.concat(walk(p));
    else if (f.endsWith('.tsx')) r.push(p);
  }
  return r;
}
const files = walk(dir);
let hard = [];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((ln, i) => {
    if (ln.includes('useTranslations') || ln.includes('t(')) return;
    if (ln.trim().startsWith('//') || ln.trim().startsWith('*') || ln.trim().startsWith('import')) return;
    const m = ln.match(/>([A-Za-z][A-Za-z ,.!?'`]{6,})</g);
    if (m) {
      m.forEach(txt => {
        const t = txt.slice(1, -1).trim();
        if (/[a-z]{4,}/.test(t) && !t.includes('http') && !t.includes('className') && !t.includes('TODO')) {
          hard.push(f + ':' + (i + 1) + ' >> ' + t);
        }
      });
    }
  });
}
fs.writeFileSync('C:/Users/BABALS~1/AppData/Local/Temp/hardcoded.txt', hard.join('\n'));
console.log('Potential hardcoded English snippets found:', hard.length);
