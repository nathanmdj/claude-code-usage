const { getAccessToken } = require('./credentials.js');
const { fetchUsage } = require('./api.js');
const { readCache, writeCache } = require('./cache.js');
const { formatStatusLine } = require('./format.js');

async function run() {
  // Read stdin (Claude Code sends JSON context)
  let stdinData = {};
  try {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString('utf-8').trim();
    if (raw) stdinData = JSON.parse(raw);
  } catch {
    // Ignore stdin parse errors
  }

  // Try cache first
  let usage = readCache();

  if (!usage) {
    const token = getAccessToken();
    if (token) {
      try {
        usage = await fetchUsage(token);
        writeCache(usage);
      } catch {
        // API call failed, show fallback
      }
    }
  }

  process.stdout.write(formatStatusLine(usage, stdinData) + '\n');
}

module.exports = { run };
