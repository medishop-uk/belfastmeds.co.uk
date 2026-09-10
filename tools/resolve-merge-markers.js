const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'tools') return [];
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function resolve(source, keepBoth) {
  const lines = source.split(/(?<=\n)/);
  const out = [];
  let mode = 'normal';
  let upstream = [];
  let stashed = [];
  let conflicts = 0;

  for (const line of lines) {
    if (mode === 'normal' && /^<<<<<<< Updated upstream\s*$/.test(line.trimEnd())) {
      mode = 'upstream';
      upstream = [];
      stashed = [];
      continue;
    }
    if (mode === 'upstream' && /^=======\s*$/.test(line.trimEnd())) {
      mode = 'stashed';
      continue;
    }
    if (mode === 'stashed' && /^>>>>>>> Stashed changes\s*$/.test(line.trimEnd())) {
      out.push(...upstream);
      if (keepBoth) out.push(...stashed);
      conflicts++;
      mode = 'normal';
      continue;
    }
    if (mode === 'upstream') upstream.push(line);
    else if (mode === 'stashed') stashed.push(line);
    else out.push(line);
  }

  if (mode !== 'normal') throw new Error('Unterminated merge conflict');
  return { source: out.join(''), conflicts };
}

let filesChanged = 0;
let conflictsResolved = 0;
for (const file of walk(root)) {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('<<<<<<< Updated upstream')) continue;
  const keepBoth = path.relative(root, file).replace(/\\/g, '/') === 'assets/css/pages.css';
  const result = resolve(source, keepBoth);
  fs.writeFileSync(file, result.source, 'utf8');
  filesChanged++;
  conflictsResolved += result.conflicts;
}

console.log(JSON.stringify({ filesChanged, conflictsResolved }));
