// Usage: node cdp_run.mjs <exprfile> [screenshot-out.png]
// Evaluates the expression contained in <exprfile> inside the app page,
// prints the JSON result, optionally saves a viewport screenshot.
import { readFileSync } from 'fs';
import { CDP } from './cdp_lib.mjs';

const exprFile = process.argv[2];
const shotOut = process.argv[3];
if (!exprFile) { console.error('need exprfile'); process.exit(1); }

const cdp = await CDP.create();
try {
  const expr = readFileSync(exprFile, 'utf8');
  const result = await cdp.eval(expr);
  console.log(JSON.stringify(result, null, 2));
  if (shotOut) {
    await cdp.shot(shotOut);
    console.log('SHOT: ' + shotOut);
  }
} finally {
  cdp.close();
}
