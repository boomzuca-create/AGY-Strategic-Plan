$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY3NqcnN4c2x3bHBmZmh5dHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTE1NTksImV4cCI6MjEwMjc2NzU1OX0.MKWalropSlSI75a9IoIzWuO_M70ynTa55A9AIPrbEs0'
$headers = @{
    'apikey' = $key
    'Authorization' = "Bearer $key"
}
$res = Invoke-RestMethod -Uri 'https://gjcsjrsxslwlpffhytwl.supabase.co/rest/v1/strategic_kpis?select=id,kpi_id,fiscal_year,order_num,kpi_name,baseline,target,actual,status' -Headers $headers -Method Get

Write-Host "Total rows in Supabase: $($res.Count)"
$edited = $res | Where-Object { $_.actual -eq '90' -or $_.actual -eq 90 }
Write-Host "Rows with actual = 90: $($edited.Count)"
foreach ($e in $edited) {
    Write-Host "ID: $($e.id) | Year: $($e.fiscal_year) | KPI: $($e.kpi_id) | Name: $($e.kpi_name) | Actual: $($e.actual)"
}

$nonEmptyActual = $res | Where-Object { $_.actual -ne $null -and $_.actual -ne '' -and $_.fiscal_year -eq '2569' }
Write-Host "Year 2569 rows with non-empty actual: $($nonEmptyActual.Count)"
