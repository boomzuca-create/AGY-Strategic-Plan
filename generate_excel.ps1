$csvFiles = @(
    @{ Year = "2566"; Path = "d:\AGY\KPI_2566.csv"; SheetName = "KPI_2566" },
    @{ Year = "2567"; Path = "d:\AGY\KPI_2567.csv"; SheetName = "KPI_2567" },
    @{ Year = "2568"; Path = "d:\AGY\KPI_2568.csv"; SheetName = "KPI_2568" },
    @{ Year = "2569"; Path = "d:\AGY\KPI_2569.csv"; SheetName = "KPI_2569" },
    @{ Year = "2570"; Path = "d:\AGY\KPI_2570.csv"; SheetName = "KPI_2570" }
)

# Create XML Spreadsheet 2003 format which Excel and Google Sheets open as full multi-tab workbook
$xmlBuilder = [System.Text.StringBuilder]::new()
[void]$xmlBuilder.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$xmlBuilder.AppendLine('<?mso-application progid="Excel.Sheet"?>')
[void]$xmlBuilder.AppendLine('<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"')
[void]$xmlBuilder.AppendLine(' xmlns:o="urn:schemas-microsoft-com:office:office"')
[void]$xmlBuilder.AppendLine(' xmlns:x="urn:schemas-microsoft-com:office:excel"')
[void]$xmlBuilder.AppendLine(' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"')
[void]$xmlBuilder.AppendLine(' xmlns:html="http://www.w3.org/TR/REC-html40">')

[void]$xmlBuilder.AppendLine('<Styles>')
[void]$xmlBuilder.AppendLine(' <Style ss:ID="Default" ss:Name="Normal"><Font ss:FontName="Sarabun" ss:Size="10"/><Alignment ss:Vertical="Center"/></Style>')
[void]$xmlBuilder.AppendLine(' <Style ss:ID="HeaderStyle"><Font ss:FontName="Sarabun" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#1E293B" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/></Borders></Style>')
[void]$xmlBuilder.AppendLine(' <Style ss:ID="CenterCell"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders></Style>')
[void]$xmlBuilder.AppendLine(' <Style ss:ID="LeftCell"><Alignment ss:Horizontal="Left" ss:Vertical="Center" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders></Style>')
[void]$xmlBuilder.AppendLine('</Styles>')

foreach ($item in $csvFiles) {
    $sheetName = $item.SheetName
    [void]$xmlBuilder.AppendLine(" <Worksheet ss:Name=`"$sheetName`">")
    [void]$xmlBuilder.AppendLine('  <Table ss:DefaultRowHeight="22">')
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="80"/>')  # A
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="50"/>')  # B
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="110"/>') # C
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="110"/>') # D
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="300"/>') # E
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="70"/>')  # F
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="85"/>')  # G
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="75"/>')  # H
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="85"/>')  # I
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="85"/>')  # J
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="100"/>') # K
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="150"/>') # L
    [void]$xmlBuilder.AppendLine('   <Column ss:Width="160"/>') # M

    $lines = Get-Content -Path $item.Path -Encoding UTF8
    $isHeader = $true
    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        
        # Parse CSV fields
        $fields = [System.Collections.Generic.List[string]]::new()
        $pattern = '(?<=^|,)(?:\"(?<val>[^\"]*(?:\"\"[^\"]*)*)\"|(?<val>[^,]*))'
        $matches = [regex]::Matches($line, $pattern)
        foreach ($m in $matches) {
            $val = $m.Groups['val'].Value.Replace('""', '"')
            $fields.Add($val)
        }

        $rowStyle = if ($isHeader) { ' ss:StyleID="HeaderStyle" ss:Height="32"' } else { ' ss:Height="24"' }
        [void]$xmlBuilder.AppendLine("   <Row$rowStyle>")
        
        for ($colIdx = 0; $colIdx -lt $fields.Count; $colIdx++) {
            $val = [System.Security.SecurityElement]::Escape($fields[$colIdx])
            $cellStyle = if ($isHeader) { ' ss:StyleID="HeaderStyle"' } elseif ($colIdx -eq 4 -or $colIdx -eq 11 -or $colIdx -eq 12) { ' ss:StyleID="LeftCell"' } else { ' ss:StyleID="CenterCell"' }
            
            [void]$xmlBuilder.AppendLine("    <Cell$cellStyle><Data ss:Type=`"String`">$val</Data></Cell>")
        }
        [void]$xmlBuilder.AppendLine('   </Row>')
        $isHeader = $false
    }

    [void]$xmlBuilder.AppendLine('  </Table>')
    [void]$xmlBuilder.AppendLine(' </Worksheet>')
}

[void]$xmlBuilder.AppendLine('</Workbook>')

[System.IO.File]::WriteAllText('d:\AGY\KPI_Strategic_Plan_2566_2570.xls', $xmlBuilder.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Created d:\AGY\KPI_Strategic_Plan_2566_2570.xls successfully!"
