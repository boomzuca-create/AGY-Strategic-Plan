$url = 'https://gjcsjrsxslwlpffhytwl.supabase.co/rest/v1/strategic_kpis?select=kpi_id,fiscal_year,kpi_name,target,actual,status&limit=5'
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY3NqcnN4c2x3bHBmZmh5dHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTE1NTksImV4cCI6MjEwMjc2NzU1OX0.MKWalropSlSI75a9IoIzWuO_M70ynTa55A9AIPrbEs0'

$headers = @{
    'apikey' = $key
    'Authorization' = "Bearer $key"
}

try {
    $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    Write-Host "Supabase connected successfully! Count: $($res.Count)"
    foreach ($item in $res) {
        Write-Host "[$($item.fiscal_year)] $($item.kpi_id): $($item.kpi_name) | Target: $($item.target) | Actual: $($item.actual)"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
