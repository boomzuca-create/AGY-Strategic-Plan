$lines = [System.IO.File]::ReadAllLines('d:\AGY\app.js', [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function renderAllCharts|function populateAICenter') {
        Write-Host "Line $($i + 1): $($lines[$i])"
    }
}
