# Ensure the script runs with Administrator privileges
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Please restart this script as an Administrator!"
    Exit
}

function Show-Menu {
    Clear-Host
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "     WINDOWS 11 AI UTILITY TOOL      " -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "1. Run System Health Check (SFC & DISM)"
    Write-Host "2. Clean Temporary Junk Files"
    Write-Host "3. Flush DNS Cache (Fix Internet)"
    Write-Host "4. Exit"
    Write-Host "=====================================" -ForegroundColor Cyan
}

do {
    Show-Menu
    $choice = Read-Host "Select an option [1-4]"

    switch ($choice) {
        "1" {
            Write-Host "`n[!] Repairing system files..." -ForegroundColor Yellow
            DISM.exe /Online /Cleanup-Image /RestoreHealth
            sfc /scannow
            Read-Host "`nPress Enter to return to menu"
        }
        "2" {
            Write-Host "`n[!] Cleaning junk files..." -ForegroundColor Yellow
            Remove-Item -Path "$env:TEMP\*" -Recurforce -ErrorAction SilentlyContinue
            Remove-Item -Path "C:\Windows\Temp\*" -Recurforce -ErrorAction SilentlyContinue
            Write-Host "[+] Temp files cleared!" -ForegroundColor Green
            Read-Host "`nPress Enter to return to menu"
        }
        "3" {
            Write-Host "`n[!] Flushing DNS..." -ForegroundColor Yellow
            ipconfig /flushdns
            Write-Host "[+] DNS flushed successfully!" -ForegroundColor Green
            Read-Host "`nPress Enter to return to menu"
        }
        "4" {
            Write-Host "`nExiting. Have a great day!" -ForegroundColor Cyan
            Break
        }
        Default {
            Write-Host "`nInvalid choice. Try again." -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
} while ($choice -ne "4")
