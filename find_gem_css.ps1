$lines = [System.IO.File]::ReadAllLines('d:\AGY\style.css', [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '\.gem-draft') {
        Write-Host "Line $($i + 1): $($lines[$i])"
    }
}
