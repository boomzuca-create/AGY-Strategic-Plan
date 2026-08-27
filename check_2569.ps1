$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY3NqcnN4c2x3bHBmZmh5dHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTE1NTksImV4cCI6MjEwMjc2NzU1OX0.MKWalropSlSI75a9IoIzWuO_M70ynTa55A9AIPrbEs0'
$headers = @{
    'apikey' = $key
    'Authorization' = "Bearer $key"
}
$res = Invoke-RestMethod -Uri 'https://gjcsjrsxslwlpffhytwl.supabase.co/rest/v1/strategic_kpis?fiscal_year=eq.2569&order=order_num.asc&limit=5' -Headers $headers -Method Get
foreach ($r in $res) {
    Write-Host "KPI: $($r.kpi_id) | Order: $($r.order_num) | Target: $($r.target) | Actual: $($r.actual) | Status: $($r.status)"
}
