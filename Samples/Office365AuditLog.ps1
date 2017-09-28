function Get-Office365AuditLog {
<#
.SYNOPSIS
Export Office 365 Audit Log
 
.PARAMETER AuditName
 
 
.PARAMETER StartDate
 
 
.PARAMETER EndDate
 
 
.PARAMETER SessionCommand
 
 
.PARAMETER RecordType
 
 
.PARAMETER Operations
 

.PARAMETER SessionCommand

.EXAMPLE 
Get-Office365AuditLog -AuditName 2017Sep1To26 -StartDate 9/1/2017 -EndDate 9/26/2017 -RecordType SharePointFileOperation -Operations FileAccessed -ResultSize 1000 -Verbose $ReportOuputPath C:\O365Audit\
.Link
https://technet.microsoft.com/en-us/library/mt238501(v=exchg.160).aspx
#>
 
    [Cmdletbinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string]$AuditName,
 
        [Parameter(Mandatory=$true)]
        [Alias("Date")]
        [string]$StartDate,
 
        [Parameter(Mandatory=$false)]
        [string]$EndDate = $null,
         
        [Parameter(Mandatory=$false)]
        [ValidateSet('ReturnLargeSet', 'ReturnNextPreviewPage', ignorecase=$true)]
        [string]$SessionCommand = "ReturnLargeSet",
 
        [Parameter(Mandatory=$true)]
            [ValidateSet('SharePointFileOperation', ignorecase=$true)]
        [string]$RecordType = $null,
 
        [Parameter(Mandatory=$true)]
            [ValidateSet('FileAccessed', 'FileDownloaded', ignorecase=$true)]
        [string]$Operations,
 
        [Parameter(Mandatory=$false, HelpMessage="Max value is 5000")]
        [string]$ResultSize = 5000, 
 
        [Parameter(Mandatory=$false)]
        [string]$ErrorLog,

        [Parameter(Mandatory=$true)]
        [string]$ReportOuputPath
    )
    BEGIN 
    {
        Write-Verbose "Executing audit $AuditName"
         
        [datetime]$start = $StartDate
        if ([string]::IsNullOrEmpty($EndDate)) {
            $EndDate = $start.AddDays(6).ToShortDateString()
            Write-Verbose "EndDate is mandatory. Auto setting EndDate to $EndDate"
        }
        else {
            [datetime]$end = $EndDate
        }

        if ([string]::IsNullOrEmpty($ReportOuputPath)) {
            $outputDir = "C:\"
            Write-Verbose "ReportOuputPath is mandatory. Auto setting ReportOuputPath to $outputDir"
        }
        else
        {
            $outputDir = $ReportOuputPath
        }
        $outputFile = [string]::Concat($outputDir, "AuditLog_", $start.ToString("yyyyMMdd"), ".csv")
        Write-Host -ForegroundColor Yellow "Output file: $outputFile"
         
    }
    PROCESS {
         
            $largedataset = Search-UnifiedAuditLog -StartDate $StartDate -EndDate $EndDate  -SessionId $AuditName -SessionCommand $SessionCommand -ResultSize $ResultSize -RecordType $RecordType -Operations $Operations 
            $largedataset | Export-Csv -LiteralPath $outputFile -NoTypeInformation
 
            Write-Verbose "Result Total: "
            $file = import-csv -LiteralPath $outputFile
            Write-Verbose $file[1].ResultCount
 
            [int]$resultcount = $largedataset.Count
            Write-Host "Result Count: $resultcount"
 
            While ($largedataset.Count -ne 0) {
                $largedataset = Search-UnifiedAuditLog -StartDate $StartDate -EndDate $EndDate  -SessionId $AuditName `
                    -SessionCommand $SessionCommand -ResultSize $ResultSize -RecordType $RecordType
                $largedataset | Export-Csv -LiteralPath $outputFile -NoTypeInformation -Append
 
                $resultcount = $resultcount + $largedataset.Count
                Write-Verbose "Result Count: $resultcount"
            }
    }
    END {
        Write-Host "Execution Completed`r`n"
    }
}

Get-Office365AuditLog -AuditName 2017Sep1To26 -StartDate 9/1/2017 -EndDate 9/26/2017 -RecordType SharePointFileOperation -Operations FileAccessed -ResultSize 1000 -ReportOuputPath C:\O365Audit\ -Verbose
