// Minimal CDP client for driving the app's WebView2 (no deps, Node >= 22).
import { writeFileSync } from 'fs';

const PORT = 9222;

export async function findPageTarget(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('no CDP page target found (is the app running with --remote-debugging-port=9222?)');
}

export class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data.toString());
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id);
        this.pending.delete(m.id);
        if (m.error) rej(new Error(m.method + ': ' + JSON.stringify(m.error)));
        else res(m.result);
      }
    });
  }

  static async create() {
    const target = await findPageTarget();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', rej, { once: true });
    });
    return new CDP(ws);
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => this.pending.set(id, { res, rej }));
  }

  async eval(expr) {
    const r = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      throw new Error('page exception: ' + JSON.stringify(r.exceptionDetails));
    }
    return r.result.value;
  }

  async poll(expr, until, { timeoutMs = 120000, intervalMs = 400 } = {}) {
    const deadline = Date.now() + timeoutMs;
    let last;
    while (Date.now() < deadline) {
      last = await this.eval(expr);
      if (until(last)) return last;
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error('poll timeout; last=' + JSON.stringify(last));
  }

  async shot(file) {
    const r = await this.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(file, Buffer.from(r.data, 'base64'));
    return file;
  }

  close() {
    try { this.ws.close(); } catch {}
  }
}
