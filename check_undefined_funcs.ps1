$content = [System.IO.File]::ReadAllText('d:\AGY\app.js', [System.Text.Encoding]::UTF8)

# Find all function definitions
$defMatches = [regex]::Matches($content, 'function\s+([a-zA-Z0-9_]+)\s*\(')
$definedFunctions = [System.Collections.Generic.HashSet[string]]::new()
foreach ($m in $defMatches) {
    [void]$definedFunctions.Add($m.Groups[1].Value)
}

# Find all function calls in key places
$calledMatches = [regex]::Matches($content, '([a-zA-Z0-9_]+)\s*\(')
$missing = [System.Collections.Generic.HashSet[string]]::new()

$knownGlobals = @('setTimeout', 'setInterval', 'clearInterval', 'clearTimeout', 'parseInt', 'parseFloat', 'Math', 'encodeURIComponent', 'decodeURIComponent', 'alert', 'confirm', 'prompt', 'fetch', 'console', 'getComputedStyle', 'Array', 'String', 'Number', 'Date', 'Boolean', 'Object', 'RegExp', 'Error', 'URL', 'Blob', 'document', 'window', 'localStorage', 'sessionStorage', 'requestAnimationFrame', 'cancelAnimationFrame', 'isNaN', 'isFinite')

foreach ($m in $calledMatches) {
    $func = $m.Groups[1].Value
    if (-not $definedFunctions.Contains($func) -and -not ($knownGlobals -contains $func) -and -not ($func -match '^[A-Z]')) {
        # Check if it's a method call like .map( or .then( or if it's a standalone call
        $idx = $m.Index
        if ($idx -gt 0) {
            $prevChar = $content[$idx - 1]
            if ($prevChar -ne '.' -and $prevChar -ne '>') {
                [void]$missing.Add($func)
            }
        }
    }
}

Write-Host "Total Defined Functions: $($definedFunctions.Count)"
Write-Host "Potentially Undefined Functions called directly:"
foreach ($fn in $missing) {
    Write-Host " - $fn"
}
