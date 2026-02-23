# claude-code-usage

Cross-platform Claude Code status line with real-time usage tracking via Anthropic OAuth API.

![Usage: 45% ▓▓▓▓▓░░░░░ → Reset: 3:15 PM](https://img.shields.io/badge/Usage-45%25-yellow)

Shows your Claude Code usage percentage, a colored progress bar, and reset time directly in the Claude Code CLI status line.

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

That's it. Restart Claude Code and you'll see:

```
boxedflows │ ⎇ main │ Usage: 7% ▓░░░░░░░░░ → Reset: 10:00 PM
```

## What it shows

- **Directory name** — current working directory
- **Git branch** — current branch (if in a git repo)
- **Usage %** — your 5-hour Claude usage utilization
- **Progress bar** — 10-block visual with color gradient (green → red)
- **Reset time** — when your usage window resets (local time)

## How it works

1. Reads your Claude Code OAuth credentials from the platform credential store
2. Calls the Anthropic OAuth usage API (`/api/oauth/usage`)
3. Caches the result for 30 seconds to avoid excessive API calls
4. Outputs a formatted, color-coded status line

## Platform support

| Platform | Credential Store |
|----------|-----------------|
| macOS | Keychain (`security` CLI) |
| Linux | libsecret (`secret-tool` CLI) |
| Windows | Windows Credential Manager |

## Requirements

- **Node.js** >= 18
- **Claude Code CLI** installed and authenticated (the credentials are created automatically when you log in)

## Zero dependencies

Uses only Node.js built-ins — no native modules, no compilation needed.

## License

MIT
