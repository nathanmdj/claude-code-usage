const fs = require('fs');
const path = require('path');
const os = require('os');

const CACHE_FILE = path.join(os.tmpdir(), 'claude-code-usage-cache.json');
const CACHE_TTL_MS = 30_000; // 30 seconds

function readCache() {
  try {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  } catch {
    // Cache miss
  }
  return null;
}

function writeCache(data) {
  try {
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ timestamp: Date.now(), data }),
      'utf-8'
    );
  } catch {
    // Ignore write errors
  }
}

module.exports = { readCache, writeCache };
