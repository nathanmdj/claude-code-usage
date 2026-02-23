const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const SERVICE = "Claude Code-credentials";

function readCredentialsFile() {
  const credFile = path.join(os.homedir(), ".claude", ".credentials.json");
  const raw = fs.readFileSync(credFile, "utf-8").trim();
  return JSON.parse(raw);
}

function readCredentialsMacOS() {
  const raw = execSync(`security find-generic-password -s "${SERVICE}" -w`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
  return JSON.parse(raw);
}

function readCredentialsLinux() {
  // Try secret-tool first (GNOME keyring)
  try {
    const username = os.userInfo().username;
    const raw = execSync(
      `secret-tool lookup service "${SERVICE}" account "${username}"`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
    return JSON.parse(raw);
  } catch {
    // Fall back to plain credentials file (headless Linux, EC2, WSL)
    return readCredentialsFile();
  }
}

function readCredentialsWindows() {
  // Claude Code on Windows uses DPAPI via Electron's safeStorage.
  // The credentials are stored in the Windows Credential Manager.
  const ps = `
    Add-Type -AssemblyName System.Security
    $target = "${SERVICE}"
    $cred = [System.Runtime.InteropServices.Marshal]
    # Use cmdkey to list, then PowerShell to read
    $bytes = [System.Text.Encoding]::UTF8.GetBytes("")
    # Fallback: try reading from credential manager via .NET
    [Windows.Security.Credentials.PasswordVault,Windows.Security.Credentials,ContentType=WindowsRuntime] | Out-Null
    $vault = New-Object Windows.Security.Credentials.PasswordVault
    $cred = $vault.FindAllByResource("${SERVICE}") | Select-Object -First 1
    $cred.RetrievePassword()
    Write-Output $cred.Password
  `.trim();

  const raw = execSync(
    `powershell -NoProfile -Command "${ps.replace(/"/g, '\\"')}"`,
    { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
  ).trim();
  return JSON.parse(raw);
}

function getAccessToken() {
  const platform = os.platform();
  let creds;

  try {
    if (platform === "darwin") {
      creds = readCredentialsMacOS();
    } else if (platform === "linux") {
      creds = readCredentialsLinux();
    } else if (platform === "win32") {
      creds = readCredentialsWindows();
    } else {
      return null;
    }
  } catch {
    return null;
  }

  return creds?.claudeAiOauth?.accessToken || null;
}

module.exports = { getAccessToken };
