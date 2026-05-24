import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const FORBIDDEN_SINGULAR = new Set([
  'model',
  'service',
  'type',
  'interface',
  'enum',
  'pipe',
  'util',
  'guard',
  'store',
  'adapter',
  'hook',
  'constant',
  'helper',
  'validator',
  'directive',
  'resolver',
  'animation',
  'facade',
  'form',
  'interceptor',
  'strategy',
  'token',
  'abstract',
]);

const SKIP = new Set([
  'node_modules',
  '.next',
  '.git',
  '.omc',
  'public',
  'messages',
]);

let hasErrors = false;

function check(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (!statSync(fullPath).isDirectory()) continue;
    if (SKIP.has(entry)) continue;
    if (FORBIDDEN_SINGULAR.has(entry)) {
      console.error(`❌  ${relative('.', fullPath)}  →  rename to "${entry}s"`);
      hasErrors = true;
    }
    check(fullPath);
  }
}

check('src');

if (hasErrors) {
  process.exit(1);
} else {
  console.warn('✅ All folder names are correct');
}
