$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY3NqcnN4c2x3bHBmZmh5dHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTE1NTksImV4cCI6MjEwMjc2NzU1OX0.MKWalropSlSI75a9IoIzWuO_M70ynTa55A9AIPrbEs0'
$headers = @{
    'apikey' = $key
    'Authorization' = "Bearer $key"
    'Content-Type' = 'application/json; charset=utf-8'
    'Prefer' = 'return=representation'
}

$body = '{"actual":"90","status":"บรรลุเป้าหมาย"}'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)

$req = [System.Net.HttpWebRequest]::Create('https://gjcsjrsxslwlpffhytwl.supabase.co/rest/v1/strategic_kpis?kpi_id=eq.KPI69-02&fiscal_year=eq.2569')
$req.Method = 'PATCH'
foreach ($k in $headers.Keys) {
    $req.Headers.Add($k, $headers[$k])
}
$req.ContentType = 'application/json; charset=utf-8'
$req.ContentLength = $bytes.Length

$stream = $req.GetRequestStream()
$stream.Write($bytes, 0, $bytes.Length)
$stream.Close()

$resp = $req.GetResponse()
$reader = [System.IO.StreamReader]::new($resp.GetResponseStream())
$result = $reader.ReadToEnd()
Write-Host "Supabase Response:"
Write-Host $result
