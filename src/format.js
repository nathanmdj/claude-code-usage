// ANSI 256-color gradient: dark green → deep red
const LEVEL_COLORS = [
  '\x1b[38;5;22m',  // 0-10%  dark green
  '\x1b[38;5;28m',  // 11-20% soft green
  '\x1b[38;5;34m',  // 21-30% medium green
  '\x1b[38;5;100m', // 31-40% green-yellowish
  '\x1b[38;5;142m', // 41-50% olive
  '\x1b[38;5;178m', // 51-60% muted yellow
  '\x1b[38;5;172m', // 61-70% yellow-orange
  '\x1b[38;5;166m', // 71-80% darker orange
  '\x1b[38;5;160m', // 81-90% dark red
  '\x1b[38;5;124m', // 91-100% deep red
];

const BLUE = '\x1b[0;34m';
const GREEN = '\x1b[0;32m';
const GRAY = '\x1b[0;90m';
const YELLOW = '\x1b[0;33m';
const RESET = '\x1b[0m';
const SEP = `${GRAY} \u2502 ${RESET}`;

function getUsageColor(pct) {
  const idx = Math.min(Math.floor(pct / 10), 9);
  return LEVEL_COLORS[idx] || LEVEL_COLORS[9];
}

function buildProgressBar(pct) {
  let filled;
  if (pct === 0) filled = 0;
  else if (pct >= 100) filled = 10;
  else filled = Math.round((pct * 10) / 100);
  filled = Math.max(0, Math.min(10, filled));
  return ' ' + '\u2593'.repeat(filled) + '\u2591'.repeat(10 - filled);
}

function formatResetTime(resetsAt) {
  if (!resetsAt) return '';
  try {
    const d = new Date(resetsAt);
    if (isNaN(d.getTime())) return '';
    // Use locale-aware time formatting
    const time = d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return ` \u2192 Reset: ${time}`;
  } catch {
    return '';
  }
}

function formatStatusLine(usage, stdinData) {
  const parts = [];

  // Directory name
  const cwd = stdinData?.cwd || stdinData?.workspace?.current_dir || '';
  if (cwd) {
    const dirName = cwd.split('/').pop() || cwd.split('\\').pop() || cwd;
    parts.push(`${BLUE}${dirName}${RESET}`);
  }

  // Git branch (from stdin if available, otherwise skip — keep it fast)
  // The statusline stdin doesn't include git branch, so we read it ourselves
  try {
    const { execSync } = require('child_process');
    const branch = execSync('git branch --show-current 2>/dev/null', {
      encoding: 'utf-8',
      cwd: cwd || undefined,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (branch) {
      parts.push(`${GREEN}\u23C7 ${branch}${RESET}`);
    }
  } catch {
    // Not a git repo
  }

  // Usage
  if (usage) {
    const pct = Math.round(usage.five_hour?.utilization ?? 0);
    const color = getUsageColor(pct);
    const bar = buildProgressBar(pct);
    const reset = formatResetTime(usage.five_hour?.resets_at);
    parts.push(`${color}Usage: ${pct}%${bar}${reset}${RESET}`);
  } else {
    parts.push(`${YELLOW}Usage: ~${RESET}`);
  }

  return parts.join(SEP);
}

module.exports = { formatStatusLine };
