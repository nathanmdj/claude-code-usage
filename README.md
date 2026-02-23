# claude-code-usage

Cross-platform Claude Code status line with real-time usage tracking via Anthropic OAuth API.

```
project │ ⎇ main │ Usage: 7% ▓░░░░░░░░░ → Reset: 10:00 PM
```

## Why this one?

Most Claude usage trackers rely on **session keys** scraped from your browser — you have to manually copy cookies from claude.ai, paste them into config files, and refresh them when they expire. Some require a separate macOS app just to inject credentials. Others only track Claude Code CLI usage and miss activity from claude.ai, the API, or other clients.

**This package does none of that.**

It uses the **Anthropic OAuth API** — the same official API that Claude Code itself uses. Your OAuth credentials are already stored securely in your system's credential store when you log into Claude Code. No session keys, no browser cookies, no manual token management, no extra apps.

| | Session key trackers | This package |
|---|---|---|
| **Auth method** | Browser cookie (manual copy) | OAuth token (automatic) |
| **Token refresh** | Manual — breaks when expired | Handled by Claude Code |
| **Tracks all usage** | Only claude.ai OR only CLI | All platforms combined |
| **Extra apps needed** | Often yes | No |
| **Cross-platform** | Usually macOS only | macOS, Linux, Windows |
| **Dependencies** | Varies | Zero |

The usage percentage you see reflects your **total account utilization** across Claude Code CLI, claude.ai, and API — not just one client.

## Install

```bash
npm i -g @nathanmdj/claude-code-usage
```

## Setup

Add to your Claude Code settings file (`~/.claude/settings.json`):

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-code-usage"
  }
}
```

Restart Claude Code. Done.

## What it shows

- **Directory name** — current working directory
- **Git branch** — current branch (if in a git repo)
- **Usage %** — your 5-hour utilization across all Claude platforms
- **Progress bar** — 10-block visual with color gradient (green → red)
- **Reset time** — when your usage window resets (local time)

## How it works

1. Reads your Claude Code OAuth credentials from the platform credential store (already there from `claude` login)
2. Calls the Anthropic OAuth usage API (`/api/oauth/usage`)
3. Caches the result for 30 seconds to stay fast
4. Outputs a formatted, color-coded status line

No session keys. No browser cookies. No manual configuration.

## Platform support

| Platform | Credential Store |
|----------|-----------------|
| macOS | Keychain (`security` CLI) |
| Linux | libsecret (`secret-tool` CLI) |
| Windows | Windows Credential Manager |

## Requirements

- **Node.js** >= 18
- **Claude Code CLI** installed and authenticated (credentials are created automatically when you log in)

## Zero dependencies

Uses only Node.js built-ins — no native modules, no compilation, no supply chain risk.

## License

MIT
