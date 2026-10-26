param(
    [ValidateSet('Start','Stop','Restart')][string]$Action = 'Start',
    [ValidateRange(1024,65535)][int]$Port = 3103,
    [switch]$NoBrowser
)
$ErrorActionPreference = 'Stop'
$workspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$identity = $workspace.Replace('\','/').ToLowerInvariant()
$sha = [Security.Cryptography.SHA256]::Create()
try { $rootId = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($identity)))).Replace('-','').ToLowerInvariant().Substring(0,16) }
finally { $sha.Dispose() }
$runtimeBase = Join-Path ([IO.Path]::GetTempPath()) "cizentech-support-$rootId-$Port"
$stateFile = "$runtimeBase.json"
$baseUrl = "http://127.0.0.1:$Port"

function Test-Listening {
    $client = [Net.Sockets.TcpClient]::new()
    try { return $client.ConnectAsync('127.0.0.1', $Port).Wait(300) -and $client.Connected }
    catch { return $false }
    finally { $client.Dispose() }
}
function Get-Preview {
    try {
        $status = Invoke-RestMethod "$baseUrl/__preview/status" -TimeoutSec 2
        if ($status.app -eq 'cizentech-support-preview' -and $status.rootId -eq $rootId) { return $status }
    } catch {}
    return $null
}
function Find-Node {
    $command = Get-Command node.exe -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
    $candidates = @(
        (Join-Path $workspace '..\Homepage\bin\node\node.exe'),
        (Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe')
    )
    foreach ($candidate in $candidates) { if (Test-Path -LiteralPath $candidate) { return [IO.Path]::GetFullPath($candidate) } }
    throw 'Node.js was not found. Install Node.js or add it to PATH.'
}
function Stop-Preview {
    if (-not (Test-Listening)) {
        if (Test-Path -LiteralPath $stateFile) { Remove-Item -LiteralPath $stateFile }
        Write-Host "[OK] Preview is already stopped ($Port)."
        return
    }
    $status = Get-Preview
    if (-not $status) { throw "Port $Port belongs to another server. Stop it in its own terminal (Ctrl+C), or choose -Port 3107. No process was terminated." }
    if (-not (Test-Path -LiteralPath $stateFile)) { throw 'Preview state file is missing; cannot authorize shutdown.' }
    $saved = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    if ($saved.rootId -ne $rootId -or $saved.pid -ne $status.pid) { throw 'Preview identity does not match the saved state; shutdown refused.' }
    Invoke-WebRequest -UseBasicParsing -Method Post "$baseUrl/__preview/stop" -Headers @{'X-Preview-Token'=$saved.token} -TimeoutSec 3 | Out-Null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if (-not (Test-Listening)) { Write-Host "[OK] Preview stopped ($Port)."; return }
        Start-Sleep -Milliseconds 100
    }
    throw 'The preview server did not stop in time.'
}
function Start-Preview {
    if (Test-Listening) {
        if (-not (Get-Preview)) { throw "Port $Port belongs to another server. Stop it in its own terminal (Ctrl+C), or use start-local.bat -Port 3107. No process was terminated." }
        Write-Host "[OK] Preview is already running: $baseUrl/"
    } else {
        $node = Find-Node
        & $node (Join-Path $PSScriptRoot 'build-seo.js')
        if ($LASTEXITCODE -ne 0) { throw 'Documentation build failed.' }
        $serverFile = Join-Path $PSScriptRoot 'local-server.js'
        $secret = [Guid]::NewGuid().ToString('N')
        $arguments = '"{0}" --port {1} --state "{2}" --token {3}' -f $serverFile, $Port, $stateFile, $secret
        $process = Start-Process -FilePath $node -ArgumentList $arguments -WorkingDirectory $workspace -WindowStyle Hidden -PassThru -RedirectStandardOutput "$runtimeBase.log" -RedirectStandardError "$runtimeBase.error.log"
        $ready = $false
        for ($attempt = 0; $attempt -lt 40; $attempt++) {
            if (Get-Preview) { $ready = $true; break }
            if ($process.HasExited) { break }
            Start-Sleep -Milliseconds 150
        }
        if (-not $ready) { throw "Preview failed to start. See $runtimeBase.error.log" }
        Write-Host "[OK] Preview started: $baseUrl/"
    }
    if (-not $NoBrowser) { Start-Process "$baseUrl/" }
}
try {
    if ($Action -in @('Stop','Restart')) { Stop-Preview }
    if ($Action -in @('Start','Restart')) { Start-Preview }
    exit 0
} catch {
    Write-Host "[FAIL] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
