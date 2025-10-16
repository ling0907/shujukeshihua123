# Simple PowerShell script to start interactive visualization
Write-Host "Starting Interactive Visualization Platform..." -ForegroundColor Green
Write-Host ""

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python detected: $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Warning: Python not found, opening HTML file directly" -ForegroundColor Yellow
}

# Check if file exists
if (Test-Path "interactive_visualization.html") {
    Write-Host "Found visualization file: interactive_visualization.html" -ForegroundColor Green
} else {
    Write-Host "Error: interactive_visualization.html not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Choose startup method:" -ForegroundColor Yellow
Write-Host "1. Start local server (Recommended)"
Write-Host "2. Open HTML file directly"
Write-Host ""

$choice = Read-Host "Enter choice (1-2)"

if ($choice -eq "1") {
    Write-Host "Starting local HTTP server..." -ForegroundColor Cyan
    Write-Host "Server URL: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Access URL: http://localhost:8000/interactive_visualization.html" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
    Write-Host ""
    
    try {
        python -m http.server 8000
    } catch {
        Write-Host "Failed to start server, trying port 8080..." -ForegroundColor Red
        try {
            python -m http.server 8080
        } catch {
            Write-Host "Cannot start server, please check Python installation" -ForegroundColor Red
        }
    }
} elseif ($choice -eq "2") {
    Write-Host "Opening HTML file directly..." -ForegroundColor Cyan
    try {
        Invoke-Item "interactive_visualization.html"
        Write-Host "File opened, please view in browser" -ForegroundColor Green
    } catch {
        Write-Host "Failed to open file" -ForegroundColor Red
    }
    Read-Host "Press Enter to exit"
} else {
    Write-Host "Invalid choice, starting server by default..." -ForegroundColor Yellow
    python -m http.server 8000
}